import React from 'react'
import {
  Camera,
  Heart,
  Thermometer,
  User,
  Moon,
  Play,
  Sparkles,
  ShieldCheck,
  RefreshCw
} from 'lucide-react'

export function SmartMirrorHUD({
  videoRef,
  mirrorState = 'IDLE', // 'IDLE' | 'PERSON_DETECTED' | 'COUNTDOWN' | 'OBSERVING' | 'PREPARING'
  gettingReadyCountdown = 3,
  countdownSeconds = 10,
  totalObservationSeconds = 10,
  isCameraActive = true,
  cameraError = null,
  onStartCamera,
  onStartCheck,
  onSkipObservation,
  liveHeartRate = 78,
  liveTemperature = 36.7,
  livePosture = 'Good',
  liveFatigue = 'Low'
}) {
  const observationProgress = Math.min(
    100,
    Math.max(0, Math.round(((totalObservationSeconds - countdownSeconds) / (totalObservationSeconds || 1)) * 100))
  )

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* 1. Main Mirror Frame & Video Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[540px] bg-[#050B18] rounded-[36px] overflow-hidden border-2 border-cyan-500/30 shadow-2xl flex items-center justify-center">
        
        {/* Layer 1: Live Webcam Video Element (Clearly Visible & Mirror Flipped) */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 z-10 opacity-100 block"
        />

        {/* Layer 2: Subtle Ambient Reflection Glare Overlay (DOES NOT COVER PERSON) */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(180deg, rgba(3,15,30,0.08) 0%, rgba(3,15,30,0.18) 100%)'
          }}
        />

        {/* Layer 3: HUD Status & Face Reticle (z-30) */}
        {isCameraActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-52 h-64 sm:w-60 sm:h-72 rounded-[36px] border border-cyan-400/40 relative">
              {/* Status Badge */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950/80 border border-cyan-400/50 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider backdrop-blur-md">
                {mirrorState === 'OBSERVING' ? '● MONITORING IN PROGRESS' : '● PERSON DETECTED'}
              </span>

              {/* Reticle Corner Guides */}
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
            </div>
          </div>
        )}

        {/* Top-Left Status Pill */}
        <div className="absolute top-4 left-4 z-30 flex items-center gap-2 font-mono text-[10px]">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/15 text-white font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE</span>
          </span>
        </div>

        {/* Top-Right Status Pill */}
        <div className="absolute top-4 right-4 z-30 font-mono text-[10px]">
          <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/15 text-slate-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>READY</span>
          </span>
        </div>

        {/* Countdown 3... 2... 1... Transition Overlay */}
        {mirrorState === 'COUNTDOWN' && (
          <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 animate-fadeIn">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300 mb-2">
              ALIGN FACE IN MIRROR
            </span>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center shadow-2xl shadow-cyan-500/40 animate-pulse">
              <span className="text-5xl sm:text-6xl font-extrabold font-mono text-white">
                {gettingReadyCountdown}
              </span>
            </div>
            <span className="text-xs text-slate-300 mt-3 font-mono">
              Starting wellness check...
            </span>
          </div>
        )}

        {/* Polished Camera Access Required Card */}
        {!isCameraActive && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase font-mono">
              Camera Access Required
            </h4>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Allow camera access in your browser to enable live optical reflection and posture/fatigue tracking.
            </p>
            <button
              onClick={onStartCamera}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Camera</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Observation Bar & Timer (BELOW CAMERA FEED) */}
      {mirrorState === 'OBSERVING' && (
        <div className="p-4 sm:p-5 rounded-[28px] glass-panel border-cyan-500/40 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-extrabold text-white uppercase tracking-wider">
                WELLNESS CHECK
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-cyan-300 font-bold">
                Time Remaining: {countdownSeconds}s ({observationProgress}%)
              </span>
              <button
                onClick={onSkipObservation}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-bold border border-white/10 transition-colors cursor-pointer"
              >
                Fast-Forward ⏩
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-white/10 p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${observationProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. Action Card: Person Detected & Start Wellness Check */}
      {(mirrorState === 'IDLE' || mirrorState === 'PERSON_DETECTED') && (
        <div className="p-5 sm:p-6 rounded-[28px] glass-panel border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                PERSON DETECTED
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Ready for your wellness check
            </h3>
            <p className="text-xs text-slate-400">
              Press the button below to start your physiological wellness check session.
            </p>
          </div>

          <button
            onClick={onStartCheck}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Wellness Check</span>
          </button>
        </div>
      )}

      {/* 4. Live Telemetry Matrix (4 Core Sensor Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Heart Rate Card */}
        <div className="p-4 rounded-3xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
              HEART RATE
            </span>
            <span className="text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 font-semibold">
              Demo Sensor
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{liveHeartRate}</span>
            <span className="text-xs font-mono text-slate-400 font-bold">BPM</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
            {liveHeartRate >= 60 && liveHeartRate <= 100 ? 'Normal' : liveHeartRate > 100 ? 'Elevated' : 'Low'}
          </span>
        </div>

        {/* Temperature Card */}
        <div className="p-4 rounded-3xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              TEMPERATURE
            </span>
            <span className="text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
              Demo Sensor
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">{Number(liveTemperature).toFixed(1)}</span>
            <span className="text-xs font-mono text-slate-400 font-bold">°C</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 block font-semibold">
            {liveTemperature < 37.5 ? 'Normal' : 'Elevated'}
          </span>
        </div>

        {/* Posture Card */}
        <div className="p-4 rounded-3xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              POSTURE
            </span>
            <span className="text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
              Optical
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-sans text-white">
            {livePosture}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">
            {livePosture === 'Good' ? 'Optimal' : livePosture === 'Needs Attention' ? 'Slouch' : 'Poor'}
          </span>
        </div>

        {/* Fatigue Card */}
        <div className="p-4 rounded-3xl glass-panel space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 font-bold flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-violet-400" />
              FATIGUE
            </span>
            <span className="text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20 font-semibold">
              Optical
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-sans text-white">
            {liveFatigue}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">
            {liveFatigue === 'Low' ? 'Good' : liveFatigue === 'Medium' ? 'Moderate' : 'High'}
          </span>
        </div>

      </div>
    </div>
  )
}
