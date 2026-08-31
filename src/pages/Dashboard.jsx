import React, { useState, useEffect, useRef, useCallback } from 'react'
import { SmartMirrorNavbar } from '../components/SmartMirrorNavbar'
import { SmartMirrorHUD } from '../components/SmartMirrorHUD'
import { PreparingReportScreen } from '../components/PreparingReportScreen'
import { HealthReportViewer } from '../components/HealthReportViewer'
import { HealthDashboardView } from '../components/HealthDashboardView'
import { SessionHistoryView } from '../components/SessionHistoryView'
import { AIInsightsView } from '../components/AIInsightsView'
import { PrivacyView } from '../components/PrivacyView'
import { SensorSimulatorDrawer } from '../components/SensorSimulatorDrawer'

import { analyzeHealth } from '../services/healthAnalysis'
import { healthSensors } from '../services/healthSensors'
import {
  saveWellnessSession,
  getStoredSessions,
  calculateSessionTrend
} from '../services/sessionStore'
import { compareWellnessReports } from '../services/reportComparison'
import { visionService } from '../services/visionDetection'
import { localFaceMatcher } from '../services/localFaceMatcher'
import { Sparkles, ShieldCheck } from 'lucide-react'

export function Dashboard() {
  // Navigation Tabs: 'mirror' | 'dashboard' | 'history' | 'insights' | 'privacy'
  const [activeTab, setActiveTab] = useState('mirror')

  // Mirror State Machine: 'IDLE' | 'PERSON_DETECTED' | 'COUNTDOWN' | 'OBSERVING' | 'PREPARING' | 'REPORT_READY'
  const [mirrorState, setMirrorState] = useState('IDLE')
  const [gettingReadyCountdown, setGettingReadyCountdown] = useState(3)

  // Hardware Telemetry & Observation Settings
  const [observationDuration, setObservationDuration] = useState(10) // 10s Fast Check
  const [countdownSeconds, setCountdownSeconds] = useState(10)
  const [demoHeartRate, setDemoHeartRate] = useState(78)
  const [demoTemperature, setDemoTemperature] = useState(36.7)
  const [demoPosture, setDemoPosture] = useState('Good')
  const [demoFatigue, setDemoFatigue] = useState('Low')

  // Live Optical & Vision
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [livePosture, setLivePosture] = useState('Good')
  const [liveFatigue, setLiveFatigue] = useState('Low')

  // Current Session & Persistence State
  const [currentProfile, setCurrentProfile] = useState(() => localFaceMatcher.getProfileId())
  const [isReturningUser, setIsReturningUser] = useState(false)
  const [sessionId, setSessionId] = useState(() => `SMR-${Date.now().toString(36).toUpperCase()}`)
  const [reportData, setReportData] = useState(null)
  const [latestReading, setLatestReading] = useState(null)
  const [latestAnalysis, setLatestAnalysis] = useState(null)
  const [historyList, setHistoryList] = useState([])
  const [trendData, setTrendData] = useState(null)
  const [toast, setToast] = useState(null)

  // Refs for bulletproof execution
  const videoRef = useRef(null)
  const isMounted = useRef(true)
  const durationRef = useRef(observationDuration)
  durationRef.current = observationDuration

  const stateRef = useRef(mirrorState)
  stateRef.current = mirrorState

  const observationStartTime = useRef(null)
  const countdownInterval = useRef(null)
  const samplingInterval = useRef(null)

  // Synchronize health sensor bases
  useEffect(() => {
    healthSensors.setTelemetryBases({
      heartRate: demoHeartRate,
      temperature: demoTemperature,
      posture: demoPosture,
      fatigue: demoFatigue
    })
  }, [demoHeartRate, demoTemperature, demoPosture, demoFatigue])

  // Load Session History from Supabase & Local Cache
  const loadHistory = useCallback(async () => {
    try {
      const records = await getStoredSessions(25)
      if (isMounted.current) {
        setHistoryList(records || [])
        setIsReturningUser(records && records.length > 0)
        if (records && records.length > 0) {
          const latest = records[0]
          setLatestReading({
            heart_rate: latest.heart_rate,
            temperature: latest.temperature,
            posture_status: latest.posture_status,
            fatigue_level: latest.fatigue_level,
            created_at: latest.created_at
          })
          const a = Array.isArray(latest.health_analysis) ? latest.health_analysis[0] : latest.health_analysis
          if (a) setLatestAnalysis(a)
        }
      }
      return records
    } catch (e) {
      return []
    }
  }, [])

  // Camera Initialization & Re-attachment Guard
  useEffect(() => {
    isMounted.current = true

    const initCam = async () => {
      if (!videoRef.current) return
      
      // If stream already exists on service, reattach immediately
      if (visionService.stream) {
        if (videoRef.current.srcObject !== visionService.stream) {
          videoRef.current.srcObject = visionService.stream
        }
        try {
          await videoRef.current.play()
        } catch (e) {}
        setIsCameraActive(true)
        return
      }

      setCameraError(null)
      const res = await visionService.startCamera(videoRef.current)
      if (!isMounted.current) return

      if (!res.success) {
        setCameraError(res.error)
        setIsCameraActive(false)
        return
      }

      setIsCameraActive(true)
      visionService.startDetectionLoop(({ faceDetected: isFace }) => {
        if (!isMounted.current) return
        setFaceDetected(isFace)
      })
    }

    const t = setTimeout(initCam, 150)
    loadHistory()

    return () => {
      isMounted.current = false
      clearTimeout(t)
    }
  }, [activeTab, mirrorState, loadHistory])

  const handleRetryCamera = async () => {
    if (!videoRef.current) return
    setCameraError(null)
    const res = await visionService.startCamera(videoRef.current)
    if (!res.success) {
      setCameraError(res.error)
      setIsCameraActive(false)
      return
    }
    setIsCameraActive(true)
    visionService.startDetectionLoop(({ faceDetected: isFace }) => {
      if (!isMounted.current) return
      setFaceDetected(isFace)
    })
  }

  // Face Detected in Idle State (DOES NOT AUTO-START OBSERVATION)
  useEffect(() => {
    if (mirrorState === 'IDLE' && faceDetected) {
      setMirrorState('PERSON_DETECTED')
    }
  }, [mirrorState, faceDetected])

  // 1. START HEALTH CHECK FLOW (MANUAL TRIGGER ONLY)
  const handleStartHealthCheck = useCallback(() => {
    setActiveTab('mirror')
    setMirrorState('COUNTDOWN')
    setGettingReadyCountdown(3)

    if (countdownInterval.current) clearInterval(countdownInterval.current)

    let count = 3
    countdownInterval.current = setInterval(() => {
      count -= 1
      if (!isMounted.current) return
      setGettingReadyCountdown(count)

      if (count <= 0) {
        clearInterval(countdownInterval.current)
        triggerObservation()
      }
    }, 700)
  }, [])

  // 2. TRIGGER OBSERVATION SCANNING
  const triggerObservation = useCallback(() => {
    setMirrorState('OBSERVING')
    const dur = durationRef.current
    setCountdownSeconds(dur)
    observationStartTime.current = Date.now()
    healthSensors.clearBuffer()

    if (samplingInterval.current) clearInterval(samplingInterval.current)
    if (countdownInterval.current) clearInterval(countdownInterval.current)

    // Sampling loop
    samplingInterval.current = setInterval(() => {
      if (!isMounted.current) return
      const sample = healthSensors.getInstantaneousSample()
      setLivePosture(sample.posture)
      setLiveFatigue(sample.fatigue)
    }, 400)

    // Countdown loop
    countdownInterval.current = setInterval(() => {
      if (!isMounted.current) return
      const elapsed = Math.floor((Date.now() - observationStartTime.current) / 1000)
      const remaining = Math.max(0, dur - elapsed)
      setCountdownSeconds(remaining)

      if (remaining <= 0) {
        clearInterval(countdownInterval.current)
        clearInterval(samplingInterval.current)
        setMirrorState('PREPARING')
      }
    }, 250)
  }, [])

  // 3. FINALIZE REPORT & SUPABASE PERSISTENCE (Pure Local Deterministic Engine)
  const finalizeAndShowReport = useCallback(async () => {
    const stabilized = healthSensors.getStabilizedSessionReading()

    // 1. Local deterministic Rule Engine evaluation (AUTHORITATIVE TRUTH - ZERO EXTERNAL AI)
    const analysisResult = analyzeHealth({
      heartRate: stabilized.heartRate,
      temperature: stabilized.temperature,
      faceDetected: true,
      posture: stabilized.posture,
      fatigue: stabilized.fatigue
    })

    setReportData(analysisResult)

    const newSid = `SMR-${Date.now().toString(36).toUpperCase()}`
    setSessionId(newSid)

    const readingPayload = {
      heartRate: stabilized.heartRate,
      temperature: stabilized.temperature,
      posture: stabilized.posture,
      fatigue: stabilized.fatigue
    }

    setLatestReading(readingPayload)
    setLatestAnalysis({
      wellness_score: analysisResult.wellnessScore,
      health_status: analysisResult.healthStatus,
      risk_level: analysisResult.riskLevel,
      analysis: analysisResult.overallInterpretation || analysisResult.summary,
      immediate_action: analysisResult.priorityAction
    })

    // Show Report View (WAITS INDEFINITELY FOR USER — NO AUTO-RETURN!)
    setMirrorState('REPORT_READY')

    // Initial Trend with history
    const trend = calculateSessionTrend(
      { id: newSid, session_id: newSid, reading: readingPayload, analysis: analysisResult },
      historyList
    )
    setTrendData(trend)

    // 2. Save to Dual-Layer Persistence (Supabase + Local Cache)
    try {
      await saveWellnessSession({
        sessionId: newSid,
        reading: readingPayload,
        analysis: analysisResult,
        recommendations: analysisResult.recommendations,
        profileId: currentProfile,
        observationDuration: durationRef.current === 10 ? '10s Fast Check' : '60s Full Scan'
      })

      const updatedHistory = await loadHistory()
      const updatedTrend = calculateSessionTrend(
        { id: newSid, session_id: newSid, reading: readingPayload, analysis: analysisResult },
        updatedHistory
      )
      setTrendData(updatedTrend)
    } catch (err) {
      console.warn('Persistence notice:', err)
    }
  }, [currentProfile, historyList, loadHistory])

  // FAST FORWARD OBSERVATION
  const handleSkipObservation = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current)
    if (samplingInterval.current) clearInterval(samplingInterval.current)
    setMirrorState('PREPARING')
  }

  // QUICK SIMULATE TEST NOW (<2s)
  const handleRunTestNow = () => {
    setActiveTab('mirror')
    setMirrorState('OBSERVING')
    setCountdownSeconds(2)
    healthSensors.clearBuffer()
    for (let i = 0; i < 8; i++) {
      healthSensors.getInstantaneousSample()
    }
    setTimeout(() => {
      setMirrorState('PREPARING')
    }, 900)
  }

  // RETURN TO SMART MIRROR (MANUAL ACTION ONLY)
  const handleReturnToMirror = () => {
    setMirrorState('IDLE')
    setReportData(null)
    setCountdownSeconds(durationRef.current)
  }

  // START NEW CHECK FROM REPORT
  const handleStartNewCheckFromReport = () => {
    setReportData(null)
    handleStartHealthCheck()
  }

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="min-h-screen text-slate-100 font-sans pb-16 flex flex-col justify-between selection:bg-cyan-400 selection:text-slate-950">
      
      {/* 1. Global Navigation Bar */}
      <SmartMirrorNavbar
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        onStartHealthCheck={handleStartHealthCheck}
        isObserving={mirrorState === 'OBSERVING' || mirrorState === 'COUNTDOWN'}
      />

      {/* Main Content Area */}
      <main className="w-full flex-1 pt-4 sm:pt-6">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-5 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all animate-fadeIn bg-slate-900/95 border-cyan-500/50 text-cyan-300">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toast}</span>
          </div>
        )}

        {/* TAB 1: SMART MIRROR (HERO HUD + REPORT) */}
        {activeTab === 'mirror' && (
          <div className="space-y-6">
            
            {/* Login-Free User Continuity Banner */}
            {mirrorState === 'IDLE' && (
              <div className="w-full max-w-5xl mx-auto p-3.5 rounded-2xl glass-panel border-white/10 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">
                    {isReturningUser ? 'WELCOME BACK' : 'WELCOME'}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300">
                    {isReturningUser
                      ? 'Your previous wellness reports are available.'
                      : "Welcome to your Smart Mirror wellness check."}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 hidden sm:inline-block">
                  Login-Free Anonymous Device Continuity
                </span>
              </div>
            )}

            {mirrorState === 'PREPARING' ? (
              <PreparingReportScreen onComplete={finalizeAndShowReport} />
            ) : mirrorState !== 'REPORT_READY' ? (
              <SmartMirrorHUD
                videoRef={videoRef}
                mirrorState={mirrorState}
                gettingReadyCountdown={gettingReadyCountdown}
                countdownSeconds={countdownSeconds}
                totalObservationSeconds={observationDuration}
                isCameraActive={isCameraActive}
                cameraError={cameraError}
                onStartCamera={handleRetryCamera}
                onStartCheck={handleStartHealthCheck}
                onSkipObservation={handleSkipObservation}
                liveHeartRate={demoHeartRate}
                liveTemperature={demoTemperature}
                livePosture={livePosture}
                liveFatigue={liveFatigue}
              />
            ) : (
              <HealthReportViewer
                reportData={reportData}
                trendData={trendData}
                historyList={historyList}
                onReturnToMirror={handleReturnToMirror}
                onStartNewCheck={handleStartNewCheckFromReport}
                profileId={currentProfile}
                sessionId={sessionId}
              />
            )}
          </div>
        )}

        {/* TAB 2: HEALTH DASHBOARD */}
        {activeTab === 'dashboard' && (
          <HealthDashboardView
            latestReading={latestReading}
            latestAnalysis={latestAnalysis}
            trendData={trendData}
            historyList={historyList}
            onStartCheck={handleStartHealthCheck}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* TAB 3: SESSION HISTORY */}
        {activeTab === 'history' && (
          <SessionHistoryView
            historyList={historyList}
            onRefresh={loadHistory}
            onStartHealthCheck={handleStartHealthCheck}
          />
        )}

        {/* TAB 4: WELLNESS INSIGHTS */}
        {activeTab === 'insights' && (
          <AIInsightsView
            historyList={historyList}
            trendData={trendData}
            latestReport={reportData || latestAnalysis}
          />
        )}

        {/* TAB 5: PRIVACY & SECURITY */}
        {activeTab === 'privacy' && (
          <PrivacyView
            onDataWiped={() => {
              loadHistory()
              showToast('All health data successfully wiped.')
            }}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <footer className="w-full max-w-5xl mx-auto px-4 pt-10 text-xs text-slate-500 space-y-3 no-print border-t border-white/10 mt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">
              Smart Mirror Personal Health Monitoring & Recommendations
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <button onClick={() => setActiveTab('privacy')} className="hover:text-cyan-300 cursor-pointer">
              Privacy Shield
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('history')} className="hover:text-cyan-300 cursor-pointer">
              Session History
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('mirror')} className="hover:text-cyan-300 text-cyan-400 font-bold cursor-pointer">
              Live Mirror
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 leading-relaxed text-center sm:text-left">
          * Educational Prototype Disclaimer: This Smart Mirror is an educational wellness-monitoring prototype. Its measurements and local rule-based insights are not medical diagnoses and should not replace professional medical advice.
        </p>
      </footer>

      {/* 4. Telemetry Testing & Scenario Drawer */}
      <SensorSimulatorDrawer
        heartRate={demoHeartRate}
        setHeartRate={setDemoHeartRate}
        temperature={demoTemperature}
        setTemperature={setDemoTemperature}
        posture={demoPosture}
        setPosture={setDemoPosture}
        fatigue={demoFatigue}
        setFatigue={setDemoFatigue}
        observationDuration={observationDuration}
        setObservationDuration={(d) => {
          setObservationDuration(d)
          setCountdownSeconds(d)
        }}
        onApplyScenario={(scId) => {
          showToast(`Applied preset scenario: ${scId}`)
        }}
        onRunTestNow={handleRunTestNow}
      />
    </div>
  )
}
