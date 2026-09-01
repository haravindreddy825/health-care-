/**
 * HealthAnalysisEngine.js
 * Authoritative, deterministic local wellness analysis engine.
 * 
 * STRICT COMPLIANCE:
 * 1. Missing/disconnected physical sensors (reading === null) are strictly EXCLUDED
 *    from deductions without penalizing the wellness score.
 * 2. Transparent mathematical deduction from base 100 points.
 * 3. Categorized recommendations and single high-impact priority action.
 * 4. Educational prototype disclaimer (no medical diagnostic claims).
 */

export function analyzeHealthTelemetry({
  heartRate = null,
  spo2 = null,
  temperature = null,
  distance = null,
  posture = 'Good',
  fatigue = 'Low',
  faceDetected = true,
  isDemo = false
}) {
  let score = 100
  const deductions = []
  const positiveFactors = []
  const attentionFactors = []
  const recommendations = []
  const alerts = []
  const activeSensors = []

  // 1. Heart Rate Evaluation (MAX30102)
  if (heartRate != null && !isNaN(heartRate)) {
    activeSensors.push('Heart Rate')
    if (heartRate >= 60 && heartRate <= 100) {
      positiveFactors.push(`Normal resting heart rate (${heartRate} BPM)`)
    } else if ((heartRate >= 50 && heartRate < 60) || (heartRate > 100 && heartRate <= 110)) {
      score -= 10
      deductions.push({ metric: 'Heart Rate', deduction: 10, reason: `Mild ${heartRate > 100 ? 'tachycardia' : 'bradycardia'} (${heartRate} BPM)` })
      attentionFactors.push(`Borderline heart rate reading (${heartRate} BPM)`)
      recommendations.push({
        category: 'CARDIOVASCULAR',
        title: 'Rest & Steady Breathing',
        suggestion: 'Take 3 minutes of slow diaphragmatic breathing and remain seated to re-check resting pulse.',
        priority: 'Medium'
      })
    } else if ((heartRate >= 45 && heartRate < 50) || (heartRate > 110 && heartRate <= 125)) {
      score -= 20
      deductions.push({ metric: 'Heart Rate', deduction: 20, reason: `Elevated heart rate (${heartRate} BPM)` })
      attentionFactors.push(`Elevated pulse rate (${heartRate} BPM)`)
      alerts.push({
        severity: 'MODERATE',
        metric: 'Heart Rate',
        reading: `${heartRate} BPM`,
        reason: 'Elevated cardiac rate detected',
        action: 'Avoid physical exertion, rest calmly, and hydrate.'
      })
    } else {
      score -= 35
      deductions.push({ metric: 'Heart Rate', deduction: 35, reason: `Markedly abnormal pulse (${heartRate} BPM)` })
      attentionFactors.push(`Significantly abnormal pulse rate (${heartRate} BPM)`)
      alerts.push({
        severity: 'HIGH',
        metric: 'Heart Rate',
        reading: `${heartRate} BPM`,
        reason: 'Heart rate significantly outside prototype resting reference limits',
        action: 'Rest immediately and consult a healthcare professional if palpitations or dizziness occur.'
      })
    }
  }

  // 2. Blood Oxygen Saturation (SpO2)
  if (spo2 != null && !isNaN(spo2)) {
    activeSensors.push('Blood Oxygen')
    if (spo2 >= 95) {
      positiveFactors.push(`Optimal blood oxygen saturation (${spo2}%)`)
    } else if (spo2 >= 92 && spo2 < 95) {
      score -= 15
      deductions.push({ metric: 'SpO₂', deduction: 15, reason: `Sub-optimal oxygen saturation (${spo2}%)` })
      attentionFactors.push(`Mildly depressed oxygen saturation (${spo2}%)`)
      alerts.push({
        severity: 'MODERATE',
        metric: 'SpO₂',
        reading: `${spo2}%`,
        reason: 'Blood oxygen saturation below 95%',
        action: 'Ensure clean ventilation, sit upright, take deep breaths, and verify sensor finger contact.'
      })
    } else {
      score -= 30
      deductions.push({ metric: 'SpO₂', deduction: 30, reason: `Low blood oxygen saturation (${spo2}%)` })
      attentionFactors.push(`Low blood oxygen saturation (${spo2}%)`)
      alerts.push({
        severity: 'HIGH',
        metric: 'SpO₂',
        reading: `${spo2}%`,
        reason: 'Low oxygen saturation reading (<92%)',
        action: 'Check probe positioning. If persistent or accompanied by shortness of breath, seek medical evaluation.'
      })
    }
  }

  // 3. Body Temperature Evaluation (IR Thermometer)
  if (temperature != null && !isNaN(temperature)) {
    activeSensors.push('Temperature')
    if (temperature >= 36.1 && temperature <= 37.2) {
      positiveFactors.push(`Normal core body temperature (${temperature}°C)`)
    } else if (temperature > 37.2 && temperature <= 37.8) {
      score -= 10
      deductions.push({ metric: 'Temperature', deduction: 10, reason: `Slightly elevated thermal reading (${temperature}°C)` })
      attentionFactors.push(`Mild thermal elevation (${temperature}°C)`)
      recommendations.push({
        category: 'THERMAL REGULATION',
        title: 'Thermal Comfort & Hydration',
        suggestion: 'Drink cool water, rest in a temperate room, and monitor for changes in temperature.',
        priority: 'Medium'
      })
    } else if (temperature > 37.8 && temperature <= 38.5) {
      score -= 25
      deductions.push({ metric: 'Temperature', deduction: 25, reason: `Subfebrile fever reading (${temperature}°C)` })
      attentionFactors.push(`Fever indication detected (${temperature}°C)`)
      alerts.push({
        severity: 'MODERATE',
        metric: 'Temperature',
        reading: `${temperature}°C`,
        reason: 'Elevated temperature reading',
        action: 'Stay well-hydrated, rest, and monitor temperature periodically.'
      })
    } else if (temperature > 38.5) {
      score -= 35
      deductions.push({ metric: 'Temperature', deduction: 35, reason: `High fever reading (${temperature}°C)` })
      attentionFactors.push(`High fever reading (${temperature}°C)`)
      alerts.push({
        severity: 'HIGH',
        metric: 'Temperature',
        reading: `${temperature}°C`,
        reason: 'High thermal reading detected',
        action: 'Rest, hydrate, and consider consulting a healthcare professional if accompanied by chills or fatigue.'
      })
    } else if (temperature < 35.5) {
      score -= 20
      deductions.push({ metric: 'Temperature', deduction: 20, reason: `Low temperature reading (${temperature}°C)` })
      attentionFactors.push(`Below normal body temperature (${temperature}°C)`)
    }
  }

  // 4. Optical Posture Assessment (Computer Vision)
  if (posture === 'Good') {
    positiveFactors.push('Upright cervical and spinal posture alignment')
  } else if (posture === 'Needs Improvement') {
    score -= 10
    deductions.push({ metric: 'Posture', deduction: 10, reason: 'Forward head tilt or mild shoulder asymmetry' })
    attentionFactors.push('Mild posture deviation (Forward head/screen tilt)')
    recommendations.push({
      category: 'POSTURE & ERGONOMICS',
      title: 'Cervical Spine Realignment',
      suggestion: 'Roll your shoulders back and elevate screen to eye level to reduce neck strain.',
      priority: 'Medium'
    })
  } else if (posture === 'Poor') {
    score -= 20
    deductions.push({ metric: 'Posture', deduction: 20, reason: 'Significant slouching or cervical slump' })
    attentionFactors.push('Noticeable postural slouching detected')
    recommendations.push({
      category: 'POSTURE & ERGONOMICS',
      title: 'Ergonomic Posture Reset',
      suggestion: 'Perform gentle shoulder blade retractions and adjust chair lumbar support.',
      priority: 'High'
    })
  }

  // 5. Optical Fatigue / Alertness Assessment (EAR Index)
  if (fatigue === 'Low') {
    positiveFactors.push('High facial alertness & standard blink rate')
  } else if (fatigue === 'Moderate') {
    score -= 10
    deductions.push({ metric: 'Fatigue', deduction: 10, reason: 'Mild ocular fatigue or elevated blink frequency' })
    attentionFactors.push('Mild ocular fatigue markers')
    recommendations.push({
      category: 'RECOVERY & SLEEP',
      title: '20-20-20 Visual Rest',
      suggestion: 'Look at an object 20 feet away for 20 seconds to relax ocular muscles.',
      priority: 'Medium'
    })
  } else if (fatigue === 'High') {
    score -= 25
    deductions.push({ metric: 'Fatigue', deduction: 25, reason: 'Frequent slow eyelid closures (micro-sleep markers)' })
    attentionFactors.push('Elevated visual fatigue & sluggish eyelid closure')
    recommendations.push({
      category: 'RECOVERY & SLEEP',
      title: 'Immediate Rest Interval',
      suggestion: 'Take a structured 15-minute screen break, hydrate, and consider power napping.',
      priority: 'High'
    })
  }

  // Clamp score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score))

  // Determine Overall Health Status & Risk Level
  let healthStatus = 'Healthy'
  let riskLevel = 'LOW'

  if (finalScore >= 80) {
    healthStatus = 'Healthy'
    riskLevel = 'LOW'
  } else if (finalScore >= 60) {
    healthStatus = 'Needs Attention'
    riskLevel = 'MODERATE'
  } else {
    healthStatus = 'High Risk'
    riskLevel = 'HIGH'
  }

  // Ensure default general wellness recommendation if all optimal
  if (recommendations.length === 0) {
    recommendations.push({
      category: 'GENERAL WELLNESS',
      title: 'Maintain Current Lifestyle Rhythm',
      suggestion: 'Your monitored indicators are within healthy prototype reference ranges. Keep staying active and hydrated.',
      priority: 'Low'
    })
  }

  // Generate single priority action
  let priorityAction = 'Continue your current balanced lifestyle, maintain proper posture, and stay hydrated throughout the day.'
  if (alerts.length > 0) {
    priorityAction = alerts[0].action
  } else if (recommendations.length > 0 && recommendations[0].priority === 'High') {
    priorityAction = recommendations[0].suggestion
  } else if (attentionFactors.length > 0) {
    priorityAction = `Focus on ${attentionFactors[0].toLowerCase()} to optimize your wellness score.`
  }

  // Generate summary narrative
  let summary = `Your overall wellness score is ${finalScore}/100 with a ${riskLevel.toLowerCase()} risk profile. `
  if (activeSensors.length > 0) {
    summary += `Evaluated using active telemetry (${activeSensors.join(', ')}) combined with camera posture and fatigue metrics. `
  } else {
    summary += `Evaluated using camera optical posture and fatigue indicators (hardware sensors disconnected). `
  }

  if (positiveFactors.length > 0) {
    summary += `Positive factors: ${positiveFactors.slice(0, 2).join(', ')}. `
  }
  if (attentionFactors.length > 0) {
    summary += `Areas for improvement: ${attentionFactors.join(', ')}.`
  }

  // Build unified parameters list for UI display
  const parameters = [
    {
      id: 'heart_rate',
      name: 'Heart Rate',
      reading: heartRate != null ? `${heartRate} BPM` : 'Sensor Disconnected',
      raw: heartRate,
      status: heartRate == null ? 'DISCONNECTED' : (heartRate >= 60 && heartRate <= 100 ? 'NORMAL' : 'ATTENTION'),
      referenceRange: '60 – 100 BPM',
      source: heartRate != null ? (isDemo ? 'demo' : 'hardware') : 'unavailable'
    },
    {
      id: 'spo2',
      name: 'Blood Oxygen (SpO₂)',
      reading: spo2 != null ? `${spo2}%` : 'Sensor Disconnected',
      raw: spo2,
      status: spo2 == null ? 'DISCONNECTED' : (spo2 >= 95 ? 'NORMAL' : 'ATTENTION'),
      referenceRange: '95 – 100%',
      source: spo2 != null ? (isDemo ? 'demo' : 'hardware') : 'unavailable'
    },
    {
      id: 'temperature',
      name: 'Body Temperature',
      reading: temperature != null ? `${temperature}°C` : 'Sensor Disconnected',
      raw: temperature,
      status: temperature == null ? 'DISCONNECTED' : (temperature >= 36.1 && temperature <= 37.2 ? 'NORMAL' : 'ATTENTION'),
      referenceRange: '36.1 – 37.2°C',
      source: temperature != null ? (isDemo ? 'demo' : 'hardware') : 'unavailable'
    },
    {
      id: 'distance',
      name: 'Person Distance',
      reading: distance != null ? `${distance} cm` : 'Sensor Disconnected',
      raw: distance,
      status: distance == null ? 'DISCONNECTED' : (distance >= 50 && distance <= 80 ? 'OPTIMAL' : 'ADJUST DISTANCE'),
      referenceRange: '50 – 80 cm',
      source: distance != null ? (isDemo ? 'demo' : 'vision') : 'unavailable'
    },
    {
      id: 'posture',
      name: 'Spinal Posture',
      reading: posture || 'Good',
      raw: posture,
      status: posture === 'Good' ? 'GOOD' : 'ATTENTION',
      referenceRange: 'Upright & Symmetrical',
      source: isDemo ? 'demo' : 'vision'
    },
    {
      id: 'fatigue',
      name: 'Alertness & Fatigue',
      reading: fatigue || 'Low',
      raw: fatigue,
      status: fatigue === 'Low' ? 'ALERT' : 'ATTENTION',
      referenceRange: 'Low Fatigue (EAR > 0.28)',
      source: isDemo ? 'demo' : 'vision'
    }
  ]

  return {
    wellnessScore: finalScore,
    healthStatus,
    riskLevel,
    deductions,
    positiveFactors,
    attentionFactors,
    recommendations,
    alerts,
    priorityAction,
    summary,
    parameters,
    activeSensors,
    isDemo,
    disclaimer: 'Disclaimer: This Smart Mirror is an educational prototype and personal wellness-monitoring system. Its measurements and rule-based insights are not medical diagnoses and do not replace professional healthcare advice.',
    createdAt: new Date().toISOString()
  }
}
