/**
 * Report Comparison Engine
 * Compares current and previous wellness assessments dynamically using real session data.
 */

export function compareWellnessReports(currentReport, previousReport) {
  if (!previousReport) {
    return {
      hasPrevious: false,
      scoreDelta: 0,
      heartRateDelta: null,
      temperatureDelta: null,
      postureChange: null,
      fatigueChange: null,
      overallTrend: 'STABLE',
      changedItems: ['Initial baseline check recorded for this device.'],
      improvementAreas: getImprovementAreas(currentReport)
    }
  }

  // Extract scores
  const currScore = extractScore(currentReport)
  const prevScore = extractScore(previousReport)
  const scoreDelta = currScore - prevScore

  // Extract Heart Rate
  const currHr = extractParam(currentReport, 'heart_rate', 'Heart Rate', 'raw')
  const prevHr = extractParam(previousReport, 'heart_rate', 'Heart Rate', 'raw')
  const heartRateDelta = (currHr != null && prevHr != null) ? (currHr - prevHr) : null

  // Extract Temperature
  const currTemp = extractParam(currentReport, 'temperature', 'Temperature', 'raw')
  const prevTemp = extractParam(previousReport, 'temperature', 'Temperature', 'raw')
  const temperatureDelta = (currTemp != null && prevTemp != null) ? Number((currTemp - prevTemp).toFixed(1)) : null

  // Extract Posture
  const currPosture = extractParam(currentReport, 'posture_status', 'Posture', 'reading') || 'Good'
  const prevPosture = extractParam(previousReport, 'posture_status', 'Posture', 'reading') || 'Good'
  const postureChange = `${prevPosture} → ${currPosture}`

  // Extract Fatigue
  const currFatigue = extractParam(currentReport, 'fatigue_level', 'Fatigue', 'reading') || 'Low'
  const prevFatigue = extractParam(previousReport, 'fatigue_level', 'Fatigue', 'reading') || 'Low'
  const fatigueChange = `${prevFatigue} → ${currFatigue}`

  // Determine Overall Trend
  let overallTrend = 'STABLE'
  if (scoreDelta >= 3) {
    overallTrend = 'IMPROVING'
  } else if (scoreDelta <= -3) {
    overallTrend = 'NEEDS ATTENTION'
  }

  // Build Dynamic "What Changed?" List
  const changedItems = []

  if (scoreDelta > 0) {
    changedItems.push(`↑ Wellness score increased by ${scoreDelta} points (${prevScore} → ${currScore}).`)
  } else if (scoreDelta < 0) {
    changedItems.push(`↓ Wellness score changed by ${scoreDelta} points (${prevScore} → ${currScore}).`)
  } else {
    changedItems.push(`→ Wellness score remained steady at ${currScore} points.`)
  }

  if (heartRateDelta != null && Math.abs(heartRateDelta) >= 3) {
    if (heartRateDelta < 0) {
      changedItems.push(`↓ Heart rate normalized by ${Math.abs(heartRateDelta)} BPM (${prevHr} → ${currHr} BPM).`)
    } else {
      changedItems.push(`↑ Heart rate elevated by +${heartRateDelta} BPM (${prevHr} → ${currHr} BPM).`)
    }
  }

  if (temperatureDelta != null && Math.abs(temperatureDelta) >= 0.3) {
    changedItems.push(`🌡 Body temperature shifted from ${prevTemp}°C to ${currTemp}°C.`)
  } else if (currTemp != null) {
    changedItems.push(`→ Body temperature remained relatively stable (${currTemp}°C).`)
  }

  if (prevPosture !== currPosture) {
    if (currPosture === 'Good') {
      changedItems.push(`✓ Posture alignment improved from "${prevPosture}" to "Good".`)
    } else {
      changedItems.push(`⚠ Posture alignment shifted from "${prevPosture}" to "${currPosture}".`)
    }
  }

  if (prevFatigue !== currFatigue) {
    if (currFatigue === 'Low') {
      changedItems.push(`✓ Alertness improved; fatigue level transitioned from "${prevFatigue}" to "Low".`)
    } else {
      changedItems.push(`⚠ Ocular fatigue markers transitioned from "${prevFatigue}" to "${currFatigue}".`)
    }
  }

  if (changedItems.length === 1) {
    changedItems.push('Physiological and optical readings remained consistent with your previous session.')
  }

  const improvementAreas = getImprovementAreas(currentReport)

  return {
    hasPrevious: true,
    previousScore: prevScore,
    currentScore: currScore,
    scoreDelta,
    heartRateDelta,
    temperatureDelta,
    postureChange,
    fatigueChange,
    overallTrend,
    changedItems,
    improvementAreas,
    comparison: {
      score: { previous: prevScore, current: currScore },
      heartRate: { previous: prevHr, current: currHr },
      temperature: { previous: prevTemp, current: currTemp },
      posture: { previous: prevPosture, current: currPosture },
      fatigue: { previous: prevFatigue, current: currFatigue },
      date: previousReport.created_at || null
    }
  }
}

function extractScore(report) {
  if (!report) return 80
  if (typeof report.wellnessScore === 'number') return report.wellnessScore
  if (report.health_analysis) {
    const a = Array.isArray(report.health_analysis) ? report.health_analysis[0] : report.health_analysis
    if (typeof a?.wellness_score === 'number') return a.wellness_score
  }
  return 80
}

function extractParam(report, dbKey, paramName, subKey = 'reading') {
  if (!report) return null
  if (report[dbKey] != null) return report[dbKey]
  if (report.parameters && Array.isArray(report.parameters)) {
    const found = report.parameters.find(p => p.name?.toLowerCase() === paramName.toLowerCase())
    if (found) return found[subKey] ?? found.reading ?? found.raw
  }
  if (report.reading && report.reading[dbKey] != null) return report.reading[dbKey]
  return null
}

function getImprovementAreas(currentReport) {
  if (!currentReport) return []
  const list = []

  // Check recommendations from rule engine
  if (currentReport.recommendations && Array.isArray(currentReport.recommendations)) {
    currentReport.recommendations.forEach(r => {
      if (r.category !== 'GENERAL WELLNESS' || (currentReport.wellnessScore && currentReport.wellnessScore < 85)) {
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
      suggestion: "Your current wellness indicators are within the prototype's normal reference ranges. Continue your current routine.",
      priority: 'General'
    })
  }

  return list
}
