import React from 'react'
import { isSupabaseConfigured } from './lib/supabase'

export function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto text-xl font-bold">
          ⚡
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Project Cleaned & Ready
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Old application removed. Supabase connection preserved and ready for fresh implementation.
        </p>
        <div className="pt-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold ${
            isSupabaseConfigured
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Config Required'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
