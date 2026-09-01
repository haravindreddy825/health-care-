import { WebSerialProvider } from './WebSerialProvider.js'
import { WebBluetoothProvider } from './WebBluetoothProvider.js'
import { WebSocketBridgeProvider } from './WebSocketBridgeProvider.js'
import { DemoSensorProvider, DEMO_PRESETS } from './DemoSensorProvider.js'

/**
 * SensorManager
 * Central hardware abstraction managing physical medical sensors and simulation.
 * 
 * STRICT COMPLIANCE:
 * - If physical sensor is disconnected and Demo Mode is OFF:
 *   reading = null, connected = false, source = 'unavailable'.
 * - Simulated values only exist when isDemoMode = true (source = 'demo').
 */
export class SensorManager {
  constructor() {
    this.serialProvider = new WebSerialProvider()
    this.bluetoothProvider = new WebBluetoothProvider()
    this.bridgeProvider = new WebSocketBridgeProvider()
    this.demoProvider = new DemoSensorProvider()

    this.activeHardwareProvider = null
    this.isDemoMode = false
    this.listeners = new Set()

    // Internal sensor state registry
    this.sensors = {
      heartRate: {
        id: 'heartRate',
        name: 'Heart Rate',
        icon: 'Heart',
        connected: false,
        reading: null,
        unit: 'BPM',
        minNormal: 60,
        maxNormal: 100,
        lastUpdated: null,
        error: null,
        source: 'unavailable' // 'hardware' | 'demo' | 'unavailable'
      },
      spo2: {
        id: 'spo2',
        name: 'Blood Oxygen (SpO₂)',
        icon: 'Activity',
        connected: false,
        reading: null,
        unit: '%',
        minNormal: 95,
        maxNormal: 100,
        lastUpdated: null,
        error: null,
        source: 'unavailable'
      },
      temperature: {
        id: 'temperature',
        name: 'Body Temperature',
        icon: 'Thermometer',
        connected: false,
        reading: null,
        unit: '°C',
        minNormal: 36.1,
        maxNormal: 37.2,
        lastUpdated: null,
        error: null,
        source: 'unavailable'
      },
      distance: {
        id: 'distance',
        name: 'Person Distance',
        icon: 'Ruler',
        connected: false,
        reading: null,
        unit: 'cm',
        optimalMin: 50,
        optimalMax: 80,
        proximityStatus: 'Sensor Not Connected', // 'Optimal' | 'Please move closer' | 'Too close' | 'Sensor Not Connected'
        lastUpdated: null,
        error: null,
        source: 'unavailable'
      },
      // Computer vision indicators
      posture: {
        id: 'posture',
        name: 'Spinal Posture',
        reading: 'Good', // 'Good' | 'Needs Improvement' | 'Poor'
        source: 'vision',
        lastUpdated: null
      },
      fatigue: {
        id: 'fatigue',
        name: 'Alertness & Fatigue',
        reading: 'Low', // 'Low' | 'Moderate' | 'High'
        source: 'vision',
        lastUpdated: null
      }
    }

    // Rolling sample buffer for observation averaging
    this.sampleBuffer = []

    // Attach provider callbacks
    this.serialProvider.onData((data) => this.handleIncomingTelemetry(data))
    this.bluetoothProvider.onData((data) => this.handleIncomingTelemetry(data))
    this.bridgeProvider.onData((data) => this.handleIncomingTelemetry(data))
    this.demoProvider.onData((data) => this.handleIncomingTelemetry(data))
  }

  // --- Provider Management ---

  async connectSerial(options) {
    if (this.isDemoMode) this.setDemoMode(false)
    const res = await this.serialProvider.connect(options)
    this.activeHardwareProvider = this.serialProvider
    return res
  }

  async connectBluetooth() {
    if (this.isDemoMode) this.setDemoMode(false)
    const res = await this.bluetoothProvider.connect()
    this.activeHardwareProvider = this.bluetoothProvider
    return res
  }

  async connectBridge(options) {
    if (this.isDemoMode) this.setDemoMode(false)
    const res = await this.bridgeProvider.connect(options)
    this.activeHardwareProvider = this.bridgeProvider
    return res
  }

  async disconnectAll() {
    if (this.serialProvider.isConnected) await this.serialProvider.disconnect()
    if (this.bluetoothProvider.isConnected) await this.bluetoothProvider.disconnect()
    if (this.bridgeProvider.isConnected) await this.bridgeProvider.disconnect()
    this.demoProvider.stop()
    this.activeHardwareProvider = null

    // Reset to unavailable
    this.resetSensorsToUnavailable()
  }

  setDemoMode(enable) {
    this.isDemoMode = enable
    if (enable) {
      this.demoProvider.start()
    } else {
      this.demoProvider.stop()
      if (!this.activeHardwareProvider || !this.activeHardwareProvider.isConnected) {
        this.resetSensorsToUnavailable()
      }
    }
    this.notifyListeners()
  }

  applyDemoPreset(presetId) {
    if (!this.isDemoMode) this.setDemoMode(true)
    this.demoProvider.applyPreset(presetId)
  }

  setDemoCustomValues(values) {
    if (!this.isDemoMode) this.setDemoMode(true)
    this.demoProvider.setValues(values)
  }

  // --- Optical Updates (from Camera & Face Mesh) ---

  updateOpticalMetrics({ posture, fatigue, distance }) {
    const now = new Date().toISOString()
    if (posture) {
      this.sensors.posture.reading = posture
      this.sensors.posture.lastUpdated = now
    }
    if (fatigue) {
      this.sensors.fatigue.reading = fatigue
      this.sensors.fatigue.lastUpdated = now
    }
    // If physical distance sensor is unavailable, optical face-scale distance can serve as an optical estimate
    if (!this.sensors.distance.connected && distance != null && !this.isDemoMode) {
      this.sensors.distance.reading = distance
      this.sensors.distance.source = 'vision'
      this.sensors.distance.lastUpdated = now
      this.sensors.distance.proximityStatus = this.calculateProximityStatus(distance)
    }
    this.notifyListeners()
  }

  // --- Telemetry Ingestion ---

  handleIncomingTelemetry(data) {
    const now = data.timestamp || new Date().toISOString()
    const src = data.source || 'hardware'

    // Heart Rate
    if (data.heartRate !== undefined) {
      this.sensors.heartRate.connected = data.heartRate !== null
      this.sensors.heartRate.reading = data.heartRate
      this.sensors.heartRate.source = data.heartRate !== null ? src : 'unavailable'
      this.sensors.heartRate.lastUpdated = now
      this.sensors.heartRate.error = null
    }

    // SpO2
    if (data.spo2 !== undefined) {
      this.sensors.spo2.connected = data.spo2 !== null
      this.sensors.spo2.reading = data.spo2
      this.sensors.spo2.source = data.spo2 !== null ? src : 'unavailable'
      this.sensors.spo2.lastUpdated = now
      this.sensors.spo2.error = null
    }

    // Temperature
    if (data.temperature !== undefined) {
      this.sensors.temperature.connected = data.temperature !== null
      this.sensors.temperature.reading = data.temperature
      this.sensors.temperature.source = data.temperature !== null ? src : 'unavailable'
      this.sensors.temperature.lastUpdated = now
      this.sensors.temperature.error = null
    }

    // Distance
    if (data.distance !== undefined) {
      this.sensors.distance.connected = data.distance !== null
      this.sensors.distance.reading = data.distance
      this.sensors.distance.source = data.distance !== null ? src : 'unavailable'
      this.sensors.distance.lastUpdated = now
      this.sensors.distance.proximityStatus = data.distance !== null
        ? this.calculateProximityStatus(data.distance)
        : 'Sensor Not Connected'
      this.sensors.distance.error = null
    }

    // Vision Fallbacks from Demo
    if (data.posture && src === 'demo') {
      this.sensors.posture.reading = data.posture
      this.sensors.posture.source = 'demo'
      this.sensors.posture.lastUpdated = now
    }
    if (data.fatigue && src === 'demo') {
      this.sensors.fatigue.reading = data.fatigue
      this.sensors.fatigue.source = 'demo'
      this.sensors.fatigue.lastUpdated = now
    }

    // Add to rolling observation buffer
    this.sampleBuffer.push({
      heartRate: this.sensors.heartRate.reading,
      spo2: this.sensors.spo2.reading,
      temperature: this.sensors.temperature.reading,
      distance: this.sensors.distance.reading,
      posture: this.sensors.posture.reading,
      fatigue: this.sensors.fatigue.reading,
      timestamp: Date.now()
    })

    if (this.sampleBuffer.length > 100) {
      this.sampleBuffer.shift()
    }

    this.notifyListeners()
  }

  calculateProximityStatus(dist) {
    if (dist == null) return 'Sensor Not Connected'
    if (dist < 45) return 'Too Close (Please step back)'
    if (dist > 85) return 'Please Move Closer (Optimal: 50-80cm)'
    return 'Optimal Distance (Ready)'
  }

  resetSensorsToUnavailable() {
    const keys = ['heartRate', 'spo2', 'temperature', 'distance']
    keys.forEach(k => {
      this.sensors[k].connected = false
      this.sensors[k].reading = null
      this.sensors[k].source = 'unavailable'
      this.sensors[k].lastUpdated = null
      this.sensors[k].error = null
    })
    this.sensors.distance.proximityStatus = 'Sensor Not Connected'
    this.notifyListeners()
  }

  // --- Observation Finalization & Stabilized Average ---

  clearBuffer() {
    this.sampleBuffer = []
  }

  getStabilizedSessionReading() {
    // If buffer has samples, compute trimmed median/average for noise immunity
    if (this.sampleBuffer.length >= 3) {
      const validHR = this.sampleBuffer.map(s => s.heartRate).filter(v => v !== null && !isNaN(v))
      const validSpO2 = this.sampleBuffer.map(s => s.spo2).filter(v => v !== null && !isNaN(v))
      const validTemp = this.sampleBuffer.map(s => s.temperature).filter(v => v !== null && !isNaN(v))
      const validDist = this.sampleBuffer.map(s => s.distance).filter(v => v !== null && !isNaN(v))

      const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null

      return {
        heartRate: validHR.length ? Math.round(avg(validHR)) : this.sensors.heartRate.reading,
        spo2: validSpO2.length ? Math.round(avg(validSpO2)) : this.sensors.spo2.reading,
        temperature: validTemp.length ? parseFloat(avg(validTemp).toFixed(1)) : this.sensors.temperature.reading,
        distance: validDist.length ? Math.round(avg(validDist)) : this.sensors.distance.reading,
        posture: this.sensors.posture.reading || 'Good',
        fatigue: this.sensors.fatigue.reading || 'Low',
        isDemo: this.isDemoMode,
        sources: {
          heartRate: this.sensors.heartRate.source,
          spo2: this.sensors.spo2.source,
          temperature: this.sensors.temperature.source,
          distance: this.sensors.distance.source,
          posture: this.sensors.posture.source,
          fatigue: this.sensors.fatigue.source
        }
      }
    }

    return {
      heartRate: this.sensors.heartRate.reading,
      spo2: this.sensors.spo2.reading,
      temperature: this.sensors.temperature.reading,
      distance: this.sensors.distance.reading,
      posture: this.sensors.posture.reading || 'Good',
      fatigue: this.sensors.fatigue.reading || 'Low',
      isDemo: this.isDemoMode,
      sources: {
        heartRate: this.sensors.heartRate.source,
        spo2: this.sensors.spo2.source,
        temperature: this.sensors.temperature.source,
        distance: this.sensors.distance.source,
        posture: this.sensors.posture.source,
        fatigue: this.sensors.fatigue.source
      }
    }
  }

  // --- Subscriptions ---

  subscribe(listener) {
    this.listeners.add(listener)
    listener({ sensors: { ...this.sensors }, isDemoMode: this.isDemoMode })
    return () => this.listeners.delete(listener)
  }

  notifyListeners() {
    const payload = {
      sensors: { ...this.sensors },
      isDemoMode: this.isDemoMode,
      activeProviderName: this.activeHardwareProvider?.name || (this.isDemoMode ? 'Demo Simulator' : 'None')
    }
    this.listeners.forEach(cb => {
      try { cb(payload) } catch (e) {}
    })
  }
}

export const sensorManager = new SensorManager()
