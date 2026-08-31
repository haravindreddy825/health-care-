import React from 'react'
import {
  Activity,
  TrendingUp,
  Heart,
  Thermometer,
  User,
  Moon,
  Zap,
  CheckCircle2,
  Play,
  History,
  Sparkles,
  ShieldCheck
} from 'lucide-react'

export function HealthDashboardView({
  latestReading,
  latestAnalysis,
  trendData,
  historyList = [],
  onStartCheck,
  onNavigate
}) {
  const score = latestAnalysis?.wellness_score ?? 85
  const status = latestAnalysis?.health_status ?? 'Healthy'
  const risk = latestAnalysis?.risk_level ?? 'Low'
  const summary = latestAnalysis?.analysis ?? 'Daily physiological indicators are stabilized and ready for monitoring.'
  const priorityAction = latestAnalysis?.immediate_action ?? 'Maintain regular healthy hydration and ergonomic posture.'

  // Multi-session statistical calculations
  const scores = historyList
    .map(h => {
      const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
      return a?.wellness_score
    })
    .filter(s => typeof s === 'number')

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : score
  const bestScore = scores.length > 0 ? Math.max(...scores) : score

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* 1. Daily Hero Card */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-slate-900/90 border border-white/15 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                DAILY WELLNESS OVERVIEW
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                Smart Mirror Health Summary
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personal Health Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthesis of your contactless optical biomarkers and sensor telemetry
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onStartCheck}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Health Check</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>View History</span>
            </button>
          </div>
        </div>

        {/* Hero Score & Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/70 border border-white/5 space-y-2 text-center">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
              CUMULATIVE SCORE
            </span>
            <div className="w-24 h-24 rounded-full border-4 border-cyan-400/50 bg-cyan-500/10 flex flex-col items-center justify-center shadow-xl shadow-cyan-500/20">
              <span className="text-4xl font-extrabold font-mono text-white">{score}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">/ 100</span>
            </div>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {status.toUpperCase()}
            </span>
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                ASSESSMENT NARRATIVE
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Current Score</span>
          <span className="text-3xl font-extrabold font-mono text-cyan-300">{score}</span>
          <span className="text-[10px] text-slate-500 font-mono block">Out of 100</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Previous Score</span>
          <span className="text-3xl font-extrabold font-mono text-slate-300">
            {trendData?.previousScore ?? (historyList.length > 1 ? historyList[1]?.health_analysis?.[0]?.wellness_score : '--')}
          </span>
          <span className="text-[10px] text-slate-500 font-mono block">Last Session</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Score Delta</span>
          <span className={`text-3xl font-extrabold font-mono ${
            trendData?.scoreDiff > 0 ? 'text-emerald-400' : trendData?.scoreDiff < 0 ? 'text-amber-400' : 'text-slate-300'
          }`}>
            {trendData?.scoreDiff !== undefined
              ? (trendData.scoreDiff >= 0 ? `+${trendData.scoreDiff}` : trendData.scoreDiff)
              : '--'}
          </span>
          <span className="text-[10px] text-slate-500 font-mono block">{trendData?.trendState || 'Steady'}</span>
        </div>

        <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 text-center space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Recent Average</span>
          <span className="text-3xl font-extrabold font-mono text-emerald-300">{avgScore}</span>
          <span className="text-[10px] text-slate-500 font-mono block">Best: {bestScore}</span>
        </div>
      </div>

      {/* 3. Priority Action & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-tr from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/40 space-y-3 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-cyan-300">
              YOUR PRIORITY ACTION
            </h3>
          </div>
          <p className="text-sm font-semibold text-white leading-relaxed">
            {priorityAction}
          </p>
        </div>

        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            DAILY HEALTH SUGGESTIONS
          </h3>

          <div className="space-y-2.5">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">POSTURE & ERGONOMICS</span>
              <p className="text-xs text-slate-300">Keep spinal alignment upright and align screen at direct eye level.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">HYDRATION & REST</span>
              <p className="text-xs text-slate-300">Drink water regularly and practice 20-second ocular rest intervals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
