/**
 * Personal Wellness Assessment Engine
 * Pure rule-based inference engine for Smart Mirror Health Monitoring Reports.
 * 
 * DISCLAIMER:
 * This Smart Mirror is a prototype wellness-monitoring system for educational and demonstration purposes.
 * It is not a medical diagnostic device and does not provide medical diagnosis or treatment.
 * Sensor values may be simulated in Demo Mode.
 */

export const MEDICAL_DISCLAIMER =
  "Disclaimer: This Smart Mirror is a prototype wellness-monitoring system for educational and demonstration purposes. It is not a medical diagnostic device and does not provide medical diagnosis or treatment. Sensor values may be simulated in Demo Mode."

/**
 * Analyzes health inputs and generates a structured Health Test Report payload.
 * 
 * @param {Object} params
 * @param {number|null} params.heartRate - Heart Rate in BPM
 * @param {number|null} params.temperature - Body Temperature in Celsius
 * @param {boolean} params.faceDetected - Whether face is detected by camera
 * @param {'Good'|'Needs Attention'|'Poor'} params.posture - Posture classification
 * @param {'Low'|'Medium'|'High'} params.fatigue - Fatigue classification
 * @returns {Object} Comprehensive Personal Wellness Assessment Report
 */
export function analyzeHealth({
  heartRate = 78,
  temperature = 36.7,
  faceDetected = true,
  posture = 'Good',
  fatigue = 'Low'
}) {
  const hr = Number(heartRate) || 75
  const temp = parseFloat(Number(temperature).toFixed(1)) || 36.7

  let score = 100
  const scoreDeductions = {
    baseScore: 100,
    heartRate: 0,
    temperature: 0,
    posture: 0,
    fatigue: 0
  }

  const warnings = []
  const recommendations = []
  const parameters = []

  // 1. Heart Rate Evaluation (Ref Range: 60 - 100 BPM)
  let hrStatus = 'NORMAL'
  let hrInterp = `Heart rate is within the configured reference range (60–100 BPM). Normal resting cardiac rate observed.`
  if (hr >= 60 && hr <= 100) {
    hrStatus = 'NORMAL'
    hrInterp = `Heart rate (${hr} BPM) is within the prototype reference range (60–100 BPM).`
  } else if (hr > 100 && hr <= 115) {
    hrStatus = 'ATTENTION'
    scoreDeductions.heartRate = 12
    hrInterp = `Heart rate (${hr} BPM) is mildly elevated above the 100 BPM threshold.`
    warnings.push({
      parameter: 'Heart Rate',
      value: `${hr} BPM`,
      message: `Mildly elevated resting pulse rate above reference range (60–100 BPM).`
    })
    recommendations.push({
      category: 'CARDIOVASCULAR',
      suggestion: 'Rest in a seated position and practice slow diaphragmatic breathing to help lower pulse rate.',
      priority: 'High'
    })
  } else if (hr > 115) {
    hrStatus = 'WARNING'
    scoreDeductions.heartRate = 25
    hrInterp = `Heart rate (${hr} BPM) is noticeably elevated above baseline reference levels.`
    warnings.push({
      parameter: 'Heart Rate',
      value: `${hr} BPM`,
      message: `Significantly elevated pulse reading (>115 BPM) detected during session.`
    })
    recommendations.push({
      category: 'CARDIOVASCULAR',
      suggestion: 'Pause physical and visual exertion, sit comfortably, hydrate, and recheck reading.',
      priority: 'High'
    })
  } else if (hr < 60 && hr >= 50) {
    hrStatus = 'ATTENTION'
    scoreDeductions.heartRate = 10
    hrInterp = `Heart rate (${hr} BPM) is below typical resting threshold (<60 BPM).`
    recommendations.push({
      category: 'CARDIOVASCULAR',
      suggestion: 'If not an athletic individual, monitor alertness and ensure proper room warmth.',
      priority: 'Medium'
    })
  } else if (hr < 50) {
    hrStatus = 'WARNING'
    scoreDeductions.heartRate = 20
    hrInterp = `Heart rate (${hr} BPM) is notably low (<50 BPM).`
    warnings.push({
      parameter: 'Heart Rate',
      value: `${hr} BPM`,
      message: `Very low pulse reading (<50 BPM) detected.`
    })
    recommendations.push({
      category: 'CARDIOVASCULAR',
      suggestion: 'Check sensor positioning and monitor for lightheadedness or fatigue.',
      priority: 'High'
    })
  }

  parameters.push({
    name: 'Heart Rate',
    reading: `${hr} BPM`,
    raw: hr,
    referenceRange: '60–100 BPM',
    status: hrStatus,
    interpretation: hrInterp
  })

  // 2. Temperature Evaluation (Ref Range: Below 37.5 °C)
  let tempStatus = 'NORMAL'
  let tempInterp = `Body temperature (${temp}°C) is within typical reference boundaries (below 37.5°C).`
  if (temp >= 36.0 && temp < 37.5) {
    tempStatus = 'NORMAL'
    tempInterp = `Body temperature (${temp}°C) is within expected prototype range (36.0–37.4°C).`
  } else if (temp >= 37.5 && temp < 38.0) {
    tempStatus = 'ATTENTION'
    scoreDeductions.temperature = 12
    tempInterp = `Body temperature (${temp}°C) indicates mild elevation (37.5–37.9°C).`
    warnings.push({
      parameter: 'Temperature',
      value: `${temp} °C`,
      message: `Mild low-grade temperature elevation above standard resting baseline.`
    })
    recommendations.push({
      category: 'THERMOREGULATION',
      suggestion: 'Drink cool fluids, remain in a well-ventilated room, and avoid warm heavy clothing.',
      priority: 'Medium'
    })
  } else if (temp >= 38.0) {
    tempStatus = 'WARNING'
    scoreDeductions.temperature = 28
    tempInterp = `Body temperature (${temp}°C) indicates an elevated temperature warning (≥38.0°C).`
    warnings.push({
      parameter: 'Temperature',
      value: `${temp} °C`,
      message: `Elevated thermal threshold (≥38.0°C) indicating fever-level physiological response.`
    })
    recommendations.push({
      category: 'THERMOREGULATION',
      suggestion: 'Your temperature reading is elevated (≥38.0°C). Rest, maintain hydration, and consider professional consultation if it persists.',
      priority: 'High'
    })
  } else if (temp < 36.0) {
    tempStatus = 'ATTENTION'
    scoreDeductions.temperature = 12
    tempInterp = `Body temperature (${temp}°C) is below typical baseline.`
    recommendations.push({
      category: 'THERMOREGULATION',
      suggestion: 'Ensure ambient comfort and verify thermal sensor alignment.',
      priority: 'Medium'
    })
  }

  parameters.push({
    name: 'Temperature',
    reading: `${temp.toFixed(1)} °C`,
    raw: temp,
    referenceRange: 'Below 37.5 °C',
    status: tempStatus,
    interpretation: tempInterp
  })

  // 3. Posture Evaluation
  let postureStatus = 'GOOD'
  let postureInterp = 'Posture alignment is upright with balanced spinal and shoulder symmetry.'
  if (posture === 'Good') {
    postureStatus = 'GOOD'
    postureInterp = 'Upright spinal alignment observed; neck and shoulders are balanced.'
  } else if (posture === 'Needs Attention') {
    postureStatus = 'ATTENTION'
    scoreDeductions.posture = 12
    postureInterp = 'Moderate shoulder slouch or forward neck tilt observed during monitoring.'
    warnings.push({
      parameter: 'Posture',
      value: 'Needs Attention',
      message: 'Suboptimal posture alignment observed (forward head tilt / slight shoulder hunch).'
    })
    recommendations.push({
      category: 'POSTURE & ERGONOMICS',
      suggestion: 'Gently roll shoulders back and position screen directly at eye level.',
      priority: 'Medium'
    })
  } else if (posture === 'Poor') {
    postureStatus = 'WARNING'
    scoreDeductions.posture = 25
    postureInterp = 'Pronounced forward spinal hunch or asymmetrical slouching detected.'
    warnings.push({
      parameter: 'Posture',
      value: 'Poor',
      message: 'Significant ergonomic misalignment and spinal curvature observed.'
    })
    recommendations.push({
      category: 'POSTURE & ERGONOMICS',
      suggestion: 'Straighten your back, stand up to decompress your spine, and adjust lumbar support.',
      priority: 'High'
    })
  }

  parameters.push({
    name: 'Posture',
    reading: posture,
    raw: posture,
    referenceRange: 'Good preferred',
    status: postureStatus,
    interpretation: postureInterp
  })

  // 4. Fatigue Evaluation
  let fatigueStatus = 'GOOD'
  let fatigueInterp = 'Facial alertness indicators reflect good wakefulness and low ocular strain.'
  if (fatigue === 'Low') {
    fatigueStatus = 'GOOD'
    fatigueInterp = 'Facial landmarks indicate alert eye aperture and normal blink dynamics.'
  } else if (fatigue === 'Medium') {
    fatigueStatus = 'ATTENTION'
    scoreDeductions.fatigue = 12
    fatigueInterp = 'Moderate ocular fatigue or prolonged screen gaze indicators detected.'
    warnings.push({
      parameter: 'Fatigue',
      value: 'Medium',
      message: 'Moderate signs of eye fatigue or diminished facial alertness.'
    })
    recommendations.push({
      category: 'REST & RECOVERY',
      suggestion: 'Practice the 20-20-20 rule: gaze at an object 20 feet away for 20 seconds to ease eye strain.',
      priority: 'Medium'
    })
  } else if (fatigue === 'High') {
    fatigueStatus = 'WARNING'
    scoreDeductions.fatigue = 25
    fatigueInterp = 'Noticeable eyelid droop or elevated fatigue markers observed.'
    warnings.push({
      parameter: 'Fatigue',
      value: 'High',
      message: 'High fatigue or drowsiness markers identified by the optical monitor.'
    })
    recommendations.push({
      category: 'REST & RECOVERY',
      suggestion: 'Take an immediate screen rest or short power nap to restore cognitive and visual alertness.',
      priority: 'High'
    })
  }

  parameters.push({
    name: 'Fatigue',
    reading: fatigue,
    raw: fatigue,
    referenceRange: 'Low preferred',
    status: fatigueStatus,
    interpretation: fatigueInterp
  })

  // 5. Face Detection Evaluation
  let faceStatus = faceDetected ? 'DETECTED' : 'WARNING'
  let faceInterp = faceDetected
    ? 'Face successfully centered and acquired for optical analysis.'
    : 'Face not centered in optical frame. Optical parameters may have reduced accuracy.'

  if (!faceDetected) {
    warnings.push({
      parameter: 'Face Detection',
      value: 'Not Detected',
      message: 'User face is not fully centered within mirror sensor viewfinder.'
    })
  }

  parameters.push({
    name: 'Face Detection',
    reading: faceDetected ? 'Detected' : 'Not Detected',
    raw: faceDetected,
    referenceRange: 'Required for vision analysis',
    status: faceStatus,
    interpretation: faceInterp
  })

  // Calculate Final Authoritative Score
  const totalDeductions =
    scoreDeductions.heartRate +
    scoreDeductions.temperature +
    scoreDeductions.posture +
    scoreDeductions.fatigue

  score = Math.max(10, Math.min(100, 100 - totalDeductions))

  // Determine Overall Status & Risk Level
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

  // Priority Action Determination
  let priorityAction = 'Continue your current healthy routine, stay hydrated, maintain upright posture, and take periodic breaks.'
  if (warnings.length >= 3 || score < 60) {
    priorityAction = 'Rest and recheck your readings. Because multiple prototype wellness indicators are outside configured reference ranges, avoid strenuous tasks and seek professional medical advice if symptoms persist.'
  } else if (temp >= 38.0) {
    priorityAction = 'Elevated temperature detected. Rest in a cool space, hydrate continuously, and monitor your reading closely.'
  } else if (hr > 100) {
    priorityAction = 'Rest comfortably in a quiet area, avoid caffeine or stress, and practice slow deep breaths to help normalize pulse rate.'
  } else if (fatigue === 'High' || posture === 'Poor') {
    priorityAction = 'Step away from your workstation, stretch your spine and neck, and rest your eyes for at least 10–15 minutes.'
  }

  // Add General Wellness recommendation if healthy or empty
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'GENERAL WELLNESS',
      suggestion: 'All indicators are balanced. Continue consistent daily hydration, ergonomic seating, and regular movement breaks.',
      priority: 'General'
    })
  }

  // Generate Accurate Overall Interpretation Text
  let overallInterpretation = ''
  if (warnings.length === 0 && score >= 80) {
    overallInterpretation = `Your current wellness indicators are within the prototype's expected reference ranges. Heart rate (${hr} BPM) and temperature (${temp.toFixed(1)}°C) are normal, while posture and fatigue indicators are also favorable. No significant warning indicators were identified by this prototype analysis.`
  } else if (score >= 60) {
    const warningNames = warnings.map(w => w.parameter).join(' and ')
    overallInterpretation = `Your current wellness assessment shows moderate variations from baseline. Specific attention is noted for ${warningNames || 'certain indicators'}, while other readings remain within acceptable prototype ranges. Implementing the recommendations below will assist in restoring optimal comfort and balance.`
  } else {
    const warningNames = warnings.map(w => `${w.parameter} (${w.value})`).join(', ')
    overallInterpretation = `Multiple prototype wellness indicators (${warningNames}) are currently outside configured reference parameters. A cumulative wellness score of ${score}/100 indicates elevated physiological and ergonomic strain requiring rest, hydration, and prompt attention.`
  }

  return {
    wellnessScore: score,
    healthStatus,
    riskLevel,
    overallInterpretation,
    priorityAction,
    parameters,
    scoreDeductions: {
      ...scoreDeductions,
      finalScore: score,
      totalDeductions
    },
    warnings,
    recommendations,
    disclaimer: MEDICAL_DISCLAIMER,
    timestamp: new Date().toISOString()
  }
}

export const analyzeHealthTelemetry = analyzeHealth
