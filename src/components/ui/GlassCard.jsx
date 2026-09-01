import React from 'react'

export function GlassCard({
  children,
  className = '',
  glow = null, // 'cyan' | 'emerald' | 'amber' | 'rose' | null
  onClick = null,
  hover = false
}) {
  let glowClass = 'glass-panel'
  if (glow === 'cyan') glowClass = 'glass-panel-glow-cyan'
  if (glow === 'emerald') glowClass = 'glass-panel-glow-emerald'
  if (glow === 'amber') glowClass = 'glass-panel-glow-amber'
  if (glow === 'rose') glowClass = 'glass-panel-glow-rose'

  const hoverClass = hover ? 'transition-all duration-300 hover:border-white/20 hover:scale-[1.01]' : ''
  const cursorClass = onClick ? 'cursor-pointer' : ''

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-5 sm:p-6 text-slate-100 ${glowClass} ${hoverClass} ${cursorClass} ${className}`}
    >
      {children}
    </div>
  )
}
