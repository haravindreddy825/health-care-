import React from 'react'

export function LoadingSkeleton({ type = 'cards', count = 3, className = '' }) {
  if (type === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-5 rounded-3xl bg-slate-900/60 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-800 rounded-full" />
              <div className="h-4 w-16 bg-slate-800 rounded-full" />
            </div>
            <div className="h-10 w-20 bg-slate-800/80 rounded-xl" />
            <div className="h-3 w-full bg-slate-800/50 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`p-6 rounded-3xl bg-slate-900/60 border border-white/5 space-y-4 animate-pulse ${className}`}>
      <div className="h-5 w-40 bg-slate-800 rounded-full" />
      <div className="h-4 w-full bg-slate-800/60 rounded-full" />
      <div className="h-4 w-4/5 bg-slate-800/50 rounded-full" />
      <div className="h-4 w-2/3 bg-slate-800/40 rounded-full" />
    </div>
  )
}
