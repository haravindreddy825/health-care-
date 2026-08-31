import React, { useState, useEffect } from 'react'
import { Activity, Clock, ShieldCheck, Wifi, Sparkles, Cpu } from 'lucide-react'
import { isSupabaseConfigured } from '../../lib/supabase'

export function GlobalHeader({
  systemState = 'READY',
  isDemoMode = true,
  onOpenPrivacy = null,
  activePage = 'mirror'
}) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="w-full max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 no-print border-b border-white/10">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/25 font-bold shrink-0">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              SMART MIRROR
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              WELLNESS v2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 font-semibold">
            Personal Health & Physiological Monitor
          </p>
        </div>
      </div>

      {/* Status Bar & Clock */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Hardware / Sensor Telemetry Status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 font-mono text-xs">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">Sensors:</span>
          <span className={`font-bold ${isDemoMode ? 'text-amber-300' : 'text-emerald-300'}`}>
            {isDemoMode ? 'DEMO SENSORS' : 'CONNECTED'}
          </span>
        </div>

        {/* Database Status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 font-mono text-xs">
          <Wifi className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="font-semibold">{isSupabaseConfigured ? 'Cloud Connected' : 'Cloud Offline'}</span>
        </div>

        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-slate-300 font-mono text-xs">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </header>
  )
}
