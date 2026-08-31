import React, { useState, useEffect } from 'react'
import {
  Camera,
  CameraOff,
  UserCheck,
  Clock,
  FastForward,
  Heart,
  Thermometer,
  User,
  Moon,
  Shield,
  Activity,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Play,
  Cpu,
  Radio,
  Eye
} from 'lucide-react'

export function SmartMirrorFrame({
  videoRef,
  mirrorState, // 'IDLE' | 'PERSON_DETECTED' | 'COUNTDOWN' | 'OBSERVING'
  isReturningUser = false,
  gettingReadyCountdown = 3,
  countdownSeconds = 10,
  totalObservationSeconds = 10,
  isCameraActive = true,
  cameraError = null,
  onStartCamera,
  onStartWellnessCheck,
  onSkipCountdown,
  livePosture = 'Good',
  liveFatigue = 'Low',
  liveHeartRate = 78,
  liveTemperature = 36.7
}) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Dynamic gradient glow based on session state
  const getFrameGlow = () => {
    switch (mirrorState) {
      case 'PERSON_DETECTED':
        return 'border-emerald-500/60 shadow-emerald-500/25 ring-2 ring-emerald-500/20'
      case 'COUNTDOWN':
        return 'border-cyan-400/80 shadow-cyan-500/30 ring-2 ring-cyan-400/30'
      case 'OBSERVING':
        return 'border-cyan-400/80 shadow-cyan-500/35 ring-2 ring-cyan-400/30'
      default:
        return 'border-white/10 shadow-cyan-950/40 ring-1 ring-white/5'
    }
  }

  const observationProgress = totalObservationSeconds > 0
    ? Math.min(100, Math.round(((totalObservationSeconds - countdownSeconds) / totalObservationSeconds) * 100))
    : 0

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 animate-fadeIn no-print">
      {/* 1. HERO CAMERA MIRROR VIEWPORT (UNOBSTRUCTED FOR CLEAR USER FACE VIEW) */}
      <div className={`relative w-full rounded-[36px] bg-slate-900/80 backdrop-blur-2xl border transition-all duration-500 shadow-2xl p-4 sm:p-6 flex flex-col items-center justify-between ${getFrameGlow()}`}>
        
        {/* Top Mirror Header Bar */}
        <div className="w-full flex items-center justify-between z-20 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                mirrorState === 'OBSERVING' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                mirrorState === 'OBSERVING' ? 'bg-emerald-500' : 'bg-cyan-500'
              }`} />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              {mirrorState === 'IDLE'
                ? 'LIVE SMART MIRROR'
                : mirrorState === 'PERSON_DETECTED'
                ? (isReturningUser ? 'WELCOME BACK' : 'PERSON DETECTED')
                : mirrorState === 'COUNTDOWN'
                ? 'GETTING READY'
                : 'OBSERVATION IN PROGRESS'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-slate-300 font-mono text-xs shadow-inner">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* The Camera Reflection Frame (100% CLEAR - NO CENTER OBSTRUCTIONS DURING OBSERVATION) */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[480px] my-3 rounded-[28px] overflow-hidden bg-slate-950 shadow-inner flex items-center justify-center border border-white/10 group">
          {/* Live Video Feed (Clean, Natural, Unaltered, User Sees Face Clearly) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-700 ${
              isCameraActive && !cameraError ? 'opacity-95' : 'opacity-20'
            }`}
          />

          {/* Subtle Mirror Glass Reflection Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-white/5 pointer-events-none" />

          {/* A. IDLE OVERLAY */}
          {mirrorState === 'IDLE' && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl animate-pulse">
                <UserCheck className="w-8 h-8 text-cyan-300" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                  Step into the mirror
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-sm drop-shadow">
                  Position yourself in front of the camera to activate your wellness check.
                </p>
              </div>

              {!isCameraActive && (
                <button
                  onClick={onStartCamera}
                  className="mt-2 px-5 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs shadow-xl hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-cyan-600" />
                  <span>Turn On Camera</span>
                </button>
              )}
            </div>
          )}

          {/* B. PERSON DETECTED & MANUAL START BUTTON */}
          {mirrorState === 'PERSON_DETECTED' && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[3px] flex flex-col items-center justify-center text-center p-6 text-white space-y-4 animate-fadeIn">
              <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isReturningUser ? 'WELCOME BACK' : 'PERSON DETECTED'}</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Ready for your wellness check
                </h3>
                <p className="text-xs text-slate-300 max-w-sm">
                  {isReturningUser
                    ? 'Previous wellness history available. Press start when you are settled.'
                    : 'Press the button below to start your physiological observation.'}
                </p>
              </div>

              {/* PRIMARY ACTION: START WELLNESS CHECK */}
              <button
                onClick={onStartWellnessCheck}
                className="mt-2 px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-cyan-500/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START WELLNESS CHECK</span>
              </button>
            </div>
          )}

          {/* C. COUNTDOWN (3-2-1) SUBTLE OVERLAY (NON-OBSTRUCTING) */}
          {mirrorState === 'COUNTDOWN' && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 pointer-events-none">
              <div className="flex justify-center">
                <span className="px-4 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-cyan-300 font-mono text-xs font-bold border border-cyan-400/40 animate-pulse">
                  GETTING READY: LOOK INTO MIRROR
                </span>
              </div>

              {/* Center Subtle Pill (Leaves face visible) */}
              <div className="self-center flex items-center gap-3 px-6 py-2 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-cyan-400/50 shadow-2xl">
                <span className="text-xs font-mono uppercase text-slate-300 font-bold">Starting In</span>
                <span className="text-3xl font-extrabold font-mono text-cyan-300 animate-ping">
                  {gettingReadyCountdown}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[11px] font-mono text-slate-300 bg-slate-900/70 px-3.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Calibrating optical and vital sensors...
                </span>
              </div>
            </div>
          )}

          {/* D. OBSERVING: UNOBSTRUCTED CAMERA VIEW WITH MINIMAL CORNER CONTROLS */}
          {mirrorState === 'OBSERVING' && (
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
              {/* Top Row: Live Observation Status & Fast-Forward */}
              <div className="flex items-center justify-between">
                <div className="px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>OBSERVING WELLNESS • FACE CLEAR</span>
                </div>

                <button
                  onClick={onSkipCountdown}
                  className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 text-xs font-mono font-bold border border-cyan-400/50 flex items-center gap-1.5 transition-all shadow-xl cursor-pointer"
                  title="Complete observation and generate report immediately"
                >
                  <FastForward className="w-4 h-4 text-cyan-400" />
                  <span>Complete Now</span>
                </button>
              </div>

              {/* Bottom Subtle Overlay Note (Center remains 100% open for face viewing) */}
              <div className="flex justify-between items-end text-xs text-slate-300">
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 font-mono text-[10px] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>OpenCV / MediaPipe Active</span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 font-mono text-[10px] flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>MAX30102 & Thermal Sampling</span>
                </div>
              </div>
            </div>
          )}

          {/* E. CLEAN DARK GLASS CAMERA ERROR OVERLAY */}
          {cameraError && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-3 animate-fadeIn">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
                <CameraOff className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h3 className="text-base font-bold text-white">Camera Access Required</h3>
                <p className="text-xs text-slate-300 font-medium">
                  {cameraError}
                </p>
              </div>
              <button
                onClick={onStartCamera}
                className="mt-2 px-5 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-cyan-600" />
                <span>Retry Camera</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. DEDICATED OBSERVATION TIMER BAR (BELOW THE CAMERA FEED AS REQUESTED) */}
        {mirrorState === 'OBSERVING' ? (
          <div className="w-full mt-2 p-3.5 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono font-bold text-xs">
                {formatTime(countdownSeconds)}
              </div>
              <div>
                <span className="text-xs font-bold text-white font-sans block">
                  Observation Time Remaining: <span className="font-mono text-cyan-300">{countdownSeconds}s</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Please look comfortably into the mirror. Your facial reflection is unobstructed.
                </span>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full sm:w-48 space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Progress</span>
                <span>{observationProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
                  style={{ width: `${observationProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Normal Bottom Mirror Status Bar */
          <div className="w-full flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-300">
                {mirrorState === 'IDLE'
                  ? '● READY • Waiting for you...'
                  : mirrorState === 'PERSON_DETECTED'
                  ? '● PERSON DETECTED • Ready to start'
                  : mirrorState === 'COUNTDOWN'
                  ? '● GETTING READY • Calibrating'
                  : '● ACTIVE MONITORING'}
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-400 font-medium hidden sm:inline">
              MAX30102 • Temp Sensor • Optical Camera Stream
            </span>
          </div>
        )}
      </div>

      {/* 3. FOUR DARK GLASS HEALTH INDICATOR CARDS (WITH HARDWARE SENSOR ANNOTATIONS) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Heart Rate (MAX30102 Sensor) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg hover:border-rose-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-inner">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {liveHeartRate >= 60 && liveHeartRate <= 100 ? 'NORMAL' : 'ATTENTION'}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Heart Rate
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">MAX30102</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {liveHeartRate}
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">BPM</span>
            </div>
          </div>
        </div>

        {/* Card 2: Temperature (Temperature Sensor) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg hover:border-cyan-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-inner">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {liveTemperature <= 37.5 ? 'NORMAL' : 'ELEVATED'}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Temperature
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Thermal Sensor</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {Number(liveTemperature).toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-400 font-semibold">°C</span>
            </div>
          </div>
        </div>

        {/* Card 3: Posture (MediaPipe / OpenCV Analysis) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {livePosture === 'Good' ? 'OPTIMAL' : 'NEEDS CHECK'}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Posture Alignment
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">MediaPipe / CV</span>
            </div>
            <div className="mt-0.5">
              <span className="text-xl sm:text-2xl font-extrabold font-sans text-white">
                {livePosture}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Fatigue (Vision & Rule-Based Model) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg hover:border-violet-500/40 transition-all space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-400 shadow-inner">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              {liveFatigue === 'Low' ? 'GOOD' : 'HIGH'}
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Fatigue Level
              </span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Optical & Rule AI</span>
            </div>
            <div className="mt-0.5">
              <span className="text-xl sm:text-2xl font-extrabold font-sans text-white">
                {liveFatigue}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
