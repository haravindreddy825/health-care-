import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { compareWellnessReports } from './reportComparison.js'

const LOCAL_STORAGE_KEY = 'smart_mirror_sessions_master_v3'
let memorySessions = []

function readStorage() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    }
  } catch (e) {}
  return memorySessions
}

function writeStorage(sessions) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sessions))
    }
  } catch (e) {}
  memorySessions = sessions
}

/**
 * Saves a complete wellness monitoring session to local storage & Supabase
 */
export async function saveWellnessSession({
  sessionId,
  reading,
  analysis,
  recommendations = [],
  profileId = 'mirror_person_01',
  observationDuration = '10s Fast Check'
}) {
  const sid = sessionId || `SMR-${Date.now().toString(36).toUpperCase()}`
  
  const record = {
    id: sid,
    session_id: sid,
    profile_id: profileId,
    observation_duration: observationDuration,
    created_at: new Date().toISOString(),
    heart_rate: reading.heartRate,
    temperature: reading.temperature,
    posture_status: reading.posture,
    fatigue_level: reading.fatigue,
    face_detected: true,
    health_analysis: [
      {
        id: `ANA-${Date.now().toString(36)}`,
        wellness_score: analysis.wellnessScore,
        health_status: analysis.healthStatus,
        risk_level: analysis.riskLevel,
        analysis: analysis.overallInterpretation,
        immediate_action: analysis.priorityAction,
        created_at: new Date().toISOString(),
        recommendations: (recommendations || []).map((r, i) => ({
          id: `REC-${i}-${Date.now().toString(36)}`,
          category: r.category || 'GENERAL WELLNESS',
          suggestion: r.suggestion || r.title || 'Maintain healthy lifestyle.',
          priority: r.priority || 'Medium'
        }))
      }
    ]
  }

  // 1. Save to Local Master Cache (guaranteed persistence)
  try {
    const existing = getLocalSessions()
    const updated = [record, ...existing.filter(e => e.id !== sid && e.session_id !== sid)].slice(0, 50)
    writeStorage(updated)
  } catch (err) {
    console.warn('Local session cache write notice:', err)
  }

  // 2. Save to Supabase (Preserving Existing Database Tables)
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: readingData, error: rErr } = await supabase
        .from('health_readings')
        .insert([
          {
            profile_id: profileId,
            session_id: sid,
            observation_duration: observationDuration,
            monitoring_mode: 'Optical & Sensor Matrix',
            heart_rate: reading.heartRate,
            temperature: reading.temperature,
            fatigue_level: reading.fatigue,
            posture_status: reading.posture,
            face_detected: true
          }
        ])
        .select()
        .single()

      if (!rErr && readingData) {
        const { data: analysisData } = await supabase
          .from('health_analysis')
          .insert([
            {
              reading_id: readingData.id,
              health_status: analysis.healthStatus,
              wellness_score: analysis.wellnessScore,
              risk_level: analysis.riskLevel,
              analysis: analysis.overallInterpretation,
              immediate_action: analysis.priorityAction
            }
          ])
          .select()
          .single()

        if (analysisData && recommendations.length > 0) {
          const recRows = recommendations.map(rec => ({
            analysis_id: analysisData.id,
            category: rec.category || 'GENERAL WELLNESS',
            suggestion: rec.suggestion || rec.title,
            priority: rec.priority || 'Medium'
          }))
          await supabase.from('recommendations').insert(recRows)
        }
      }
    } catch (cloudErr) {
      console.warn('Cloud sync notice (offline mode active):', cloudErr)
    }
  }

  return record
}

/**
 * Retrieves all stored sessions from Supabase and/or Local Cache
 */
export async function getStoredSessions(limit = 25) {
  const localList = getLocalSessions()

  if (!isSupabaseConfigured || !supabase) {
    return localList.slice(0, limit)
  }

  try {
    const { data, error } = await supabase
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
          immediate_action,
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

    if (error || !data || data.length === 0) {
      return localList.slice(0, limit)
    }

    // Merge Supabase + Local
    const merged = [...data]
    localList.forEach(loc => {
      if (!merged.some(m => m.id === loc.id || m.session_id === loc.session_id)) {
        merged.push(loc)
      }
    })

    merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return merged.slice(0, limit)
  } catch (err) {
    return localList.slice(0, limit)
  }
}

export function getLocalSessions() {
  return readStorage()
}

/**
 * Computes multi-session comparative deltas
 */
export function calculateSessionTrend(currentSession, historyList = []) {
  if (!historyList || historyList.length === 0) {
    return compareWellnessReports(currentSession, null)
  }

  const previousRecord = historyList.find(
    h => h.id !== currentSession?.id && h.session_id !== currentSession?.session_id
  ) || historyList[0]

  return compareWellnessReports(currentSession, previousRecord)
}

/**
 * Cleanly wipes old test session records from database & local cache
 * (STRICTLY PRESERVES DATABASE SCHEMA, TABLES, INDEXES, AND RLS)
 */
export async function clearAllSessionData() {
  writeStorage([])
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      localStorage.removeItem('smart_mirror_local_face_profiles')
      for (let i = 1; i <= 10; i++) {
        localStorage.removeItem(`auramirror_session_history_mirror_person_${i.toString().padStart(2, '0')}`)
      }
    }
  } catch (e) {}

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('recommendations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('health_analysis').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('health_readings').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    } catch (e) {}
  }
}
