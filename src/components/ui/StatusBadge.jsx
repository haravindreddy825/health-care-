import React from 'react'

export function StatusBadge({ status, source, size = 'sm', className = '' }) {
  let styleClass = 'bg-slate-800 text-slate-300 border-slate-700'
  let label = status || 'NORMAL'

  // Source-based coloring & override
  if (source === 'hardware') {
    styleClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
    label = status || 'LIVE SENSOR'
  } else if (source === 'demo') {
    styleClass = 'bg-amber-500/15 text-amber-300 border-amber-500/40'
    label = status || 'DEMO / SIMULATED'
  } else if (source === 'unavailable' || status === 'DISCONNECTED') {
    styleClass = 'bg-rose-500/10 text-rose-300 border-rose-500/30'
    label = status || 'NOT CONNECTED'
  } else {
    // Status text mapping
    const upper = String(status || '').toUpperCase()
    if (upper.includes('HEALTHY') || upper.includes('OPTIMAL') || upper.includes('GOOD') || upper.includes('LOW') || upper.includes('ALERT')) {
      styleClass = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    } else if (upper.includes('ATTENTION') || upper.includes('MODERATE') || upper.includes('NEEDS') || upper.includes('STABLE')) {
      styleClass = 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    } else if (upper.includes('HIGH') || upper.includes('POOR') || upper.includes('WARNING') || upper.includes('FEVER') || upper.includes('ERROR')) {
      styleClass = 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    } else if (upper.includes('IMPROVING')) {
      styleClass = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    }
  }

  const sizeClass = size === 'xs'
    ? 'text-[10px] px-2 py-0.5'
    : size === 'lg'
    ? 'text-sm px-4 py-1.5'
    : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-bold uppercase tracking-wider border ${sizeClass} ${styleClass} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{label}</span>
    </span>
  )
}
