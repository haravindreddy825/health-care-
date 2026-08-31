/**
 * AI-Powered Smart Mirror — Rule-Based Health Assessment Engine
 * 
 * Clinical Decision Rules for Personal Wellness Monitoring:
 * - Heart Rate (MAX30102): Reference 60–100 BPM
 * - Body Temperature (IR Sensor): Reference 36.0–37.4 °C (96.8–99.3 °F)
 * - Posture Alignment (MediaPipe): Good / Needs Attention / Poor
 * - Fatigue Level (OpenCV EAR): Low / Medium / High
 */

export const MEDICAL_DISCLAIMER =
  "Disclaimer: This AI Smart Mirror is an educational prototype and personal wellness-monitoring system. Its measurements, optical estimates, and AI recommendations are not medical diagnoses and do not replace professional healthcare advice."

/**
 * Evaluates physiological and optical inputs to generate an authoritative Wellness Report.
 */
export function analyzeHealthTelemetry({
  heartRate = 75,
  temperature = 36.7,
  posture = 'Good',
  fatigue = 'Low',
  faceDetected = true
}) {
  const hr = Math.round(Number(heartRate)) || 75
  const temp = parseFloat(Number(temperature).toFixed(1)) || 36.7

  let score = 100
  const deductions = {
    base: 100,
    heartRate: 0,
    temperature: 0,
    posture: 0,
    fatigue: 0
  }

  const warnings = []
  const recommendations = []
  const parameters = []

  // 1. Heart Rate Assessment (MAX30102 Sensor: 60 - 100 BPM)
  let hrStatus = 'NORMAL'
  let hrInterp = `Resting heart rate (${hr} BPM) is within standard healthy bounds (60–100 BPM).`

  if (hr >= 60 && hr <= 100) {
    hrStatus = 'NORMAL'
  } else if (hr > 100 && hr <= 115) {
    hrStatus = 'ATTENTION'
    deductions.heartRate = 12
    hrInterp = `Heart rate (${hr} BPM) is mildly elevated above resting threshold (60–100 BPM).`
    warnings.push({
      parameter: 'Heart Rate',
      value: `${hr} BPM`,
      severity: 'Moderate',
      message: 'Mild resting tachycardia detected. Elevated pulse above 100 BPM.'
    })
    recommendations.push({
      category: 'CARDIOVASCULAR',
      title: 'Cardiac Relaxation',
      suggestion: 'Sit in a relaxed posture, avoid caffeine, and engage in 3 minutes of slow diaphragmatic breathing.',
      priority: 'High'
    })
  } else if (hr > 115) {
    hrStatus = 'WARNING'
    deductions.heartRate = 25
    hrInterp = `Heart rate (${hr} BPM) is significantly elevated above resting levels (>115 BPM).`
    warnings.push({
      parameter: 'Heart Rate',
      value: `${hr} BPM`,
      severity: 'High',
      message: 'Substantial resting pulse elevation detected (>115 BPM).'
    })
    recommendations.push({
      category: 'CARDIOVASCULAR',
      title: 'Rest & Hydration',
      suggestion: 'Pause physical and screen activity immediately, drink water, sit comfortably, and re-evaluate pulse.',
      priority: 'High'
    })
  } else if (hr < 60 && hr >= 50) {
    hrStatus = 'ATTENTION'
    deductions.heartRate = 10
    hrInterp = `Heart rate (${hr} BPM) is slightly below standard resting threshold (<60 BPM).`
    recommendations.push({
      category: 'CARDIOVASCULAR',
      title: 'Pulse Monitoring',
      suggestion: 'Normal in conditioned athletes; otherwise monitor for lightheadedness or lethargy.',
      priority: 'Medium'
    })
  } else if (hr < 50) {
    hrStatus = 'WARNING'
    deductions.heartRate = 22
    hrInterp = `Heart rate (${hr} BPM) is notably low (<50 BPM).`
    warnings.push({
      parameter: 'Heart Rate',
      value: `${hr} BPM`,
      severity: 'High',
      message: 'Low resting pulse rate (<50 BPM) recorded.'
    })
    recommendations.push({
      category: 'CARDIOVASCULAR',
      title: 'Circulation Check',
      suggestion: 'Ensure proper room warmth, verify sensor placement, and check for dizziness.',
      priority: 'High'
    })
  }

  parameters.push({
    id: 'heart_rate',
    name: 'Heart Rate',
    sensor: 'MAX30102 PPG Sensor',
    reading: `${hr} BPM`,
    raw: hr,
    unit: 'BPM',
    referenceRange: '60–100 BPM',
    status: hrStatus,
    interpretation: hrInterp
  })

  // 2. Temperature Assessment (Infrared Thermopile Sensor: 36.0 - 37.4 °C)
  let tempStatus = 'NORMAL'
  let tempInterp = `Core body temperature (${temp}°C / ${(temp * 1.8 + 32).toFixed(1)}°F) is in normal range.`

  if (temp >= 36.0 && temp < 37.5) {
    tempStatus = 'NORMAL'
  } else if (temp >= 37.5 && temp < 38.0) {
    tempStatus = 'ATTENTION'
    deductions.temperature = 12
    tempInterp = `Body temperature (${temp}°C) indicates mild low-grade thermal elevation.`
    warnings.push({
      parameter: 'Temperature',
      value: `${temp} °C`,
      severity: 'Moderate',
      message: 'Low-grade temperature elevation (37.5–37.9°C) recorded.'
    })
    recommendations.push({
      category: 'THERMOREGULATION',
      title: 'Cooling & Hydration',
      suggestion: 'Drink cool water, rest in a well-ventilated space, and avoid heavy clothing.',
      priority: 'Medium'
    })
  } else if (temp >= 38.0) {
    tempStatus = 'WARNING'
    deductions.temperature = 28
    tempInterp = `Body temperature (${temp}°C / ${(temp * 1.8 + 32).toFixed(1)}°F) reflects fever-level thermal reading.`
    warnings.push({
      parameter: 'Temperature',
      value: `${temp} °C`,
      severity: 'High',
      message: 'Elevated thermal threshold (≥38.0°C) indicating febrile response.'
    })
    recommendations.push({
      category: 'THERMOREGULATION',
      title: 'Fever Protocol',
      suggestion: 'Rest completely, hydrate continuously, monitor temperature closely, and consult a doctor if fever persists.',
      priority: 'High'
    })
  } else if (temp < 36.0) {
    tempStatus = 'ATTENTION'
    deductions.temperature = 10
    tempInterp = `Body temperature (${temp}°C) is below standard baseline (<36.0°C).`
    recommendations.push({
      category: 'THERMOREGULATION',
      title: 'Thermal Balance',
      suggestion: 'Ensure comfortable room temperature and avoid drafty conditions.',
      priority: 'Medium'
    })
  }

  parameters.push({
    id: 'temperature',
    name: 'Body Temperature',
    sensor: 'IR Thermopile Sensor',
    reading: `${temp}°C`,
    secondaryReading: `${(temp * 1.8 + 32).toFixed(1)}°F`,
    raw: temp,
    unit: '°C',
    referenceRange: '36.0–37.4 °C',
    status: tempStatus,
    interpretation: tempInterp
  })

  // 3. Posture Alignment Assessment (MediaPipe 3D Landmark Vectors)
  let postureStatus = 'GOOD'
  let postureInterp = 'Optimal upright spinal posture; balanced shoulder and cervical alignment.'

  if (posture === 'Good') {
    postureStatus = 'GOOD'
  } else if (posture === 'Needs Attention') {
    postureStatus = 'ATTENTION'
    deductions.posture = 12
    postureInterp = 'Moderate forward head tilt or shoulder slouch observed by optical tracking.'
    warnings.push({
      parameter: 'Posture',
      value: 'Needs Attention',
      severity: 'Moderate',
      message: 'Suboptimal ergonomic posture (forward neck tilt / mild slouching).'
    })
    recommendations.push({
      category: 'POSTURE & ERGONOMICS',
      title: 'Spinal Alignment',
      suggestion: 'Roll shoulders back, align chin parallel to the floor, and adjust monitor to eye level.',
      priority: 'Medium'
    })
  } else if (posture === 'Poor') {
    postureStatus = 'WARNING'
    deductions.posture = 25
    postureInterp = 'Pronounced spinal hunch and significant forward head posture detected.'
    warnings.push({
      parameter: 'Posture',
      value: 'Poor',
      severity: 'High',
      message: 'Substantial ergonomic misalignment and spinal strain identified.'
    })
    recommendations.push({
      category: 'POSTURE & ERGONOMICS',
      title: 'Ergonomic Reset',
      suggestion: 'Stand up, perform chest and neck stretches, adjust lumbar support, and reset sitting posture.',
      priority: 'High'
    })
  }

  parameters.push({
    id: 'posture',
    name: 'Posture Alignment',
    sensor: 'MediaPipe 3D Vision',
    reading: posture,
    raw: posture,
    referenceRange: 'Good / Upright',
    status: postureStatus,
    interpretation: postureInterp
  })

  // 4. Fatigue & Alertness Assessment (OpenCV / MediaPipe EAR)
  let fatigueStatus = 'GOOD'
  let fatigueInterp = 'Facial alertness landmarks indicate normal blink dynamics and low ocular strain.'

  if (fatigue === 'Low') {
    fatigueStatus = 'GOOD'
  } else if (fatigue === 'Medium') {
    fatigueStatus = 'ATTENTION'
    deductions.fatigue = 12
    fatigueInterp = 'Moderate eye strain or prolonged screen gaze indicators observed.'
    warnings.push({
      parameter: 'Fatigue',
      value: 'Medium',
      severity: 'Moderate',
      message: 'Moderate ocular strain and diminished facial alertness markers.'
    })
    recommendations.push({
      category: 'REST & RECOVERY',
      title: 'Eye Rest Protocol',
      suggestion: 'Follow the 20-20-20 rule: look at an object 20 feet away for 20 seconds to ease eye muscles.',
      priority: 'Medium'
    })
  } else if (fatigue === 'High') {
    fatigueStatus = 'WARNING'
    deductions.fatigue = 25
    fatigueInterp = 'High fatigue index; slow blink rate and eyelid droop detected by optical camera.'
    warnings.push({
      parameter: 'Fatigue',
      value: 'High',
      severity: 'High',
      message: 'High drowsiness or ocular fatigue markers observed.'
    })
    recommendations.push({
      category: 'REST & RECOVERY',
      title: 'Cognitive Rest',
      suggestion: 'Take an immediate 10–15 minute screen break or a power rest to restore visual alertness.',
      priority: 'High'
    })
  }

  parameters.push({
    id: 'fatigue',
    name: 'Fatigue & Alertness',
    sensor: 'OpenCV Facial Mesh',
    reading: fatigue,
    raw: fatigue,
    referenceRange: 'Low Fatigue',
    status: fatigueStatus,
    interpretation: fatigueInterp
  })

  // Calculate Cumulative Wellness Score
  const totalDeductions =
    deductions.heartRate +
    deductions.temperature +
    deductions.posture +
    deductions.fatigue

  score = Math.max(15, Math.min(100, 100 - totalDeductions))

  // Determine Overall Health Status & Risk Level
  let healthStatus = 'Healthy'
  let riskLevel = 'Low'

  if (score >= 80) {
    healthStatus = 'Healthy'
    riskLevel = 'Low'
  } else if (score >= 60) {
    healthStatus = 'Needs Attention'
    riskLevel = 'Moderate'
  } else {
    healthStatus = 'High Risk'
    riskLevel = 'High'
  }

  // Priority Action Formulation
  let priorityAction = 'Maintain your current balanced routine, stay hydrated, keep an upright posture, and take regular breaks.'

  if (warnings.length >= 3 || score < 60) {
    priorityAction = 'Multiple health indicators are outside configured reference ranges. Rest comfortably, hydrate, avoid physical strain, and recheck your telemetry.'
  } else if (temp >= 38.0) {
    priorityAction = 'Elevated body temperature detected (≥38.0°C). Rest in a cool space, hydrate continuously, and consult medical advice if symptoms persist.'
  } else if (hr > 100) {
    priorityAction = 'Rest in a quiet area, avoid caffeine or stress, and practice slow deep diaphragmatic breathing to help lower pulse rate.'
  } else if (fatigue === 'High' || posture === 'Poor') {
    priorityAction = 'Step away from all screens for at least 15 minutes, stretch your cervical spine and shoulders, and drink fresh water.'
  }

  if (recommendations.length === 0) {
    recommendations.push({
      category: 'GENERAL WELLNESS',
      title: 'Daily Vitality Maintenance',
      suggestion: 'All physiological indicators are within optimal bounds. Continue your healthy habits and regular posture checks.',
      priority: 'General'
    })
  }

  // Generate Narrative Interpretation
  let overallInterpretation = ''
  if (warnings.length === 0 && score >= 80) {
    overallInterpretation = `Your physiological indicators are well-balanced. Heart rate (${hr} BPM) and temperature (${temp}°C) are within standard resting limits, and your posture and facial alertness indicate good ergonomic health.`
  } else if (score >= 60) {
    const warningList = warnings.map(w => w.parameter).join(' and ')
    overallInterpretation = `Your wellness monitoring session detected moderate variations from resting baseline in ${warningList || 'certain parameters'}. Implementing the ergonomic and rest recommendations below will help restore optimal balance.`
  } else {
    const warningList = warnings.map(w => `${w.parameter} (${w.value})`).join(', ')
    overallInterpretation = `Multiple prototype wellness indicators (${warningList}) require immediate attention. A wellness score of ${score}/100 indicates elevated physiological or ergonomic strain.`
  }

  return {
    wellnessScore: score,
    healthStatus,
    riskLevel,
    overallInterpretation,
    priorityAction,
    parameters,
    deductions: {
      ...deductions,
      finalScore: score,
      totalDeductions
    },
    warnings,
    recommendations,
    disclaimer: MEDICAL_DISCLAIMER,
    timestamp: new Date().toISOString()
  }
}

export const analyzeHealth = analyzeHealthTelemetry
