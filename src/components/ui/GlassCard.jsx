import React from 'react'

export function GlassCard({
  children,
  className = '',
  gradientGlow = '',
  hoverEffect = true,
  onClick = null,
  id = undefined
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative rounded-[32px] bg-slate-900/75 backdrop-blur-2xl border border-white/10 shadow-2xl transition-all duration-300 ${
        hoverEffect ? 'hover:border-white/20 hover:shadow-cyan-950/30' : ''
      } ${gradientGlow} ${className}`}
    >
      {children}
    </div>
  )
}

export function GradientCard({
  children,
  className = '',
  accent = 'cyan' // 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet'
}) {
  const getGradientBorder = () => {
    switch (accent) {
      case 'emerald':
        return 'from-emerald-500/30 via-slate-900/80 to-cyan-500/20 border-emerald-500/40 shadow-emerald-950/20'
      case 'amber':
        return 'from-amber-500/30 via-slate-900/80 to-orange-500/20 border-amber-500/40 shadow-amber-950/20'
      case 'rose':
        return 'from-rose-500/30 via-slate-900/80 to-coral-500/20 border-rose-500/40 shadow-rose-950/20'
      case 'violet':
        return 'from-violet-500/30 via-slate-900/80 to-purple-500/20 border-violet-500/40 shadow-violet-950/20'
      default:
        return 'from-cyan-500/30 via-slate-900/80 to-blue-500/20 border-cyan-500/40 shadow-cyan-950/20'
    }
  }

  return (
    <div className={`relative rounded-[32px] bg-gradient-to-br backdrop-blur-2xl border p-6 sm:p-7 shadow-2xl ${getGradientBorder()} ${className}`}>
      {children}
    </div>
  )
}
