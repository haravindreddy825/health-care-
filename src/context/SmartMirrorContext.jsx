import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { sensorManager } from '../services/sensors/SensorManager'
import { cameraManager } from '../services/vision/CameraManager'
import { faceRecognitionService } from '../services/vision/FaceRecognitionService'
import { analyzeHealthTelemetry } from '../services/analysis/HealthAnalysisEngine'
import { sessionHistoryService } from '../services/history/SessionHistoryService'
import { weatherService } from '../services/weather/WeatherService'
import { voiceControlService } from '../services/voice/VoiceControlService'

const SmartMirrorContext = createContext(null)

export function SmartMirrorProvider({ children }) {
  // Navigation: 'mirror' | 'dashboard' | 'sensors' | 'analysis' | 'history' | 'recommendations' | 'profiles' | 'settings'
  const [activeTab, setActiveTab] = useState('mirror')

  // User Profile State
  const [profiles, setProfiles] = useState(() => faceRecognitionService.getAllProfiles())
  const [activeProfile, setActiveProfile] = useState(() => profiles[0] || { id: 'usr_default_01', name: 'Alex Rivera' })

  // Sensors & Hardware State
  const [sensorsState, setSensorsState] = useState(sensorManager.sensors)
  const [isDemoMode, setIsDemoMode] = useState(sensorManager.isDemoMode)
  const [activeProviderName, setActiveProviderName] = useState('None')

  // Camera & Vision Detection State
  const [cameraState, setCameraState] = useState({
    isStreaming: false,
    permissionState: 'prompt',
    error: null
  })

  const [visionState, setVisionState] = useState({
    faceDetected: false,
    box: null,
    estimatedDistance: null,
    posture: 'Good',
    fatigue: 'Low',
    earValue: 0.32,
    tiltAngle: 0,
    recognizedUser: null
  })

  // Mirror Workflow State Machine: 'IDLE' | 'PERSON_DETECTED' | 'COUNTDOWN' | 'OBSERVING' | 'PREPARING' | 'REPORT_READY'
  const [mirrorState, setMirrorState] = useState('IDLE')
  const [gettingReadyCountdown, setGettingReadyCountdown] = useState(3)
  const [observationDuration, setObservationDuration] = useState(10) // 10s Fast Check or 60s Full Scan
  const [countdownSeconds, setCountdownSeconds] = useState(10)

  // Report & History State
  const [latestReport, setLatestReport] = useState(null)
  const [latestComparison, setLatestComparison] = useState(null)
  const [historyList, setHistoryList] = useState([])
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)

  // Weather & Environment State
  const [weather, setWeather] = useState(weatherService.weatherData)

  // Voice State
  const [voiceStatus, setVoiceStatus] = useState('Voice control idle')
  const [isVoiceListening, setIsVoiceListening] = useState(false)

  // Toast notifications
  const [toast, setToast] = useState(null)

  // Timer references
  const countdownTimerRef = useRef(null)
  const observationStartRef = useRef(null)
  const isMountedRef = useRef(true)

  const showToast = useCallback((msg, duration = 3500) => {
    setToast(msg)
    setTimeout(() => setToast(null), duration)
  }, [])

  // --- 1. Subscriptions on Mount ---

  useEffect(() => {
    isMountedRef.current = true

    // Subscribe to Sensors
    const unsubSensors = sensorManager.subscribe((data) => {
      if (!isMountedRef.current) return
      setSensorsState({ ...data.sensors })
      setIsDemoMode(data.isDemoMode)
      setActiveProviderName(data.activeProviderName)
    })

    // Subscribe to Camera
    const unsubCamera = cameraManager.subscribe((data) => {
      if (!isMountedRef.current) return
      setCameraState(data)
    })

    // Subscribe to Vision
    const unsubVision = faceRecognitionService.subscribe((data) => {
      if (!isMountedRef.current) return
      setVisionState(data)

      // Forward optical posture/fatigue to sensor manager
      sensorManager.updateOpticalMetrics({
        posture: data.posture,
        fatigue: data.fatigue,
        distance: data.estimatedDistance
      })

      // If recognized returning user with high confidence, auto-sync profile
      if (data.recognizedUser && data.recognizedUser.id !== activeProfile?.id && !data.recognizedUser.isNew) {
        const found = profiles.find(p => p.id === data.recognizedUser.id)
        if (found) setActiveProfile(found)
      }
    })

    // Fetch Weather
    weatherService.fetchLiveWeather().then(w => {
      if (isMountedRef.current) setWeather(w)
    })

    // Subscribe to Voice
    voiceControlService.onStatus((status) => {
      if (isMountedRef.current) setVoiceStatus(status)
    })

    voiceControlService.onCommand((cmd, payload) => {
      if (!isMountedRef.current) return
      if (cmd === 'NAVIGATE') {
        setActiveTab(payload)
      } else if (cmd === 'START_ANALYSIS') {
        startObservationWorkflow()
      } else if (cmd === 'TOGGLE_DEMO') {
        setDemoMode(payload)
      } else if (cmd === 'READ_REPORT') {
        speakReport()
      }
    })

    return () => {
      isMountedRef.current = false
      unsubSensors()
      unsubCamera()
      unsubVision()
    }
  }, [activeProfile, profiles])

  // --- 2. Load User History ---

  const loadUserHistory = useCallback(async (profileId = activeProfile?.id) => {
    setIsHistoryLoading(true)
    try {
      const records = await sessionHistoryService.getSessions(profileId, 30)
      if (isMountedRef.current) {
        setHistoryList(records || [])
      }
      return records
    } catch (e) {
      console.warn('History load notice:', e)
      return []
    } finally {
      if (isMountedRef.current) setIsHistoryLoading(false)
    }
  }, [activeProfile])

  useEffect(() => {
    loadUserHistory()
  }, [activeProfile, loadUserHistory])

  // --- 3. Face Presence Mirror Workflow Automation ---

  useEffect(() => {
    if (mirrorState === 'IDLE' && visionState.faceDetected) {
      setMirrorState('PERSON_DETECTED')
    } else if (mirrorState === 'PERSON_DETECTED' && !visionState.faceDetected) {
      // Return to IDLE after a short pause if person leaves
      const t = setTimeout(() => {
        if (mirrorState === 'PERSON_DETECTED' && !visionState.faceDetected) {
          setMirrorState('IDLE')
        }
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [mirrorState, visionState.faceDetected])

  // --- 4. Start Wellness Check Workflow ---

  const startObservationWorkflow = useCallback((duration = observationDuration) => {
    setActiveTab('mirror')
    setMirrorState('COUNTDOWN')
    setGettingReadyCountdown(3)

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)

    let count = 3
    countdownTimerRef.current = setInterval(() => {
      count -= 1
      if (!isMountedRef.current) return
      setGettingReadyCountdown(count)

      if (count <= 0) {
        clearInterval(countdownTimerRef.current)
        triggerObservationScan(duration)
      }
    }, 750)
  }, [observationDuration])

  const triggerObservationScan = (dur) => {
    setMirrorState('OBSERVING')
    setCountdownSeconds(dur)
    observationStartRef.current = Date.now()
    sensorManager.clearBuffer()

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)

    countdownTimerRef.current = setInterval(() => {
      if (!isMountedRef.current) return
      const elapsed = Math.floor((Date.now() - observationStartRef.current) / 1000)
      const remaining = Math.max(0, dur - elapsed)
      setCountdownSeconds(remaining)

      if (remaining <= 0) {
        clearInterval(countdownTimerRef.current)
        setMirrorState('PREPARING')
      }
    }, 250)
  }

  // --- 5. Finalize and Save Health Report ---

  const finalizeObservation = useCallback(async () => {
    const stabilized = sensorManager.getStabilizedSessionReading()

    // Deterministic Rule Engine Analysis
    const analysis = analyzeHealthTelemetry({
      heartRate: stabilized.heartRate,
      spo2: stabilized.spo2,
      temperature: stabilized.temperature,
      distance: stabilized.distance,
      posture: stabilized.posture,
      fatigue: stabilized.fatigue,
      faceDetected: true,
      isDemo: stabilized.isDemo
    })

    setLatestReport(analysis)

    const sid = `SMR-${Date.now().toString(36).toUpperCase()}`

    // Compute same-user comparison with previous session of this exact user
    const previousSession = historyList[0] || null
    const comparison = sessionHistoryService.getSameUserComparison(
      { id: sid, session_id: sid, reading: stabilized, health_analysis: [{ wellness_score: analysis.wellnessScore }] },
      activeProfile.id
    ).then(comp => {
      if (isMountedRef.current) setLatestComparison(comp)
    })

    // Save to Dual-Persistence (Supabase + localStorage)
    try {
      await sessionHistoryService.saveSession({
        sessionId: sid,
        profileId: activeProfile.id,
        profileName: activeProfile.name,
        reading: stabilized,
        analysis,
        observationDuration: `${observationDuration}s Check`
      })
      await loadUserHistory(activeProfile.id)
    } catch (e) {
      console.warn('Session save notice:', e)
    }

    setMirrorState('REPORT_READY')
    showToast('Wellness report generated and saved successfully.')
  }, [activeProfile, historyList, loadUserHistory, observationDuration, showToast])

  const cancelObservationWorkflow = () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current)
    setMirrorState('IDLE')
    setCountdownSeconds(observationDuration)
  }

  const returnToMirror = () => {
    setMirrorState('IDLE')
    setCountdownSeconds(observationDuration)
  }

  // --- 6. Profile Management ---

  const switchProfile = (profileId) => {
    const found = profiles.find(p => p.id === profileId)
    if (found) {
      setActiveProfile(found)
      loadUserHistory(found.id)
      showToast(`Switched active profile to ${found.name}`)
    }
  }

  const createNewProfile = (name) => {
    const newP = faceRecognitionService.createNewProfile(name)
    const updated = faceRecognitionService.getAllProfiles()
    setProfiles(updated)
    const created = updated.find(p => p.id === newP.id)
    if (created) {
      setActiveProfile(created)
      loadUserHistory(created.id)
      showToast(`Created new profile: ${created.name}`)
    }
  }

  const deleteProfile = (profileId) => {
    const updated = faceRecognitionService.deleteProfile(profileId)
    setProfiles(updated)
    if (activeProfile.id === profileId) {
      setActiveProfile(updated[0])
      loadUserHistory(updated[0].id)
    }
    showToast('Profile deleted')
  }

  // --- 7. Voice & Demo Helpers ---

  const toggleVoiceListening = () => {
    if (isVoiceListening) {
      voiceControlService.stopListening()
      setIsVoiceListening(false)
      showToast('Voice control paused')
    } else {
      const ok = voiceControlService.startListening()
      setIsVoiceListening(ok)
      if (ok) showToast('Listening for voice commands: "Start analysis", "Show dashboard", "Show history"')
    }
  }

  const speakReport = () => {
    if (!latestReport) {
      voiceControlService.speak('No current wellness report available. Say "start analysis" to begin a check.')
      return
    }
    const txt = `Your wellness score is ${latestReport.wellnessScore} out of 100. Status is ${latestReport.healthStatus}. Priority action: ${latestReport.priorityAction}`
    voiceControlService.speak(txt)
  }

  const setDemoMode = (enabled) => {
    sensorManager.setDemoMode(enabled)
    setIsDemoMode(enabled)
    showToast(enabled ? 'DEMO MODE ACTIVATED: Simulated sensor data active' : 'DEMO MODE DEACTIVATED: Waiting for real hardware')
  }

  const applyDemoPreset = (presetId) => {
    sensorManager.applyDemoPreset(presetId)
    showToast(`Applied preset: ${presetId}`)
  }

  const clearAllData = async () => {
    await sessionHistoryService.clearAllHistory()
    setHistoryList([])
    setLatestReport(null)
    setLatestComparison(null)
    showToast('All stored history has been cleared')
  }

  return (
    <SmartMirrorContext.Provider
      value={{
        // Navigation
        activeTab,
        setActiveTab,

        // Profiles
        profiles,
        activeProfile,
        switchProfile,
        createNewProfile,
        deleteProfile,

        // Sensors & Hardware
        sensorsState,
        isDemoMode,
        setDemoMode,
        applyDemoPreset,
        activeProviderName,

        // Camera & Vision
        cameraState,
        visionState,

        // Mirror Workflow State Machine
        mirrorState,
        setMirrorState,
        gettingReadyCountdown,
        observationDuration,
        setObservationDuration,
        countdownSeconds,
        startObservationWorkflow,
        triggerObservationScan,
        cancelObservationWorkflow,
        finalizeObservation,
        returnToMirror,

        // Reports & History
        latestReport,
        latestComparison,
        historyList,
        isHistoryLoading,
        loadUserHistory,
        clearAllData,

        // Weather & Voice
        weather,
        voiceStatus,
        isVoiceListening,
        toggleVoiceListening,
        speakReport,

        // Toast
        toast,
        showToast
      }}
    >
      {children}
    </SmartMirrorContext.Provider>
  )
}

export function useSmartMirror() {
  const ctx = useContext(SmartMirrorContext)
  if (!ctx) throw new Error('useSmartMirror must be used within a SmartMirrorProvider')
  return ctx
}
