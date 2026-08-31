import React, { useState, useEffect } from 'react'
import { Activity, Clock, ShieldCheck, Play, Sparkles, Cpu, Layers, History, Brain, LayoutDashboard } from 'lucide-react'

export function SmartMirrorNavbar({
  activeTab = 'mirror',
  onTabChange,
  onStartHealthCheck,
  isObserving = false
}) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const tabs = [
    { id: 'mirror', label: 'Smart Mirror', icon: Activity },
    { id: 'dashboard', label: 'Health Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Session History', icon: History },
    { id: 'insights', label: 'AI Expert Insights', icon: Brain },
    { id: 'privacy', label: 'Privacy & Security', icon: ShieldCheck }
  ]

  return (
    <header className="sticky top-3 z-50 w-full max-w-6xl mx-auto px-4 no-print">
      <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-[28px] px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl">
        
        {/* Brand & System Title */}
        <div
          onClick={() => onTabChange('mirror')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                AI SMART MIRROR
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                PRO v3.0
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-semibold">
              Personal Health Monitoring & Recommendations
            </span>
          </div>
        </div>

        {/* Tab Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-2xl border border-white/5 font-mono text-xs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all font-semibold flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Live Clock & Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/70 border border-white/5 text-xs font-mono text-cyan-300 font-semibold">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <button
            onClick={onStartHealthCheck}
            disabled={isObserving}
            className={`px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer ${
              isObserving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Check Now</span>
          </button>
        </div>
      </div>
    </header>
  )
}
