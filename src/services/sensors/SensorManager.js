import { WebSerialProvider } from './WebSerialProvider.js'
import { WebBluetoothProvider } from './WebBluetoothProvider.js'
import { WebSocketBridgeProvider } from './WebSocketBridgeProvider.js'
import { DemoSensorProvider, DEMO_PRESETS } from './DemoSensorProvider.js'

/**
 * SensorManager
 * Central hardware abstraction managing physical biomedical sensors and demo simulation.
 * 
 * STRICT COMPLIANCE:
 * - When physical sensor is disconnected:
 *   reading = null, connected = false, source = 'unavailable'.
 * - Disconnected sensors are NEVER penalized in wellness scoring.
 * - Stale packet watchdog: If no data packet is received within 3.5s,
 *   sensors are immediately updated to disconnected state.
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

    // Hardware status metrics
    this.hardwareMetrics = {
      isBridgeConnected: false,
      hardwarePort: null,
      packetCount: 0,
      packetRateHz: 0,
      lastPacketTime: null,
      rawLogStream: []
    }

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
        sensorHardware: 'MAX30102 PPG',
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
        sensorHardware: 'MAX30102 PPG',
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
        sensorHardware: 'Contactless IR / Thermistor',
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
        sensorHardware: 'HC-SR04 / VL53L0X',
        proximityStatus: 'Sensor Not Connected',
        lastUpdated: null,
        error: null,
        source: 'unavailable'
      },
      // Vision indicators
      posture: {
        id: 'posture',
        name: 'Spinal Posture',
        reading: 'Good',
        source: 'vision',
        lastUpdated: null
      },
      fatigue: {
        id: 'fatigue',
        name: 'Alertness & Fatigue',
        reading: 'Low',
        source: 'vision',
        lastUpdated: null
      }
    }

    // Rolling sample buffer for observation averaging
    this.sampleBuffer = []

    // Stale watchdog timer
    this.watchdogTimer = null
    this.packetTimes = []

    // Attach provider callbacks
    this.serialProvider.onData((data) => this.handleIncomingTelemetry(data, 'Web Serial USB'))
    this.bluetoothProvider.onData((data) => this.handleIncomingTelemetry(data, 'Bluetooth BLE'))
    this.bridgeProvider.onData((data) => this.handleIncomingTelemetry(data, 'Python Sensor Bridge'))
    this.demoProvider.onData((data) => this.handleIncomingTelemetry(data, 'Demo Simulator'))

    this.bridgeProvider.onStatusChange((isConnected, msg) => {
      this.hardwareMetrics.isBridgeConnected = isConnected
      this.notifyListeners()
    })

    // Start background auto-discovery for local sensor bridge
    this.startBackgroundDiscovery()
    this.startWatchdog()
  }

  startBackgroundDiscovery() {
    if (typeof window !== 'undefined') {
      // Auto-connect to local sensor bridge
      this.bridgeProvider.connect({ url: 'ws://localhost:8765' }).catch(() => {})
    }
  }

  startWatchdog() {
    if (this.watchdogTimer) clearInterval(this.watchdogTimer)
    this.watchdogTimer = setInterval(() => {
      const now = Date.now()
      // If hardware was active but no packet received in > 3.5s, mark disconnected
      if (
        !this.isDemoMode &&
        this.hardwareMetrics.lastPacketTime &&
        now - this.hardwareMetrics.lastPacketTime > 3500 &&
        (this.sensors.heartRate.connected || this.sensors.temperature.connected)
      ) {
        this.resetSensorsToUnavailable()
        this.hardwareMetrics.packetRateHz = 0
      }
    }, 1000)
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

  handleIncomingTelemetry(data, providerName = 'Hardware') {
    const now = data.timestamp || new Date().toISOString()
    const src = data.source || 'hardware'
    const nowMs = Date.now()

    if (src === 'hardware') {
      this.hardwareMetrics.lastPacketTime = nowMs
      this.hardwareMetrics.packetCount += 1
      this.hardwareMetrics.hardwarePort = data.port || 'USB-SERIAL'

      // Calculate packet frequency (Hz)
      this.packetTimes.push(nowMs)
      if (this.packetTimes.length > 20) this.packetTimes.shift()
      if (this.packetTimes.length >= 2) {
        const spanSec = (this.packetTimes[this.packetTimes.length - 1] - this.packetTimes[0]) / 1000
        if (spanSec > 0) {
          this.hardwareMetrics.packetRateHz = parseFloat(((this.packetTimes.length - 1) / spanSec).toFixed(1))
        }
      }

      // Append to live raw log stream
      if (data.raw) {
        this.hardwareMetrics.rawLogStream.unshift({
          time: new Date().toLocaleTimeString(),
          raw: typeof data.raw === 'string' ? data.raw.trim() : JSON.stringify(data.raw)
        })
        if (this.hardwareMetrics.rawLogStream.length > 30) {
          this.hardwareMetrics.rawLogStream.pop()
        }
      }
    }

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

    // Demo Vision updates
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

    // Sample buffer for observation
    this.sampleBuffer.push({
      heartRate: this.sensors.heartRate.reading,
      spo2: this.sensors.spo2.reading,
      temperature: this.sensors.temperature.reading,
      distance: this.sensors.distance.reading,
      posture: this.sensors.posture.reading,
      fatigue: this.sensors.fatigue.reading,
      timestamp: Date.now()
    })

    if (this.sampleBuffer.length > 120) {
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

  // --- Observation Finalization ---

  clearBuffer() {
    this.sampleBuffer = []
  }

  getStabilizedSessionReading() {
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
    listener({
      sensors: { ...this.sensors },
      isDemoMode: this.isDemoMode,
      hardwareMetrics: { ...this.hardwareMetrics }
    })
    return () => this.listeners.delete(listener)
  }

  notifyListeners() {
    const payload = {
      sensors: { ...this.sensors },
      isDemoMode: this.isDemoMode,
      hardwareMetrics: { ...this.hardwareMetrics },
      activeProviderName: this.hardwareMetrics.isBridgeConnected
        ? 'Python Hardware Bridge (Live)'
        : (this.activeHardwareProvider?.name || (this.isDemoMode ? 'Demo Simulator' : 'None'))
    }
    this.listeners.forEach(cb => {
      try { cb(payload) } catch (e) {}
    })
  }
}

export const sensorManager = new SensorManager()
