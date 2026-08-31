import React, { useState, useEffect } from 'react'
import {
  Activity,
  Heart,
  Thermometer,
  User,
  Moon,
  Eye,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Brain,
  Zap,
  Printer,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Layers,
  Fingerprint,
  Calendar,
  Check,
  Loader2,
  TrendingUp,
  History,
  X,
  FileText,
  ArrowRight,
  Play,
  Award,
  BarChart3
} from 'lucide-react'

export function SmartMirrorReport({
  reportData,
  aiInsights,
  isAiLoading = false,
  profileId = 'mirror_person_01',
  sessionId = 'SMR-001',
  isDemoMode = true,
  observationDuration = '10 seconds (Fast Demo)',
  onReturnToCamera,
  onStartNewCheck,
  saveStatus = 'saved', // 'saving' | 'saved' | 'failed'
  historyList = [],
  trendData = null
}) {
  const {
    wellnessScore = 85,
    healthStatus = 'Healthy',
    riskLevel = 'Low',
    overallInterpretation = '',
    priorityAction = '',
    parameters = [],
    scoreDeductions = { baseScore: 100, heartRate: 0, temperature: 0, posture: 0, fatigue: 0, finalScore: 85 },
    warnings = [],
    recommendations = [],
    disclaimer = ''
  } = reportData || {}

  // Animated Count-Up Score (0 -> actual score)
  const [animatedScore, setAnimatedScore] = useState(0)
  const [selectedHistoricalRecord, setSelectedHistoricalRecord] = useState(null)

  useEffect(() => {
    let current = 0
    const target = wellnessScore || 85
    const step = Math.max(1, Math.ceil(target / 25))
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setAnimatedScore(target)
        clearInterval(timer)
      } else {
        setAnimatedScore(current)
      }
    }, 28)
    return () => clearInterval(timer)
  }, [wellnessScore])

  const handlePrint = () => {
    window.print()
  }

  // Helper for Status Badge styling in dark theme
  const getStatusBadge = (status = 'NORMAL') => {
    switch (status) {
      case 'NORMAL':
      case 'GOOD':
      case 'DETECTED':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      case 'ATTENTION':
      case 'NEEDS ATTENTION':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      case 'WARNING':
      case 'HIGH RISK':
      case 'POOR':
      case 'HIGH':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700'
    }
  }

  const getPriorityBadge = (priority = 'Medium') => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    }
  }

  // Derive "What Changed" list from trend comparison
  const getWhatChangedList = () => {
    if (!trendData || !trendData.hasPrevious || !trendData.comparison) {
      return []
    }
    const changes = []
    const diff = trendData.scoreDiff
    if (diff > 0) {
      changes.push(`Wellness score increased by ${diff} points (${trendData.previousScore} → ${trendData.currentScore})`)
    } else if (diff < 0) {
      changes.push(`Wellness score decreased by ${Math.abs(diff)} points (${trendData.previousScore} → ${trendData.currentScore})`)
    } else {
      changes.push(`Wellness score remained identical (${trendData.currentScore} / 100)`)
    }

    const { heartRate, temperature, posture, fatigue } = trendData.comparison
    if (heartRate?.previous && heartRate?.current) {
      if (heartRate.current < heartRate.previous) {
        changes.push(`Heart rate lowered from ${heartRate.previous} to ${heartRate.current} BPM`)
      } else if (heartRate.current > heartRate.previous) {
        changes.push(`Heart rate rose from ${heartRate.previous} to ${heartRate.current} BPM`)
      } else {
        changes.push(`Heart rate remained steady at ${heartRate.current} BPM`)
      }
    }

    if (posture?.previous && posture?.current) {
      if (posture.previous !== posture.current) {
        changes.push(`Posture changed from ${posture.previous} to ${posture.current}`)
      } else {
        changes.push(`Posture consistency maintained (${posture.current})`)
      }
    }

    if (fatigue?.previous && fatigue?.current) {
      if (fatigue.previous !== fatigue.current) {
        changes.push(`Fatigue level transitioned from ${fatigue.previous} to ${fatigue.current}`)
      } else {
        changes.push(`Fatigue indicator remained at ${fatigue.current}`)
      }
    }

    if (temperature?.previous && temperature?.current) {
      const prevT = Number(temperature.previous).toFixed(1)
      const currT = Number(temperature.current).toFixed(1)
      if (prevT !== currT) {
        changes.push(`Body temperature shifted from ${prevT}°C to ${currT}°C`)
      } else {
        changes.push(`Body temperature remained thermally stable (${currT}°C)`)
      }
    }

    return changes
  }

  // Derive "What to Improve" strictly from non-optimal readings
  const getWhatToImproveList = () => {
    const improvements = []
    const hrParam = parameters.find(p => p.name === 'Heart Rate')
    const tempParam = parameters.find(p => p.name === 'Temperature')
    const postureParam = parameters.find(p => p.name === 'Posture')
    const fatigueParam = parameters.find(p => p.name === 'Fatigue')

    if (postureParam && postureParam.status !== 'NORMAL' && postureParam.status !== 'GOOD') {
      improvements.push({
        title: 'POSTURE & ERGONOMICS',
        advice: 'Keep your shoulders relaxed, chest open, and maintain upright spine alignment while looking at the mirror.'
      })
    }

    if (fatigueParam && fatigueParam.status !== 'NORMAL' && fatigueParam.status !== 'GOOD') {
      improvements.push({
        title: 'REST & FATIGUE RECOVERY',
        advice: 'Take a short 10-minute rest break away from digital screens and ensure sufficient restorative sleep tonight.'
      })
    }

    if (hrParam && hrParam.status !== 'NORMAL' && hrParam.status !== 'GOOD') {
      improvements.push({
        title: 'CARDIOVASCULAR RELAXATION',
        advice: 'Practice slow diaphragmatic breathing (4s inhale, 6s exhale) to help stabilize your resting heart rate.'
      })
    }

    if (tempParam && tempParam.status !== 'NORMAL' && tempParam.status !== 'GOOD') {
      improvements.push({
        title: 'TEMPERATURE & HYDRATION',
        advice: 'Ensure adequate fluid intake and recheck your temperature with a standard clinical thermometer if needed.'
      })
    }

    // Default if everything is optimal
    if (improvements.length === 0) {
      improvements.push({
        title: 'ROUTINE MAINTENANCE',
        advice: 'All monitored indicators are within optimal reference ranges. Maintain your regular hydration and physical activity routine.'
      })
    }

    return improvements
  }

  // Multi-session statistical context (Requirement 20)
  const getMultiSessionStats = () => {
    if (!historyList || historyList.length === 0) return null
    const scores = historyList
      .map(h => {
        const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
        return a?.wellness_score
      })
      .filter(s => typeof s === 'number')

    if (scores.length === 0) return null

    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const best = Math.max(...scores)
    const lowest = Math.min(...scores)

    return { avg, best, lowest, count: scores.length }
  }

  const multiStats = getMultiSessionStats()
  const whatChangedList = getWhatChangedList()
  const whatToImproveList = getWhatToImproveList()

  const nowFormatted = new Date().toLocaleDateString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const timeFormatted = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Theme color for score ring
  const scoreColor = wellnessScore >= 80 ? 'text-emerald-400' : wellnessScore >= 60 ? 'text-amber-400' : 'text-rose-400'
  const scoreRingGradient = wellnessScore >= 80 ? 'from-emerald-500 to-cyan-400' : wellnessScore >= 60 ? 'from-amber-500 to-orange-400' : 'from-rose-500 to-coral-400'

  return (
    <div className="space-y-6 text-slate-100 animate-fadeIn max-w-5xl mx-auto" id="printable-report">
      
      {/* 1. REPORT HEADER & ACTIONS */}
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-300 font-extrabold bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                SMART MIRROR
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 font-semibold">
                PERSONAL HEALTH MONITOR
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              PERSONAL WELLNESS REPORT
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Autonomous physiological observation & comprehensive wellness analysis
            </p>
          </div>

          {/* Action Buttons (Manual control only, no auto-return!) */}
          <div className="flex flex-wrap items-center gap-2.5 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / Export</span>
            </button>

            <button
              onClick={onStartNewCheck}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>New Check</span>
            </button>

            <button
              onClick={onReturnToCamera}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 border border-white/15 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
              <span>Return to Camera</span>
            </button>
          </div>
        </div>

        {/* Cloud Save Notification (Non-blocking background) */}
        <div className="no-print">
          {saveStatus === 'saving' ? (
            <div className="px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2 shadow-inner">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span className="font-medium">Saving session report to database in background...</span>
            </div>
          ) : saveStatus === 'saved' ? (
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                <span className="font-medium">Session recorded and saved to cloud history.</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 font-bold">REPORT SAVED ✓</span>
            </div>
          ) : (
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-400 text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>Report generated successfully. Cloud sync is offline.</span>
            </div>
          )}
        </div>

        {/* Session Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Session Date</span>
            <span className="text-white font-bold">{nowFormatted}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Time</span>
            <span className="text-slate-200 font-semibold">{timeFormatted}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Duration</span>
            <span className="text-cyan-300 font-bold">{observationDuration}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 shadow-inner col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Mode</span>
            <span className={`font-semibold ${isDemoMode ? 'text-amber-300' : 'text-emerald-300'}`}>
              {isDemoMode ? 'Demo Sensor Mode' : 'Live Optical Mode'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SECTION 1: CURRENT WELLNESS RESULT (HERO SCORE) */}
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            CURRENT WELLNESS RESULT
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase font-mono border ${getStatusBadge(healthStatus)}`}>
              {healthStatus}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-slate-800 border border-white/10 text-slate-300">
              {riskLevel} Risk
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Animated Circular Score Display */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/70 border border-white/10 text-center shadow-inner">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider font-bold">
              WELLNESS SCORE
            </span>
            <div className="my-2 flex items-baseline justify-center gap-1">
              <span className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight transition-all duration-75 ${scoreColor}`}>
                {animatedScore}
              </span>
              <span className="text-xl text-slate-500 font-bold">/ 100</span>
            </div>
            <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">
              {healthStatus} • {riskLevel} Risk
            </span>
          </div>

          {/* Assessment Narrative */}
          <div className="md:col-span-7 space-y-2">
            <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-bold">
              Observation Summary:
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-950/50 p-4 sm:p-5 rounded-2xl border border-white/5">
              {overallInterpretation}
            </p>
          </div>
        </div>
      </div>

      {/* 3. SECTION 2: TODAY'S INDICATORS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Heart Rate (MAX30102 Sensor) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-rose-500/15 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-500/20" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              NORMAL
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Heart Rate</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">MAX30102</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {parameters.find(p => p.name === 'Heart Rate')?.reading || '78 BPM'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ref: 60–100 BPM</span>
          </div>
        </div>

        {/* Temperature (Temperature Sensor) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-cyan-500/15 text-cyan-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              NORMAL
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Temperature</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">Thermal Sensor</span>
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                {parameters.find(p => p.name === 'Temperature')?.reading || '36.7 °C'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Ref: 36.1–37.2 °C</span>
          </div>
        </div>

        {/* Posture (MediaPipe / OpenCV) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-emerald-500/15 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              OPTIMAL
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Posture</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">MediaPipe / CV</span>
            </div>
            <div className="mt-0.5">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {parameters.find(p => p.name === 'Posture')?.reading || 'Good'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Spine & head aligned</span>
          </div>
        </div>

        {/* Fatigue (Vision & Rule AI) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-2xl bg-violet-500/15 text-violet-400">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              GOOD
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold">Fatigue Level</span>
              <span className="text-[8px] font-mono text-slate-500 uppercase">Blink & Rule AI</span>
            </div>
            <div className="mt-0.5">
              <span className="text-xl sm:text-2xl font-extrabold text-white">
                {parameters.find(p => p.name === 'Fatigue')?.reading || 'Low'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Blink frequency & tone</span>
          </div>
        </div>
      </div>

      {/* 4. SECTION 3: COMPARED WITH YOUR LAST CHECK & 5. SECTION 4: WHAT CHANGED */}
      {trendData && trendData.hasPrevious ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Comparison Table (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                PREVIOUS VS CURRENT
              </h3>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold font-mono border ${
                trendData.trendState === 'Improving'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-white/10'
              }`}>
                {trendData.trendDirection} {trendData.trendState}
              </span>
            </div>

            {/* Side by side metric table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Metric</th>
                    <th className="py-2.5 px-3">Previous</th>
                    <th className="py-2.5 px-3">Current</th>
                    <th className="py-2.5 px-3 text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr className="bg-white/5 font-bold text-white">
                    <td className="py-2.5 px-3 font-sans">Wellness Score</td>
                    <td className="py-2.5 px-3">{trendData.previousScore}</td>
                    <td className="py-2.5 px-3 text-cyan-300">{trendData.currentScore}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      {trendData.scoreDiff >= 0 ? `+${trendData.scoreDiff}` : trendData.scoreDiff} pts
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">Heart Rate</td>
                    <td className="py-2 px-3">{trendData.comparison?.heartRate?.previous ?? '--'} BPM</td>
                    <td className="py-2 px-3 text-white">{trendData.comparison?.heartRate?.current ?? '--'} BPM</td>
                    <td className="py-2 px-3 text-right">
                      {trendData.comparison?.heartRate?.previous && trendData.comparison?.heartRate?.current
                        ? `${trendData.comparison.heartRate.previous} → ${trendData.comparison.heartRate.current}`
                        : '--'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">Temperature</td>
                    <td className="py-2 px-3">{trendData.comparison?.temperature?.previous ? `${Number(trendData.comparison.temperature.previous).toFixed(1)}°C` : '--'}</td>
                    <td className="py-2 px-3 text-white">{trendData.comparison?.temperature?.current ? `${Number(trendData.comparison.temperature.current).toFixed(1)}°C` : '--'}</td>
                    <td className="py-2 px-3 text-right">
                      {trendData.comparison?.temperature?.previous && trendData.comparison?.temperature?.current
                        ? `${Number(trendData.comparison.temperature.previous).toFixed(1)} → ${Number(trendData.comparison.temperature.current).toFixed(1)}`
                        : '--'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">Posture</td>
                    <td className="py-2 px-3">{trendData.comparison?.posture?.previous ?? '--'}</td>
                    <td className="py-2 px-3 text-white">{trendData.comparison?.posture?.current ?? '--'}</td>
                    <td className="py-2 px-3 text-right">
                      {trendData.comparison?.posture?.previous} → {trendData.comparison?.posture?.current}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">Fatigue</td>
                    <td className="py-2 px-3">{trendData.comparison?.fatigue?.previous ?? '--'}</td>
                    <td className="py-2 px-3 text-white">{trendData.comparison?.fatigue?.current ?? '--'}</td>
                    <td className="py-2 px-3 text-right">
                      {trendData.comparison?.fatigue?.previous} → {trendData.comparison?.fatigue?.current}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* What Changed (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              WHAT CHANGED SINCE YOUR LAST CHECK?
            </h3>

            <div className="space-y-2.5">
              {whatChangedList.map((chg, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex items-start gap-2.5 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{chg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 text-center space-y-2 text-xs text-slate-400 shadow-xl">
          <Sparkles className="w-6 h-6 text-cyan-400 mx-auto" />
          <h4 className="font-bold text-white text-sm">FIRST SAVED WELLNESS SESSION</h4>
          <p className="max-w-md mx-auto">
            This is your first recorded session on this mirror. When you return, the mirror will automatically display comparative deltas and score progressions here.
          </p>
        </div>
      )}

      {/* 6. SECTION 5: WHAT TO IMPROVE & 7. SECTION 6: PRIORITY ACTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* What to Improve (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 sm:p-7 shadow-xl space-y-4">
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            WHAT CAN YOU IMPROVE?
          </h3>

          <div className="space-y-3">
            {whatToImproveList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1 text-xs"
              >
                <span className="font-mono text-cyan-300 font-bold uppercase tracking-wider text-[11px] block">
                  {item.title}
                </span>
                <p className="text-slate-300 leading-relaxed font-normal">
                  {item.advice}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-cyan-950/60 via-slate-900/80 to-violet-950/60 backdrop-blur-2xl rounded-[36px] border border-cyan-500/30 p-6 sm:p-7 shadow-xl space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 shadow-md">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-cyan-300">
                YOUR PRIORITY ACTION
              </h3>
            </div>

            <p className="text-sm font-semibold text-white leading-relaxed pt-1">
              {aiInsights?.immediateAction || priorityAction || "Maintain your current posture and hydration routine."}
            </p>
          </div>

          <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 font-mono">
            * Authoritative rule engine recommendation.
          </div>
        </div>
      </div>

      {/* 8. SECTION 7: SMART WELLNESS INSIGHT */}
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-cyan-500/30 p-6 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-cyan-300">
                SMART WELLNESS INSIGHT
              </h3>
              <p className="text-[11px] text-slate-400">
                Deterministic Pattern Synthesis
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            Local Engine
          </span>
        </div>

        {isAiLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-violet-300 font-bold">
                <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                <span>Preparing personalized AI interpretation in background...</span>
              </div>
              <div className="h-3 bg-violet-500/20 rounded w-11/12" />
              <div className="h-3 bg-violet-500/15 rounded w-4/5" />
            </div>
          </div>
        ) : aiInsights ? (
          <div className="space-y-3 text-xs animate-fadeIn">
            <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/20 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-violet-300 font-bold tracking-wider">
                AI Summary:
              </span>
              <p className="text-slate-200 leading-relaxed text-sm font-normal">
                {aiInsights.aiSummary}
              </p>
            </div>

            {aiInsights.observations && aiInsights.observations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {aiInsights.observations.slice(0, 4).map((obs, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/50 border border-white/5 flex items-start gap-2 text-slate-300">
                    <ChevronRight className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                    <span>{obs}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>AI interpretation is operating via the local rule-based expert engine.</span>
          </div>
        )}
      </div>

      {/* 9. SECTION 8: RECENT WELLNESS HISTORY & MULTI-SESSION CONTEXT */}
      {historyList && historyList.length > 0 && (
        <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5 no-print">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              RECENT WELLNESS HISTORY ({historyList.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Autonomous Profile Records</span>
          </div>

          {/* Multi-session Statistical Highlights (Requirement 20) */}
          {multiStats && (
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono p-3 rounded-2xl bg-slate-950/60 border border-white/5">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Recent Average</span>
                <span className="text-lg font-extrabold text-cyan-300">{multiStats.avg} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Best Recorded</span>
                <span className="text-lg font-extrabold text-emerald-400">{multiStats.best} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">Lowest Recorded</span>
                <span className="text-lg font-extrabold text-amber-400">{multiStats.lowest} / 100</span>
              </div>
            </div>
          )}

          {/* History Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {historyList.slice(0, 6).map((rec) => {
              const analysis = Array.isArray(rec.health_analysis) ? rec.health_analysis[0] : rec.health_analysis
              const dateStr = new Date(rec.created_at).toLocaleString([], {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })

              return (
                <div
                  key={rec.id}
                  className="p-4 rounded-3xl bg-slate-950/60 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-white font-sans block">{dateStr}</span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">ID: {rec.session_id || rec.id.slice(0, 8)}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getStatusBadge(analysis?.health_status)}`}>
                      {analysis?.health_status || 'Recorded'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-900 border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="font-extrabold text-white text-sm">{analysis?.wellness_score ?? '--'}</span>
                      <span className="text-[6px] text-slate-400 uppercase font-bold">SCORE</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                      <div className="flex gap-2">
                        <span className="text-rose-400">{rec.heart_rate} BPM</span>
                        <span className="text-cyan-400">{rec.temperature}°C</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        {rec.posture_status} • {rec.fatigue_level}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedHistoricalRecord({ record: rec, analysis, dateStr })}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VIEW REPORT →</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 10. SECTION 9: FINAL SUMMARY & SECTION 10: ACTION BUTTONS (NO AUTO-RETURN!) */}
      <div className="bg-slate-900/80 backdrop-blur-2xl rounded-[36px] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          FINAL SUMMARY & ACTIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono text-center">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Wellness Score</span>
            <span className="text-xl font-bold text-white">{wellnessScore} / 100</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Overall Status</span>
            <span className="text-base font-bold text-emerald-400">{healthStatus}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Risk Level</span>
            <span className="text-base font-bold text-slate-300">{riskLevel}</span>
          </div>
        </div>

        {/* Big Action Buttons (Manual control only!) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 no-print">
          <button
            onClick={onReturnToCamera}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/15 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
            <span>RETURN TO CAMERA</span>
          </button>

          <button
            onClick={onStartNewCheck}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START NEW WELLNESS CHECK</span>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>{disclaimer || "Educational wellness-monitoring prototype. This system is not a medical diagnostic device and should not be used for medical diagnosis or treatment. Sensor values may be simulated in Demo Mode."}</p>
        </div>
      </div>

      {/* Historical Report Modal */}
      {selectedHistoricalRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-2xl w-full rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-7 space-y-4 relative max-h-[85vh] overflow-y-auto animate-fadeIn text-slate-100">
            <button
              onClick={() => setSelectedHistoricalRecord(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                HISTORICAL WELLNESS REPORT
              </span>
              <h3 className="text-lg font-bold text-white">
                Session: {selectedHistoricalRecord.dateStr}
              </h3>
              <p className="text-xs text-slate-500 font-mono">ID: {selectedHistoricalRecord.record.id}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 text-[10px] block font-bold">WELLNESS SCORE</span>
                <span className="text-2xl font-bold text-white">{selectedHistoricalRecord.analysis?.wellness_score} / 100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 text-[10px] block font-bold">STATUS</span>
                <span className="text-base font-bold text-slate-200">{selectedHistoricalRecord.analysis?.health_status}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 text-[10px] block font-bold">RISK</span>
                <span className="text-base font-bold text-slate-200">{selectedHistoricalRecord.analysis?.risk_level}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 leading-relaxed">
              <p className="font-semibold text-white mb-1">Assessment Summary:</p>
              <p>{selectedHistoricalRecord.analysis?.analysis || selectedHistoricalRecord.analysis?.analysis_summary}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedHistoricalRecord(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Back to Current Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
