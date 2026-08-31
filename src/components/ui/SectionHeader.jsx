import React from 'react'

export function SectionHeader({
  title,
  subtitle = null,
  icon: Icon = null,
  badge = null,
  action = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5 mb-4 ${className}`}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="p-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <div>
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-300">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 font-medium">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {badge}
        {action}
      </div>
    </div>
  )
}
