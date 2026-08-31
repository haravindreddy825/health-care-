import React from 'react'

export function StatusBadge({ status = 'Healthy', size = 'md', className = '' }) {
  const norm = (status || '').toUpperCase()

  const getStyle = () => {
    switch (norm) {
      case 'HEALTHY':
      case 'NORMAL':
      case 'GOOD':
      case 'OPTIMAL':
      case 'LOW':
      case 'READY':
      case 'CONNECTED':
      case 'IMPROVING':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      case 'NEEDS ATTENTION':
      case 'ATTENTION':
      case 'MEDIUM':
      case 'ELEVATED':
      case 'MODERATE':
      case 'STABLE':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      case 'HIGH RISK':
      case 'HIGH':
      case 'POOR':
      case 'CRITICAL':
      case 'WARNING':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
      case 'INSIGHT':
      case 'SYNTHESIS':
        return 'bg-violet-500/15 text-violet-300 border-violet-500/30'
      default:
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
    }
  }

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2.5 py-0.5'
    : size === 'lg'
    ? 'text-sm px-4 py-1.5'
    : 'text-xs px-3 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-mono font-bold uppercase tracking-wider border shadow-sm ${getStyle()} ${sizeClasses} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status}</span>
    </span>
  )
}
