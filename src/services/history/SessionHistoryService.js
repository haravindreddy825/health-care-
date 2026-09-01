import { supabase, isSupabaseConfigured } from '../../lib/supabase.js'
import { compareSameUserReports } from './ReportComparisonService.js'

const STORAGE_KEY = 'smart_mirror_sessions_master_v4'

export class SessionHistoryService {
  constructor() {
    this.memoryCache = []
  }

  readLocalStorage() {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
      }
    } catch (e) {}
    return this.memoryCache
  }

  writeLocalStorage(sessions) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
      }
    } catch (e) {}
    this.memoryCache = sessions
  }

  /**
   * Save a complete wellness session to Local Storage & Supabase
   */
  async saveSession({
    sessionId,
    profileId = 'usr_default_01',
    profileName = 'Alex Rivera',
    reading,
    analysis,
    observationDuration = '10s Fast Check'
  }) {
    const sid = sessionId || `SMR-${Date.now().toString(36).toUpperCase()}`

    const record = {
      id: sid,
      session_id: sid,
      profile_id: profileId,
      profile_name: profileName,
      observation_duration: observationDuration,
      created_at: new Date().toISOString(),
      heart_rate: reading.heartRate,
      spo2: reading.spo2,
      temperature: reading.temperature,
      distance: reading.distance,
      posture_status: reading.posture,
      fatigue_level: reading.fatigue,
      face_detected: true,
      is_demo: reading.isDemo || false,
      health_analysis: [
        {
          id: `ANA-${Date.now().toString(36)}`,
          wellness_score: analysis.wellnessScore,
          health_status: analysis.healthStatus,
          risk_level: analysis.riskLevel,
          analysis: analysis.summary,
          immediate_action: analysis.priorityAction,
          created_at: new Date().toISOString(),
          recommendations: (analysis.recommendations || []).map((r, i) => ({
            id: `REC-${i}-${Date.now().toString(36)}`,
            category: r.category || 'GENERAL WELLNESS',
            suggestion: r.suggestion || r.title || 'Maintain balanced habits.',
            priority: r.priority || 'Medium'
          }))
        }
      ]
    }

    // 1. Save to Local Master Cache (guaranteed persistence across refreshes)
    try {
      const existing = this.readLocalStorage()
      const updated = [record, ...existing.filter(e => e.id !== sid && e.session_id !== sid)].slice(0, 100)
      this.writeLocalStorage(updated)
    } catch (err) {
      console.warn('Local session cache write notice:', err)
    }

    // 2. Save to Supabase (if configured)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: readingData, error: rErr } = await supabase
          .from('health_readings')
          .insert([
            {
              profile_id: profileId,
              session_id: sid,
              observation_duration: observationDuration,
              monitoring_mode: reading.isDemo ? 'Demo Simulation Mode' : 'Live Optical & Physical Sensor Matrix',
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
                analysis: analysis.summary,
                immediate_action: analysis.priorityAction
              }
            ])
            .select()
            .single()

          if (analysisData && analysis.recommendations && analysis.recommendations.length > 0) {
            const recRows = analysis.recommendations.map(rec => ({
              analysis_id: analysisData.id,
              category: rec.category || 'GENERAL WELLNESS',
              suggestion: rec.suggestion || rec.title,
              priority: rec.priority || 'Medium'
            }))
            await supabase.from('recommendations').insert(recRows)
          }
        }
      } catch (cloudErr) {
        console.warn('Cloud sync notice (running in local mode):', cloudErr)
      }
    }

    return record
  }

  /**
   * Retrieves stored sessions, optionally filtered by user profile ID
   */
  async getSessions(profileId = null, limit = 50) {
    const localList = this.readLocalStorage()

    let mergedList = [...localList]

    if (isSupabaseConfigured && supabase) {
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

        if (profileId) {
          query = query.eq('profile_id', profileId)
        }

        const { data, error } = await query

        if (!error && data && data.length > 0) {
          data.forEach(dbItem => {
            if (!mergedList.some(m => m.id === dbItem.id || m.session_id === dbItem.session_id)) {
              mergedList.push(dbItem)
            }
          })
        }
      } catch (e) {
        console.warn('Supabase fetch fallback to local storage:', e)
      }
    }

    mergedList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    if (profileId) {
      mergedList = mergedList.filter(s => s.profile_id === profileId)
    }

    return mergedList.slice(0, limit)
  }

  /**
   * Compare latest session with previous session of the SAME user
   */
  async getSameUserComparison(currentSession, profileId) {
    const userSessions = await this.getSessions(profileId, 10)
    const previous = userSessions.find(
      s => s.id !== currentSession?.id && s.session_id !== currentSession?.session_id
    ) || null

    return compareSameUserReports(currentSession, previous)
  }

  /**
   * Safely wipe stored session data
   */
  async clearAllHistory() {
    this.writeLocalStorage([])
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
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
}

export const sessionHistoryService = new SessionHistoryService()
