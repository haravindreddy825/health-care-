import React from 'react'

export function WellnessScoreGauge({
  score = 85,
  healthStatus = 'Healthy',
  riskLevel = 'LOW',
  size = 180
}) {
  const safeScore = Math.max(0, Math.min(100, score ?? 85))

  const isHealthy = safeScore >= 80
  const isAttention = safeScore >= 60 && safeScore < 80

  const strokeColor = isHealthy
    ? '#10b981' // emerald-500
    : isAttention
    ? '#f59e0b' // amber-500
    : '#f43f5e' // rose-500

  const badgeBg = isHealthy
    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    : isAttention
    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (safeScore / 100) * circumference

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 font-mono">
      <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
        WELLNESS SCORE
      </span>

      {/* Circular Gauge */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Track Background */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="10"
            fill="transparent"
          />

          {/* Progress Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {safeScore}
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase">
            / 100 PTS
          </span>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2 pt-1">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${badgeBg}`}>
          {healthStatus}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 text-xs font-bold uppercase">
          {riskLevel} RISK
        </span>
      </div>
    </div>
  )
}
