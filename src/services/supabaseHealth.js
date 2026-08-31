import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

/**
 * Service for Supabase database operations & resilient local fallback caching
 * related to Smart Mirror telemetry, Profile-based history, and Personal Wellness Reports.
 */

const LOCAL_SESSION_KEY_PREFIX = 'auramirror_session_history_'

/**
 * Saves an individual health reading row.
 */
export async function saveHealthReading({
  heartRate,
  temperature,
  fatigueLevel,
  postureStatus,
  faceDetected = true,
  userId = null,
  profileId = 'mirror_person_01',
  sessionId = null,
  observationDuration = '10 seconds (Fast Demo)',
  monitoringMode = 'Demo Sensor Mode'
}) {
  if (!isSupabaseConfigured || !supabase) {
    // Return synthetic reading for local offline storage
    return {
      id: sessionId || `SMR-${Date.now().toString(36).toUpperCase()}`,
      user_id: userId,
      profile_id: profileId,
      session_id: sessionId || `SMR-${Date.now().toString(36).toUpperCase()}`,
      observation_duration: observationDuration,
      monitoring_mode: monitoringMode,
      heart_rate: heartRate !== null && heartRate !== undefined ? Math.round(Number(heartRate)) : 78,
      temperature: temperature !== null && temperature !== undefined ? parseFloat(Number(temperature).toFixed(1)) : 36.7,
      fatigue_level: fatigueLevel || 'Low',
      posture_status: postureStatus || 'Good',
      face_detected: Boolean(faceDetected),
      created_at: new Date().toISOString()
    }
  }

  const { data, error } = await supabase
    .from('health_readings')
    .insert([
      {
        user_id: userId,
        profile_id: profileId || 'mirror_person_01',
        session_id: sessionId || `SMR-${Date.now().toString(36).toUpperCase()}`,
        observation_duration: observationDuration || '10 seconds (Fast Demo)',
        monitoring_mode: monitoringMode || 'Demo Sensor Mode',
        heart_rate: heartRate !== null && heartRate !== undefined ? Math.round(Number(heartRate)) : null,
        temperature: temperature !== null && temperature !== undefined ? parseFloat(Number(temperature).toFixed(2)) : null,
        fatigue_level: fatigueLevel || 'Low',
        posture_status: postureStatus || 'Good',
        face_detected: Boolean(faceDetected),
      }
    ])
    .select()
    .single()

  if (error) {
    console.warn('Notice saving health reading to Supabase (using local fallback):', error)
    return {
      id: sessionId || `SMR-${Date.now().toString(36).toUpperCase()}`,
      profile_id: profileId,
      session_id: sessionId,
      heart_rate: heartRate,
      temperature: temperature,
      fatigue_level: fatigueLevel,
      posture_status: postureStatus,
      face_detected: faceDetected,
      created_at: new Date().toISOString()
    }
  }

  return data
}

/**
 * Saves an individual health analysis row linked to a reading.
 */
export async function saveHealthAnalysis({
  readingId,
  healthStatus,
  wellnessScore,
  riskLevel,
  analysis,
  aiSummary = null,
  aiRiskAssessment = null,
  immediateAction = null,
  observations = null
}) {
  const payload = {
    reading_id: readingId,
    health_status: healthStatus,
    wellness_score: Math.round(Number(wellnessScore)),
    risk_level: riskLevel,
    analysis: analysis,
    ai_summary: aiSummary,
    ai_risk_assessment: aiRiskAssessment,
    immediate_action: immediateAction,
    observations: observations ? (Array.isArray(observations) ? observations : [observations]) : null,
    created_at: new Date().toISOString()
  }

  if (!isSupabaseConfigured || !supabase) {
    return { id: `ANA-${Date.now().toString(36)}`, ...payload }
  }

  const { data, error } = await supabase
    .from('health_analysis')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.warn('Notice saving health analysis to Supabase:', error)
    return { id: `ANA-${Date.now().toString(36)}`, ...payload }
  }

  return data
}

/**
 * Saves recommendations linked to an analysis.
 */
export async function saveRecommendations(analysisId, recommendations = []) {
  if (!recommendations || recommendations.length === 0) {
    return []
  }

  const rows = recommendations.map(rec => ({
    analysis_id: analysisId,
    category: rec.category || 'GENERAL WELLNESS',
    suggestion: rec.suggestion || rec.text || 'Maintain regular healthy habits.',
    priority: rec.priority || 'Medium',
    created_at: new Date().toISOString()
  }))

  if (!isSupabaseConfigured || !supabase) {
    return rows
  }

  const { data, error } = await supabase
    .from('recommendations')
    .insert(rows)
    .select()

  if (error) {
    console.warn('Notice saving recommendations to Supabase:', error)
    return rows
  }

  return data || rows
}

/**
 * Saves complete health telemetry session (reading -> analysis -> recommendations)
 * associated with a Profile ID, persisting to Supabase and Local Storage.
 */
export async function saveCompleteHealthSession({
  reading,
  analysis,
  recommendations = []
}) {
  const profileId = reading.profileId || 'mirror_person_01'
  const sessionId = reading.sessionId || `SMR-${Date.now().toString(36).toUpperCase()}`

  // 1. Insert health_reading
  const savedReading = await saveHealthReading({
    heartRate: reading.heartRate,
    temperature: reading.temperature,
    fatigueLevel: reading.fatigue,
    postureStatus: reading.posture,
    faceDetected: reading.faceDetected,
    userId: reading.userId || null,
    profileId: profileId,
    sessionId: sessionId,
    observationDuration: reading.observationDuration || '10 seconds (Fast Demo)',
    monitoringMode: reading.monitoringMode || 'Demo Sensor Mode'
  })

  // 2. Insert health_analysis
  const savedAnalysis = await saveHealthAnalysis({
    readingId: savedReading.id,
    healthStatus: analysis.healthStatus,
    wellnessScore: analysis.wellnessScore,
    riskLevel: analysis.riskLevel,
    analysis: analysis.analysisSummary || analysis.analysis || 'Report assessment recorded.',
    aiSummary: analysis.aiSummary || null,
    aiRiskAssessment: analysis.aiRiskAssessment || null,
    immediateAction: analysis.immediateAction || null,
    observations: analysis.observations || null
  })

  // 3. Insert recommendations
  let savedRecommendations = []
  if (recommendations && recommendations.length > 0) {
    savedRecommendations = await saveRecommendations(savedAnalysis.id, recommendations)
  }

  // 4. Update Local Storage Cache for immediate retrieval
  try {
    const cacheKey = `${LOCAL_SESSION_KEY_PREFIX}${profileId}`
    const existingRaw = localStorage.getItem(cacheKey)
    const existingList = existingRaw ? JSON.parse(existingRaw) : []

    const newRecord = {
      id: savedReading.id,
      profile_id: profileId,
      session_id: sessionId,
      observation_duration: reading.observationDuration || '10 seconds (Fast Demo)',
      monitoring_mode: reading.monitoringMode || 'Demo Sensor Mode',
      heart_rate: reading.heartRate,
      temperature: reading.temperature,
      fatigue_level: reading.fatigue,
      posture_status: reading.posture,
      face_detected: true,
      created_at: new Date().toISOString(),
      health_analysis: [
        {
          id: savedAnalysis.id,
          health_status: analysis.healthStatus,
          wellness_score: analysis.wellnessScore,
          risk_level: analysis.riskLevel,
          analysis: analysis.analysisSummary || analysis.analysis || 'Report assessment recorded.',
          ai_summary: analysis.aiSummary || null,
          ai_risk_assessment: analysis.aiRiskAssessment || null,
          immediate_action: analysis.immediateAction || null,
          observations: analysis.observations || null,
          created_at: new Date().toISOString(),
          recommendations: savedRecommendations
        }
      ]
    }

    // Prepend new record & keep up to 50 sessions
    const updatedList = [newRecord, ...existingList.filter(e => e.id !== newRecord.id)].slice(0, 50)
    localStorage.setItem(cacheKey, JSON.stringify(updatedList))
  } catch (cacheErr) {
    console.warn('Local session cache notice:', cacheErr)
  }

  return {
    reading: savedReading,
    analysis: savedAnalysis,
    recommendations: savedRecommendations
  }
}

/**
 * Retrieves past sessions for a specific Profile ID from Supabase and/or local cache.
 */
export async function getProfileHealthHistory(profileId = 'mirror_person_01', limit = 20) {
  const cacheKey = `${LOCAL_SESSION_KEY_PREFIX}${profileId}`
  let localSessions = []
  try {
    const raw = localStorage.getItem(cacheKey)
    if (raw) localSessions = JSON.parse(raw)
  } catch (e) {}

  if (!isSupabaseConfigured || !supabase) {
    return localSessions.slice(0, limit)
  }

  try {
    let query = supabase
      .from('health_readings')
      .select(`
        id,
        profile_id,
        session_id,
        observation_duration,
        monitoring_mode,
        heart_rate,
        temperature,
        fatigue_level,
        posture_status,
        face_detected,
        created_at,
        health_analysis (
          id,
          health_status,
          wellness_score,
          risk_level,
          analysis,
          ai_summary,
          ai_risk_assessment,
          immediate_action,
          observations,
          created_at,
          recommendations (
            id,
            category,
            suggestion,
            priority
          )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (profileId) {
      query = query.eq('profile_id', profileId)
    }

    const { data, error } = await query

    if (error || !data || data.length === 0) {
      return localSessions.slice(0, limit)
    }

    // Merge Supabase records with local sessions for complete history
    const combined = [...data]
    localSessions.forEach(loc => {
      if (!combined.some(c => c.id === loc.id || c.session_id === loc.session_id)) {
        combined.push(loc)
      }
    })

    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return combined.slice(0, limit)
  } catch (err) {
    console.warn('Notice fetching profile history from cloud, using local cache:', err)
    return localSessions.slice(0, limit)
  }
}

/**
 * Calculates comparative trend between the current session and previous session.
 */
export function calculateWellnessTrend(currentReading, historyList = []) {
  if (!historyList || historyList.length === 0) {
    return {
      hasPrevious: false,
      message: 'First wellness session recorded for this profile.'
    }
  }

  // Filter out current session
  const previousRecord = historyList.find(h => h.id !== currentReading?.id && h.session_id !== currentReading?.session_id) || historyList[0]
  if (!previousRecord) {
    return {
      hasPrevious: false,
      message: 'First wellness session recorded for this profile.'
    }
  }

  const prevAnalysis = Array.isArray(previousRecord.health_analysis)
    ? previousRecord.health_analysis[0]
    : previousRecord.health_analysis || previousRecord.analysis

  const currentAnalysis = Array.isArray(currentReading?.health_analysis)
    ? currentReading.health_analysis[0]
    : currentReading?.health_analysis || currentReading?.analysis

  const prevScore = prevAnalysis?.wellness_score ?? prevAnalysis?.wellnessScore ?? previousRecord.wellness_score ?? previousRecord.wellnessScore ?? null
  const currentScore = currentAnalysis?.wellness_score ?? currentAnalysis?.wellnessScore ?? currentReading?.wellness_score ?? currentReading?.wellnessScore ?? currentReading?.wellnessScore ?? null

  if (prevScore === null || currentScore === null) {
    return { hasPrevious: false, message: 'Historical comparison pending.' }
  }

  const diff = currentScore - prevScore
  let trendState = 'Stable'
  let trendDirection = '→'

  if (diff >= 3) {
    trendState = 'Improving'
    trendDirection = '↑'
  } else if (diff <= -3) {
    trendState = 'Needs Attention'
    trendDirection = '↓'
  }

  return {
    hasPrevious: true,
    previousScore: prevScore,
    currentScore: currentScore,
    scoreDiff: diff,
    trendState: trendState,
    trendDirection: trendDirection,
    message: diff === 0
      ? `Your wellness score remains consistent at ${currentScore} compared with the previous session.`
      : diff > 0
      ? `Your wellness score increased from ${prevScore} to ${currentScore} (+${diff}) compared with the previous saved session.`
      : `Your wellness score decreased from ${prevScore} to ${currentScore} (${diff}) compared with the previous saved session.`,
    comparison: {
      heartRate: {
        previous: previousRecord.heart_rate ?? previousRecord.heartRate,
        current: currentReading?.reading?.heart_rate ?? currentReading?.reading?.heartRate ?? currentReading?.heart_rate ?? currentReading?.heartRate
      },
      temperature: {
        previous: previousRecord.temperature,
        current: currentReading?.reading?.temperature ?? currentReading?.temperature
      },
      posture: {
        previous: previousRecord.posture_status ?? previousRecord.posture,
        current: currentReading?.reading?.posture_status ?? currentReading?.reading?.posture ?? currentReading?.posture_status ?? currentReading?.posture
      },
      fatigue: {
        previous: previousRecord.fatigue_level ?? previousRecord.fatigue,
        current: currentReading?.reading?.fatigue_level ?? currentReading?.reading?.fatigue ?? currentReading?.fatigue_level ?? currentReading?.fatigue
      },
      date: previousRecord.created_at
    }
  }
}

/**
 * Safely deletes all session records for a specific profile ID from Supabase and local cache.
 */
export async function deleteProfileHealthHistory(profileId = 'mirror_person_01') {
  // Clear local storage cache
  try {
    localStorage.removeItem(`${LOCAL_SESSION_KEY_PREFIX}${profileId}`)
    localStorage.removeItem('smart_mirror_local_face_profiles')
  } catch (e) {}

  if (!isSupabaseConfigured || !supabase) {
    return { success: true }
  }

  try {
    const { data: readings, error: fetchErr } = await supabase
      .from('health_readings')
      .select('id')
      .eq('profile_id', profileId)

    if (fetchErr) throw fetchErr

    if (readings && readings.length > 0) {
      const readingIds = readings.map(r => r.id)
      
      const { data: analyses } = await supabase
        .from('health_analysis')
        .select('id')
        .in('reading_id', readingIds)

      if (analyses && analyses.length > 0) {
        const analysisIds = analyses.map(a => a.id)
        await supabase.from('recommendations').delete().in('analysis_id', analysisIds)
        await supabase.from('health_analysis').delete().in('id', analysisIds)
      }

      const { error: delErr } = await supabase
        .from('health_readings')
        .delete()
        .in('id', readingIds)

      if (delErr) throw delErr
    }

    return { success: true }
  } catch (err) {
    console.warn('Error deleting profile health history from cloud:', err)
    return { success: true } // Local cache was wiped
  }
}

/**
 * Complete system wipe & reset utility to start fresh
 */
export function resetAllSmartMirrorData() {
  try {
    for (let i = 1; i <= 10; i++) {
      const pid = `mirror_person_${i.toString().padStart(2, '0')}`
      localStorage.removeItem(`${LOCAL_SESSION_KEY_PREFIX}${pid}`)
    }
    localStorage.removeItem(`${LOCAL_SESSION_KEY_PREFIX}User 001`)
    localStorage.removeItem(`${LOCAL_SESSION_KEY_PREFIX}mirror_person_01`)
    localStorage.removeItem('smart_mirror_local_face_profiles')
  } catch (e) {}
}
