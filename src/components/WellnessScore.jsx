import React from 'react'
import { Activity, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react'

export function WellnessScore({
  score = 85,
  status = 'Healthy',
  riskLevel = 'Low',
  penalties = []
}) {
  // Color configuration based on score
  let scoreColor = '#10b981' // emerald
  let strokeBg = 'stroke-emerald-500'
  let textColor = 'text-emerald-400'
  let statusBadge = 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
  let riskBadge = 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
  let StatusIcon = ShieldCheck

  if (score < 60) {
    scoreColor = '#f43f5e' // rose
    strokeBg = 'stroke-rose-500'
    textColor = 'text-rose-400'
    statusBadge = 'bg-rose-950/80 border-rose-500/50 text-rose-300'
    riskBadge = 'bg-rose-950/80 border-rose-500/50 text-rose-300'
    StatusIcon = AlertCircle
  } else if (score < 80) {
    scoreColor = '#f59e0b' // amber
    strokeBg = 'stroke-amber-500'
    textColor = 'text-amber-400'
    statusBadge = 'bg-amber-950/80 border-amber-500/50 text-amber-300'
    riskBadge = 'bg-amber-950/80 border-amber-500/50 text-amber-300'
    StatusIcon = AlertTriangle
  }

  // Circular gauge calculation
  const radius = 64
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">AI Wellness Index</h3>
            <p className="text-[11px] text-slate-400">Aggregated Expert Rule Score</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusBadge}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${riskBadge}`}>
            Risk: {riskLevel}
          </span>
        </div>
      </div>

      {/* Center Circular Score Visual */}
      <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Radial Meter */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800/80"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke={scoreColor}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${textColor}`}>
              {score}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase">/ 100</span>
          </div>
        </div>

        {/* Score Classification Guide & Deductions */}
        <div className="flex-1 space-y-2.5 w-full">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
            <span className="text-slate-400 font-medium">Index Assessment:</span>
            <span className={`font-bold font-mono ${textColor}`}>
              {score >= 80 ? 'Optimal Condition' : score >= 60 ? 'Moderate Strain' : 'Elevated Risk'}
            </span>
          </div>

          {penalties && penalties.length > 0 ? (
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
                Scoring Adjustments:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {penalties.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-rose-950/50 border border-rose-500/30 text-rose-300 font-mono"
                  >
                    <span>{p.factor}</span>
                    <span className="text-rose-400 font-bold">-{p.deduction}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Full 100 base score maintained across all telemetry points.</span>
            </div>
          )}

          <div className="text-[10px] text-slate-500 font-mono flex justify-between pt-1">
            <span>80-100: Healthy</span>
            <span>60-79: Attention</span>
            <span>&lt;60: High Risk</span>
          </div>
        </div>
      </div>
    </div>
  )
}
