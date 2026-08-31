import React, { useState } from 'react'
import { TrendingUp, BarChart2 } from 'lucide-react'

export function TrendChart({ historyList = [], className = '' }) {
  const [activeTab, setActiveTab] = useState('score') // 'score' | 'hr' | 'temp' | 'posture' | 'fatigue'
  const [sessionRange, setSessionRange] = useState(7) // 7 | 30 | 100

  // Filter valid data points
  const points = (historyList || [])
    .slice(0, sessionRange)
    .reverse()
    .map((h, i) => {
      const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
      const d = new Date(h.created_at)
      return {
        id: h.id,
        index: i + 1,
        date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        score: a?.wellness_score ?? null,
        hr: h.heart_rate ?? null,
        temp: h.temperature ? Number(h.temperature) : null,
        posture: h.posture_status || 'Good',
        fatigue: h.fatigue_level || 'Low'
      }
    })
    .filter(p => p.score !== null)

  if (points.length === 0) {
    return (
      <div className={`p-8 rounded-3xl bg-slate-950/60 border border-white/5 text-center text-xs text-slate-400 space-y-2 ${className}`}>
        <BarChart2 className="w-8 h-8 text-cyan-400 mx-auto" />
        <h4 className="font-bold text-white text-sm">NO WELLNESS TREND YET</h4>
        <p className="max-w-sm mx-auto">
          Complete your first wellness check to see your progress and score trend over time.
        </p>
      </div>
    )
  }

  // Calculate SVG curve coordinates for score / HR / temp
  const getValues = () => {
    switch (activeTab) {
      case 'hr':
        return { data: points.map(p => p.hr || 75), min: 50, max: 130, unit: 'BPM', color: '#f43f5e' }
      case 'temp':
        return { data: points.map(p => p.temp || 36.7), min: 35.5, max: 39.0, unit: '°C', color: '#06b6d4' }
      default:
        return { data: points.map(p => p.score), min: 40, max: 100, unit: 'pts', color: '#10b981' }
    }
  }

  const { data: valArray, min, max, unit, color } = getValues()
  const width = 600
  const height = 180
  const padX = 40
  const padY = 25

  const getX = (index) => {
    if (points.length === 1) return width / 2
    return padX + (index * (width - padX * 2)) / (points.length - 1)
  }

  const getY = (val) => {
    const clamped = Math.max(min, Math.min(max, val))
    return height - padY - ((clamped - min) / (max - min)) * (height - padY * 2)
  }

  const pathD = points.map((p, idx) => {
    const x = getX(idx)
    const y = getY(valArray[idx])
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tab Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('score')}
            className={`px-3 py-1 rounded-xl transition-all font-bold cursor-pointer ${
              activeTab === 'score' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Score
          </button>
          <button
            onClick={() => setActiveTab('hr')}
            className={`px-3 py-1 rounded-xl transition-all font-bold cursor-pointer ${
              activeTab === 'hr' ? 'bg-rose-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Heart Rate
          </button>
          <button
            onClick={() => setActiveTab('temp')}
            className={`px-3 py-1 rounded-xl transition-all font-bold cursor-pointer ${
              activeTab === 'temp' ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Temp
          </button>
        </div>

        {/* Range Selector */}
        <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
          <span>Range:</span>
          {[7, 30].map(r => (
            <button
              key={r}
              onClick={() => setSessionRange(r)}
              className={`px-2 py-0.5 rounded-lg border cursor-pointer ${
                sessionRange === r ? 'bg-slate-800 text-white border-white/20' : 'border-transparent hover:bg-slate-800/50'
              }`}
            >
              {r} sessions
            </button>
          ))}
        </div>
      </div>

      {/* SVG Line Graph */}
      <div className="p-4 rounded-3xl bg-slate-950/75 border border-white/10 shadow-inner relative overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
          {/* Subtle Gridlines */}
          {[0.25, 0.5, 0.75].map((pct, idx) => (
            <line
              key={idx}
              x1={padX}
              y1={padY + (height - padY * 2) * pct}
              x2={width - padX}
              y2={padY + (height - padY * 2) * pct}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area Fill Gradient */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {points.length > 1 && (
            <path
              d={`${pathD} L ${getX(points.length - 1)} ${height - padY} L ${getX(0)} ${height - padY} Z`}
              fill="url(#chartGradient)"
            />
          )}

          {/* Main Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const x = getX(idx)
            const y = getY(valArray[idx])
            return (
              <g key={p.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#020617"
                  stroke={color}
                  strokeWidth="2.5"
                />
                <text
                  x={x}
                  y={y - 10}
                  fill="#ffffff"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {valArray[idx]}
                </text>
                <text
                  x={x}
                  y={height - 8}
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {p.date}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
