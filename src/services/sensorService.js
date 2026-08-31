/**
 * Sensor Abstraction Service for AuraMirror
 * Hardware-ready interface for MAX30102 (Pulse Oximetry & Heart Rate) and Thermal Temperature sensors.
 * In Demo/Simulation Mode, provides stabilized physiological telemetry with natural circadian variances.
 */

export class SensorService {
  constructor() {
    this.isDemoMode = true
    this.demoHeartRateBase = 76
    this.demoTemperatureBase = 36.7
    this.samples = {
      heartRate: [],
      temperature: [],
      posture: [],
      fatigue: []
    }
  }

  setDemoBaseValues(hr, temp) {
    this.demoHeartRateBase = Number(hr) || 76
    this.demoTemperatureBase = Number(temp) || 36.7
  }

  setMode(isDemo) {
    this.isDemoMode = Boolean(isDemo)
  }

  clearSamples() {
    this.samples = {
      heartRate: [],
      temperature: [],
      posture: [],
      fatigue: []
    }
  }

  /**
   * Reads current sensor value with realistic physiological fluctuations
   */
  readInstantaneousData(activePosture = 'Good', activeFatigue = 'Low') {
    if (this.isDemoMode) {
      // Natural human respiratory sinus arrhythmia (±2–4 BPM variation)
      const hrJitter = (Math.random() * 6 - 3)
      const tempJitter = (Math.random() * 0.3 - 0.15)

      const hr = Math.round(this.demoHeartRateBase + hrJitter)
      const temp = parseFloat((this.demoTemperatureBase + tempJitter).toFixed(1))

      return {
        heartRate: Math.max(45, Math.min(150, hr)),
        temperature: Math.max(35.0, Math.min(41.0, temp)),
        posture: activePosture,
        fatigue: activeFatigue,
        isDemo: true
      }
    }

    return {
      heartRate: null,
      temperature: null,
      posture: activePosture,
      fatigue: activeFatigue,
      isDemo: false
    }
  }

  addSample(sample) {
    if (sample.heartRate && !isNaN(sample.heartRate)) {
      this.samples.heartRate.push(sample.heartRate)
    }
    if (sample.temperature && !isNaN(sample.temperature)) {
      this.samples.temperature.push(sample.temperature)
    }
    if (sample.posture) {
      this.samples.posture.push(sample.posture)
    }
    if (sample.fatigue) {
      this.samples.fatigue.push(sample.fatigue)
    }
  }

  /**
   * Computes representative stabilized values across observation period
   */
  computeStabilizedSessionReading(fallbackTelemetry = {}) {
    // 1. Stabilize Heart Rate
    let finalHr = fallbackTelemetry.heartRate || this.demoHeartRateBase
    if (this.samples.heartRate.length > 0) {
      const sorted = [...this.samples.heartRate].sort((a, b) => a - b)
      const start = Math.floor(sorted.length * 0.1)
      const end = Math.ceil(sorted.length * 0.9)
      const trimmed = sorted.slice(start, end)
      const sum = trimmed.reduce((acc, v) => acc + v, 0)
      finalHr = Math.round(sum / (trimmed.length || 1))
    }

    // 2. Stabilize Temperature
    let finalTemp = fallbackTelemetry.temperature || this.demoTemperatureBase
    if (this.samples.temperature.length > 0) {
      const sorted = [...this.samples.temperature].sort((a, b) => a - b)
      const start = Math.floor(sorted.length * 0.1)
      const end = Math.ceil(sorted.length * 0.9)
      const trimmed = sorted.slice(start, end)
      const sum = trimmed.reduce((acc, v) => acc + v, 0)
      finalTemp = parseFloat((sum / (trimmed.length || 1)).toFixed(1))
    }

    // 3. Dominant Posture State
    let finalPosture = fallbackTelemetry.posture || 'Good'
    if (this.samples.posture.length > 0) {
      const counts = {}
      this.samples.posture.forEach(p => { counts[p] = (counts[p] || 0) + 1 })
      finalPosture = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
    }

    // 4. Dominant Fatigue State
    let finalFatigue = fallbackTelemetry.fatigue || 'Low'
    if (this.samples.fatigue.length > 0) {
      const counts = {}
      this.samples.fatigue.forEach(f => { counts[f] = (counts[f] || 0) + 1 })
      finalFatigue = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
    }

    return {
      heartRate: finalHr,
      temperature: finalTemp,
      posture: finalPosture,
      fatigue: finalFatigue,
      faceDetected: true,
      sampleCount: this.samples.heartRate.length,
      isDemo: this.isDemoMode
    }
  }
}

export const sensorService = new SensorService()
