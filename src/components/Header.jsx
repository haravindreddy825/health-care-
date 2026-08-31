import React, { useState, useEffect } from 'react'
import { Activity, ShieldAlert, Wifi, Sparkles, Clock, Brain } from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabase'

export function Header({ isMonitoring, isAiLoading, aiActive = true }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <header className="w-full glass-panel border-b border-cyan-500/20 py-4 px-6 mb-6 rounded-2xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Title & Branding */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Activity className="w-7 h-7 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                AI Smart Health Mirror
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  MVP v1.0
                </span>
              </h1>
            </div>
            <p className="text-xs md:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Personal Health & Wellness Monitoring • Deterministic Local Engine
            </p>
          </div>
        </div>

        {/* Live Clock & Telemetry Badges */}
        <div className="flex flex-wrap items-center gap-3 self-end md:self-auto">
          {/* Clock */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">
              {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {/* Local Engine Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Local Engine Active</span>
          </div>

          {/* Monitoring Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isMonitoring
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-900/60 border-slate-700 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            {isMonitoring ? 'LIVE MONITORING ACTIVE' : 'MONITORING IDLE'}
          </div>

          {/* Supabase Status Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
            isSupabaseConfigured
              ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
              : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
          }`}>
            <Wifi className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Offline'}</span>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-amber-300/90 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>Disclaimer: This system is a prototype for wellness monitoring and is not a medical diagnostic device.</span>
        </div>
        <div className="hidden sm:block text-slate-500 font-mono text-[10px]">
          Smart Mirror Optical Matrix + Deterministic Rule Engine
        </div>
      </div>
    </header>
  )
}
