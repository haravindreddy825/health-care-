import React, { useState, useEffect } from 'react'

export function ScoreRing({ score = 85, size = 'lg', showMax = true, animate = true }) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score)

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score)
      return
    }
    let current = 0
    const target = score || 85
    const step = Math.max(1, Math.ceil(target / 25))
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setDisplayScore(target)
        clearInterval(timer)
      } else {
        setDisplayScore(current)
      }
    }, 28)
    return () => clearInterval(timer)
  }, [score, animate])

  const getColor = () => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-rose-400'
  }

  const getBorderColor = () => {
    if (score >= 80) return 'border-emerald-500/40 shadow-emerald-500/15'
    if (score >= 60) return 'border-amber-500/40 shadow-amber-500/15'
    return 'border-rose-500/40 shadow-rose-500/15'
  }

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-[28px] bg-slate-950/70 border ${getBorderColor()} text-center shadow-inner`}>
      <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest font-bold">
        WELLNESS SCORE
      </span>
      <div className="my-2 flex items-baseline justify-center gap-1">
        <span className={`text-6xl sm:text-7xl font-extrabold font-mono tracking-tight transition-all duration-75 ${getColor()}`}>
          {displayScore}
        </span>
        {showMax && (
          <span className="text-xl text-slate-500 font-bold">/ 100</span>
        )}
      </div>
      <span className="text-[11px] font-mono text-slate-300 font-bold uppercase tracking-wider">
        {score >= 80 ? 'OPTIMAL PROTOCOL' : score >= 60 ? 'NEEDS ATTENTION' : 'HIGH RISK'}
      </span>
    </div>
  )
}
