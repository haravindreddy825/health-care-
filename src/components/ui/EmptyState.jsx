import React from 'react'
import { Sparkles } from 'lucide-react'

export function EmptyState({
  icon: Icon = Sparkles,
  title = 'No Data Available',
  description = 'Complete a wellness check to populate this section.',
  action = null,
  className = ''
}) {
  return (
    <div className={`p-8 sm:p-10 rounded-[32px] bg-slate-900/60 backdrop-blur-xl border border-dashed border-white/10 text-center space-y-3 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">{title}</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
