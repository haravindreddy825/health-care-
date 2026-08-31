import React from 'react'

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  className = '',
  icon: Icon = null,
  size = 'md'
}) {
  const sizeClasses = size === 'sm'
    ? 'px-3.5 py-2 text-xs'
    : size === 'lg'
    ? 'px-8 py-4 text-base font-extrabold'
    : 'px-5 py-2.5 text-xs font-bold'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 fill-current shrink-0" />}
      <span>{children}</span>
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  disabled = false,
  className = '',
  icon: Icon = null,
  size = 'md'
}) {
  const sizeClasses = size === 'sm'
    ? 'px-3.5 py-2 text-xs'
    : size === 'lg'
    ? 'px-6 py-3.5 text-sm font-bold'
    : 'px-4 py-2.5 text-xs font-semibold'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl bg-slate-850 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white uppercase font-mono tracking-wider shadow-sm hover:border-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
      <span>{children}</span>
    </button>
  )
}
