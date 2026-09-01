/**
 * DemoSensorProvider.js
 * Controlled simulation provider for academic / college presentations
 * when physical sensors (MAX30102, MLX90614, HC-SR04) are not physically connected.
 * 
 * STRICT COMPLIANCE:
 * All generated telemetry is explicitly tagged with `source: 'demo'`.
 */

export const DEMO_PRESETS = {
  HEALTHY: {
    id: 'HEALTHY',
    name: 'Optimal Baseline',
    description: 'Resting healthy vitals with balanced posture and low fatigue',
    heartRate: 72,
    spo2: 98,
    temperature: 36.6,
    distance: 65,
    posture: 'Good',
    fatigue: 'Low'
  },
  ATHLETIC: {
    id: 'ATHLETIC',
    name: 'Athletic Recovery',
    description: 'Post-exercise elevated pulse, normal oxygen saturation',
    heartRate: 88,
    spo2: 99,
    temperature: 36.9,
    distance: 60,
    posture: 'Good',
    fatigue: 'Low'
  },
  MILD_FATIGUE: {
    id: 'MILD_FATIGUE',
    name: 'Screen Fatigue & Strain',
    description: 'Moderate ocular strain and forward head posture from extended study',
    heartRate: 76,
    spo2: 97,
    temperature: 36.7,
    distance: 48,
    posture: 'Needs Improvement',
    fatigue: 'Moderate'
  },
  FEVER_TACHYCARDIA: {
    id: 'FEVER_TACHYCARDIA',
    name: 'Fever & Elevated Pulse',
    description: 'Subfebrile temperature with compensatory tachycardia warning',
    heartRate: 108,
    spo2: 95,
    temperature: 38.4,
    distance: 62,
    posture: 'Good',
    fatigue: 'Moderate'
  },
  POSTURE_SLUMP: {
    id: 'POSTURE_SLUMP',
    name: 'Severe Postural Slump',
    description: 'Significant cervical spine misalignment and close screen distance',
    heartRate: 74,
    spo2: 98,
    temperature: 36.5,
    distance: 38,
    posture: 'Poor',
    fatigue: 'Moderate'
  },
  MISSING_TEMP: {
    id: 'MISSING_TEMP',
    name: 'Temperature Sensor Disconnected',
    description: 'Physical temperature sensor disconnected; others active',
    heartRate: 75,
    spo2: 98,
    temperature: null,
    distance: 65,
    posture: 'Good',
    fatigue: 'Low'
  }
}

export class DemoSensorProvider {
  constructor() {
    this.name = 'Demo / Simulated Data Provider'
    this.isConnected = false
    this.onDataCallback = null
    this.currentPreset = 'HEALTHY'
    this.timer = null

    // Live adjustable base values
    this.state = {
      heartRate: 72,
      spo2: 98,
      temperature: 36.6,
      distance: 65,
      posture: 'Good',
      fatigue: 'Low',
      enabledSensors: {
        heartRate: true,
        spo2: true,
        temperature: true,
        distance: true
      }
    }
  }

  isSupported() {
    return true
  }

  start() {
    this.isConnected = true
    if (this.timer) clearInterval(this.timer)

    this.timer = setInterval(() => {
      if (!this.isConnected) return
      this.emitSample()
    }, 800)

    this.emitSample()
    return { success: true, message: 'Demo Simulation Mode Activated' }
  }

  stop() {
    this.isConnected = false
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  applyPreset(presetId) {
    const p = DEMO_PRESETS[presetId] || DEMO_PRESETS.HEALTHY
    this.currentPreset = presetId
    this.state.heartRate = p.heartRate
    this.state.spo2 = p.spo2
    this.state.temperature = p.temperature
    this.state.distance = p.distance
    this.state.posture = p.posture
    this.state.fatigue = p.fatigue

    this.state.enabledSensors = {
      heartRate: p.heartRate !== null,
      spo2: p.spo2 !== null,
      temperature: p.temperature !== null,
      distance: p.distance !== null
    }

    this.emitSample()
  }

  setValues({ heartRate, spo2, temperature, distance, posture, fatigue, enabledSensors }) {
    if (heartRate !== undefined) this.state.heartRate = heartRate
    if (spo2 !== undefined) this.state.spo2 = spo2
    if (temperature !== undefined) this.state.temperature = temperature
    if (distance !== undefined) this.state.distance = distance
    if (posture !== undefined) this.state.posture = posture
    if (fatigue !== undefined) this.state.fatigue = fatigue
    if (enabledSensors !== undefined) this.state.enabledSensors = { ...this.state.enabledSensors, ...enabledSensors }
    this.emitSample()
  }

  emitSample() {
    if (!this.onDataCallback) return

    // Add gentle physiological micro-fluctuations
    const hrJitter = (Math.random() - 0.5) * 1.5
    const tempJitter = (Math.random() - 0.5) * 0.05
    const distJitter = (Math.random() - 0.5) * 1.0

    const hr = this.state.enabledSensors.heartRate && this.state.heartRate !== null
      ? Math.round(this.state.heartRate + hrJitter)
      : null

    const spo2 = this.state.enabledSensors.spo2 && this.state.spo2 !== null
      ? Math.min(100, Math.max(90, Math.round(this.state.spo2 + (Math.random() > 0.8 ? (Math.random() - 0.5) : 0))))
      : null

    const temp = this.state.enabledSensors.temperature && this.state.temperature !== null
      ? parseFloat((this.state.temperature + tempJitter).toFixed(1))
      : null

    const dist = this.state.enabledSensors.distance && this.state.distance !== null
      ? Math.round(this.state.distance + distJitter)
      : null

    const payload = {
      heartRate: hr,
      spo2: spo2,
      temperature: temp,
      distance: dist,
      posture: this.state.posture,
      fatigue: this.state.fatigue,
      source: 'demo',
      timestamp: new Date().toISOString()
    }

    this.onDataCallback(payload)
  }

  onData(callback) {
    this.onDataCallback = callback
  }
}
