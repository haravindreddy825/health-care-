import React from 'react'

export function TrendChart({
  data = [], // array of numbers or { score, date }
  height = 80,
  color = '#06b6d4',
  fill = true,
  showDots = true,
  minVal = 40,
  maxVal = 100
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="flex items-center justify-center text-xs font-mono text-slate-500">
        Insufficient trend points
      </div>
    )
  }

  const values = data.map(d => typeof d === 'number' ? d : (d.score || d.wellness_score || 80))
  const actualMin = Math.min(...values, minVal)
  const actualMax = Math.max(...values, maxVal)
  const range = actualMax - actualMin || 1

  const width = 300
  const paddingX = 15
  const paddingY = 10
  const effectiveW = width - paddingX * 2
  const effectiveH = height - paddingY * 2

  const points = values.map((val, idx) => {
    const x = paddingX + (values.length > 1 ? (idx / (values.length - 1)) * effectiveW : effectiveW / 2)
    const normalizedY = (val - actualMin) / range
    const y = height - paddingY - (normalizedY * effectiveH)
    return { x, y, val }
  })

  const pathD = points.length === 1
    ? `M ${paddingX} ${points[0].y} L ${width - paddingX} ${points[0].y}`
    : points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`, '')

  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : ''

  return (
    <div className="w-full relative overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Fill Area */}
        {fill && points.length > 1 && (
          <path d={areaD} fill={`url(#grad-${color.replace('#', '')})`} />
        )}

        {/* Trend Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots && points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3.5"
            fill="#030712"
            stroke={color}
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  )
}
