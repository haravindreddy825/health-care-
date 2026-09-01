/**
 * ReportComparisonService.js
 * Performs dynamic delta and trend comparisons STRICTLY between sessions of the SAME USER.
 */

export function compareSameUserReports(currentReport, previousReport) {
  if (!previousReport) {
    return {
      hasPrevious: false,
      scoreDelta: 0,
      heartRateDelta: null,
      spo2Delta: null,
      temperatureDelta: null,
      postureShift: null,
      fatigueShift: null,
      overallTrend: 'STABLE',
      changedItems: ['Initial baseline wellness check recorded for this user profile.'],
      whatToImprove: extractImprovementAreas(currentReport)
    }
  }

  const currScore = extractScore(currentReport)
  const prevScore = extractScore(previousReport)
  const scoreDelta = currScore - prevScore

  const currHR = extractParam(currentReport, 'heart_rate', 'Heart Rate')
  const prevHR = extractParam(previousReport, 'heart_rate', 'Heart Rate')
  const heartRateDelta = (currHR != null && prevHR != null) ? (currHR - prevHR) : null

  const currSpO2 = extractParam(currentReport, 'spo2', 'Blood Oxygen (SpO₂)')
  const prevSpO2 = extractParam(previousReport, 'spo2', 'Blood Oxygen (SpO₂)')
  const spo2Delta = (currSpO2 != null && prevSpO2 != null) ? (currSpO2 - prevSpO2) : null

  const currTemp = extractParam(currentReport, 'temperature', 'Body Temperature')
  const prevTemp = extractParam(previousReport, 'temperature', 'Body Temperature')
  const temperatureDelta = (currTemp != null && prevTemp != null) ? parseFloat((currTemp - prevTemp).toFixed(1)) : null

  const currPosture = extractParam(currentReport, 'posture_status', 'Spinal Posture') || 'Good'
  const prevPosture = extractParam(previousReport, 'posture_status', 'Spinal Posture') || 'Good'
  const postureShift = `${prevPosture} → ${currPosture}`

  const currFatigue = extractParam(currentReport, 'fatigue_level', 'Alertness & Fatigue') || 'Low'
  const prevFatigue = extractParam(previousReport, 'fatigue_level', 'Alertness & Fatigue') || 'Low'
  const fatigueShift = `${prevFatigue} → ${currFatigue}`

  // Trend classification
  let overallTrend = 'STABLE'
  if (scoreDelta >= 4) {
    overallTrend = 'IMPROVING'
  } else if (scoreDelta <= -4) {
    overallTrend = 'NEEDS ATTENTION'
  }

  // Dynamic "What Changed?" statements
  const changedItems = []

  if (scoreDelta > 0) {
    changedItems.push(`↑ Wellness score improved by +${scoreDelta} points (${prevScore} → ${currScore}).`)
  } else if (scoreDelta < 0) {
    changedItems.push(`↓ Wellness score decreased by ${scoreDelta} points (${prevScore} → ${currScore}).`)
  } else {
    changedItems.push(`→ Wellness score remained steady at ${currScore} points.`)
  }

  if (heartRateDelta != null && Math.abs(heartRateDelta) >= 3) {
    if (heartRateDelta < 0) {
      changedItems.push(`↓ Resting heart rate normalized by ${Math.abs(heartRateDelta)} BPM (${prevHR} → ${currHR} BPM).`)
    } else {
      changedItems.push(`↑ Resting heart rate elevated by +${heartRateDelta} BPM (${prevHR} → ${currHR} BPM).`)
    }
  }

  if (spo2Delta != null && Math.abs(spo2Delta) >= 1) {
    if (spo2Delta > 0) {
      changedItems.push(`✓ Blood oxygen saturation increased by +${spo2Delta}% (${prevSpO2}% → ${currSpO2}%).`)
    } else {
      changedItems.push(`⚠ Blood oxygen saturation changed by ${spo2Delta}% (${prevSpO2}% → ${currSpO2}%).`)
    }
  }

  if (temperatureDelta != null && Math.abs(temperatureDelta) >= 0.2) {
    changedItems.push(`🌡 Core body temperature shifted from ${prevTemp}°C to ${currTemp}°C.`)
  } else if (currTemp != null) {
    changedItems.push(`→ Body temperature remained stable (${currTemp}°C).`)
  }

  if (prevPosture !== currPosture) {
    if (currPosture === 'Good') {
      changedItems.push(`✓ Postural alignment improved from "${prevPosture}" to "Good".`)
    } else {
      changedItems.push(`⚠ Postural alignment shifted from "${prevPosture}" to "${currPosture}".`)
    }
  }

  if (prevFatigue !== currFatigue) {
    if (currFatigue === 'Low') {
      changedItems.push(`✓ Alertness restored; ocular fatigue transitioned from "${prevFatigue}" to "Low".`)
    } else {
      changedItems.push(`⚠ Eyelid fatigue indicators transitioned from "${prevFatigue}" to "${currFatigue}".`)
    }
  }

  if (changedItems.length <= 1) {
    changedItems.push('Physical readings and optical landmarks remained consistent with your previous session.')
  }

  return {
    hasPrevious: true,
    previousScore: prevScore,
    currentScore: currScore,
    scoreDelta,
    heartRateDelta,
    spo2Delta,
    temperatureDelta,
    postureShift,
    fatigueShift,
    overallTrend,
    changedItems,
    whatToImprove: extractImprovementAreas(currentReport),
    comparisonTable: {
      score: { previous: prevScore, current: currScore, delta: scoreDelta },
      heartRate: { previous: prevHR, current: currHR, delta: heartRateDelta },
      spo2: { previous: prevSpO2, current: currSpO2, delta: spo2Delta },
      temperature: { previous: prevTemp, current: currTemp, delta: temperatureDelta },
      posture: { previous: prevPosture, current: currPosture, shift: postureShift },
      fatigue: { previous: prevFatigue, current: currFatigue, shift: fatigueShift },
      previousDate: previousReport.created_at || null
    }
  }
}

function extractScore(report) {
  if (!report) return 85
  if (typeof report.wellnessScore === 'number') return report.wellnessScore
  if (report.health_analysis) {
    const a = Array.isArray(report.health_analysis) ? report.health_analysis[0] : report.health_analysis
    if (typeof a?.wellness_score === 'number') return a.wellness_score
  }
  return 85
}

function extractParam(report, key, name) {
  if (!report) return null
  if (report[key] !== undefined && report[key] !== null) return report[key]
  if (report.parameters && Array.isArray(report.parameters)) {
    const p = report.parameters.find(x => x.id === key || x.name?.toLowerCase() === name.toLowerCase())
    if (p && p.raw != null) return p.raw
  }
  if (report.reading && report.reading[key] !== undefined && report.reading[key] !== null) {
    return report.reading[key]
  }
  return null
}

function extractImprovementAreas(report) {
  if (!report) return []
  const list = []
  if (report.recommendations && Array.isArray(report.recommendations)) {
    report.recommendations.forEach(r => {
      if (r.category !== 'GENERAL WELLNESS' || (report.wellnessScore && report.wellnessScore < 85)) {
        list.push({
          category: r.category || 'WELLNESS',
          suggestion: r.suggestion || r.title || 'Maintain healthy daily habits.',
          priority: r.priority || 'Medium'
        })
      }
    })
  }

  if (list.length === 0) {
    list.push({
      category: 'GENERAL WELLNESS',
      suggestion: 'Your current wellness indicators are within healthy normal reference ranges. Continue your routine.',
      priority: 'Low'
    })
  }

  return list
}
