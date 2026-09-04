import React from 'react'
import {
  Activity,
  Heart,
  Thermometer,
  Ruler,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  CloudSun,
  Zap,
  Play,
  Calendar,
  ShieldCheck,
  User,
  Bell,
  Check,
  Eye,
  Camera,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'
import { WellnessScoreGauge } from '../components/analysis/WellnessScoreGauge.jsx'
import { TrendChart } from '../components/ui/TrendChart.jsx'
import { SensorCard } from '../components/sensors/SensorCard.jsx'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { useSmartMirror } from '../context/SmartMirrorContext.jsx'

export function DashboardPage() {
  const {
    activeProfile,
    sensorsState,
    latestReport,
    latestComparison,
    historyList,
    weather,
    cameraState,
    visionState,
    reminders,
    toggleReminder,
    startObservationWorkflow,
    setActiveTab
  } = useSmartMirror()

  const currentScore = latestReport?.wellnessScore ?? (historyList[0]?.health_analysis?.[0]?.wellness_score || 85)
  const healthStatus = latestReport?.healthStatus ?? (historyList[0]?.health_analysis?.[0]?.health_status || 'Healthy')
  const riskLevel = latestReport?.riskLevel ?? (historyList[0]?.health_analysis?.[0]?.risk_level || 'LOW')

  // Extract past score trend numbers for the active user
  const scoreTrendData = historyList
    .slice(0, 10)
    .reverse()
    .map(h => {
      const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
      return a?.wellness_score || 80
    })

  if (scoreTrendData.length === 0) {
    scoreTrendData.push(currentScore)
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Executive Hero Header */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                SMART MIRROR EXECUTIVE DASHBOARD
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                Active Profile: <strong className="text-white">{activeProfile?.name}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Smart Wellness Overview
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
              Continuous multi-modal telemetry and personalized lifestyle synthesis
            </p>
          </div>

          <button
            onClick={() => startObservationWorkflow(10)}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Run Wellness Check</span>
          </button>
        </div>

        {/* Hero Gauge & Summary Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left: Score Gauge */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-950/70 border border-white/5 flex flex-col items-center justify-center shadow-xl">
            <WellnessScoreGauge
              score={currentScore}
              healthStatus={healthStatus}
              riskLevel={riskLevel}
            />
          </div>

          {/* Right: Key Summary & Same-User Recent Momentum */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Priority Action Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 space-y-2 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Zap className="w-4 h-4 text-cyan-400 fill-current" />
                <span>TODAY'S PRIORITY TAKEAWAY</span>
              </div>
              <p className="text-sm font-semibold text-white font-sans leading-relaxed">
                {latestReport?.priorityAction || 'Maintain consistent hydration, upright posture in front of displays, and take scheduled ocular breaks.'}
              </p>
            </div>

            {/* Same-User Historical Momentum */}
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase font-sans">
                    Same-User Score Trend ({scoreTrendData.length} checks)
                  </span>
                </div>
                <span className="text-cyan-300 font-bold">
                  {scoreTrendData.join(' → ')}
                </span>
              </div>

              <div className="h-20 w-full pt-1">
                <TrendChart data={scoreTrendData} height={70} color="#06b6d4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Physical Sensor Telemetry Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-sans">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>LIVE TELEMETRY MATRIX</span>
          </h3>
          <button
            onClick={() => setActiveTab('sensors')}
            className="text-cyan-400 hover:text-cyan-300 text-xs font-bold cursor-pointer"
          >
            Hardware Center →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard sensor={sensorsState.heartRate} />
          <SensorCard sensor={sensorsState.spo2} />
          <SensorCard sensor={sensorsState.temperature} />
          <SensorCard sensor={sensorsState.distance} />
        </div>
      </div>

      {/* 3. Recovery Trend & Smart Reminders Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Recovery Analysis (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                Longitudinal Recovery Trend
              </h3>
            </div>
            <StatusBadge status={latestComparison?.overallTrend || 'STABLE'} size="xs" />
          </div>

          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            {latestComparison?.overallTrend === 'IMPROVING'
              ? 'Wellness trend appears to be improving compared to your previous baseline scan.'
              : latestComparison?.overallTrend === 'NEEDS ATTENTION'
              ? 'Wellness trend indicates one or more indicators require attention.'
              : 'Wellness indicators remain stable and consistent with your historical baseline.'}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Wellness Score Delta</span>
              <div className="text-base font-extrabold text-white flex items-center gap-1">
                {latestComparison?.scoreDelta != null ? (
                  latestComparison.scoreDelta >= 0 ? (
                    <span className="text-emerald-400 flex items-center">+{latestComparison.scoreDelta} pts <ArrowUpRight className="w-4 h-4" /></span>
                  ) : (
                    <span className="text-cyan-400 flex items-center">{latestComparison.scoreDelta} pts <ArrowDownRight className="w-4 h-4" /></span>
                  )
                ) : 'Baseline'}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Heart Rate Shift</span>
              <div className="text-base font-extrabold text-white">
                {latestComparison?.heartRateDelta != null
                  ? `${latestComparison.heartRateDelta > 0 ? '+' : ''}${latestComparison.heartRateDelta} BPM`
                  : 'Stable'}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Reminders Panel (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                Smart Mirror Daily Reminders
              </h3>
            </div>
            <span className="text-amber-400 text-[10px] font-bold">ACTIVE</span>
          </div>

          <div className="space-y-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                onClick={() => toggleReminder(rem.id)}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  rem.enabled
                    ? 'bg-slate-950/80 border-cyan-500/30 text-white'
                    : 'bg-slate-950/40 border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                    rem.enabled ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                  }`}>
                    {rem.enabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold font-sans block">{rem.title}</span>
                    <span className="text-[10px] text-slate-400">{rem.time} • {rem.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Weather & Vision Matrix Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Ambient Weather Card (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                Ambient Climate & Environment
              </h3>
            </div>
            <span className="text-slate-400 text-[10px]">{weather.location}</span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">{weather.temperature}°C</span>
              <span className="text-slate-400 font-bold">{weather.condition}</span>
            </div>
            <span className="text-cyan-300 font-bold">Humidity: {weather.humidity}%</span>
          </div>

          <p className="text-slate-300 font-sans text-xs font-normal leading-relaxed pt-1">
            {weather.wellnessTip}
          </p>
        </div>

        {/* Optical Posture & Fatigue (6 Cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border-white/10 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
                Vision-Based Wellness Indicators
              </h3>
            </div>
            <span className="text-emerald-400 text-[10px] font-bold">LIVE OPTICAL</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Spinal Posture</span>
              <div className="text-lg font-bold text-white">{sensorsState.posture.reading}</div>
              <span className="text-[10px] text-slate-400">Head angle & alignment</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Alertness Index</span>
              <div className="text-lg font-bold text-white">{sensorsState.fatigue.reading}</div>
              <span className="text-[10px] text-slate-400">Eye aspect ratio (EAR)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
