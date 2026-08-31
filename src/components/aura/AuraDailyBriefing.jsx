import React from 'react'
import { Activity, Sparkles, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, Zap, Shield } from 'lucide-react'

export function AuraDailyBriefing({
  wellnessScore = 85,
  status = 'Normal',
  onStartCheck,
  historyCount = 0
}) {
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (wellnessScore / 100) * circumference

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 space-y-8">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full aura-glass text-xs font-mono text-[#89ceff] border-[#89ceff]/30 mb-2">
            <Activity className="w-3.5 h-3.5 text-[#4edea3]" />
            <span className="font-bold uppercase tracking-wider">YOUR DAILY BRIEFING</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Reflective Health Snapshot
          </h2>
        </div>

        <button
          onClick={onStartCheck}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#89ceff] to-[#4edea3] hover:opacity-90 text-[#0b0f10] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#89ceff]/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>Run Wellness Check</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid: Circular Gauge & Suggestions Stack */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Circular SVG Gauge Card - 5 Cols */}
        <div className="md:col-span-5 aura-glass rounded-[36px] p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xl border-[#89ceff]/30">
          <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
            CUMULATIVE WELLNESS INDEX
          </span>

          {/* Circular SVG Gauge */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="none"
              />
              {/* Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#4edea3"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Score Center Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold font-mono text-white tracking-tight">
                {wellnessScore}
              </span>
              <span className="text-xs font-mono text-slate-400 font-bold">/ 100</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[#4edea3]/20 border border-[#4edea3]/40 text-[#4edea3] text-xs font-mono font-bold uppercase">
              STATUS: {status.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
              LOW RISK
            </span>
          </div>
        </div>

        {/* Right: AI Suggestions Stack - 7 Cols */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#89ceff]" />
              AI RECOMMENDATIONS & RECOVERY STACK
            </span>
            <span className="text-[11px] font-mono text-[#89ceff]">Live Adaptive</span>
          </div>

          {/* Suggestion 1 */}
          <div className="p-5 rounded-3xl aura-glass border-[#89ceff]/30 hover:border-[#89ceff]/50 transition-all flex items-start gap-4 shadow-lg">
            <div className="p-2.5 rounded-2xl bg-[#89ceff]/15 text-[#89ceff] border border-[#89ceff]/30 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  Correct Your Posture
                </h4>
                <span className="text-[10px] font-mono text-[#89ceff] bg-[#89ceff]/10 px-2 py-0.5 rounded-full">
                  Priority: High
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mild forward head posture detected during recent video sampling. Align chin parallel to the floor and gently retract shoulder blades.
              </p>
            </div>
          </div>

          {/* Suggestion 2 */}
          <div className="p-5 rounded-3xl aura-glass border-[#4edea3]/30 hover:border-[#4edea3]/50 transition-all flex items-start gap-4 shadow-lg">
            <div className="p-2.5 rounded-2xl bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-mono uppercase">
                  Take a 5-Minute Screen Break
                </h4>
                <span className="text-[10px] font-mono text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded-full">
                  Rest Protocol
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ocular blink rate dynamics indicate early screen fatigue. Practice 20 seconds of distance focal adjustment and drink cool water.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
