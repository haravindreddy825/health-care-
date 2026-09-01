import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Clock,
  CloudSun,
  Mic,
  MicOff,
  User,
  Cpu,
  Play,
  Activity,
  Heart,
  LayoutDashboard,
  ClipboardCheck,
  History,
  Lightbulb,
  Users,
  Settings,
  ShieldAlert
} from 'lucide-react'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function SmartMirrorNavbar() {
  const {
    activeTab,
    setActiveTab,
    activeProfile,
    weather,
    isVoiceListening,
    toggleVoiceListening,
    isDemoMode,
    setDemoMode,
    startObservationWorkflow,
    mirrorState
  } = useSmartMirror()

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const navItems = [
    { id: 'mirror', label: 'Smart Mirror', icon: Activity },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sensors', label: 'Sensors', icon: Cpu },
    { id: 'analysis', label: 'Analysis', icon: ClipboardCheck },
    { id: 'history', label: 'History', icon: History },
    { id: 'recommendations', label: 'Advice', icon: Lightbulb },
    { id: 'profiles', label: 'Profiles', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const isObserving = mirrorState === 'OBSERVING' || mirrorState === 'COUNTDOWN'

  return (
    <header className="w-full max-w-7xl mx-auto px-4 pt-4 pb-2 space-y-3 no-print">
      {/* Top Banner: Brand, Telemetry Clock, Ambient Weather, Voice & User */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl glass-panel border-white/10 shadow-xl">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-wider">
                AURA<span className="text-cyan-400">MIRROR</span>
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              AI-Powered Personal Health Monitoring System
            </p>
          </div>
        </div>

        {/* Live Clock, Weather, User Badge, Voice Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono">
          
          {/* Digital Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              {currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Ambient Weather */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/70 border border-white/10 text-slate-300">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white">{weather.temperature}°C</span>
            <span className="text-slate-400 hidden md:inline">{weather.condition}</span>
          </div>

          {/* User Profile Badge */}
          <button
            onClick={() => setActiveTab('profiles')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-950/70 hover:bg-slate-900 border border-white/10 text-slate-200 transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-white truncate max-w-[100px]">
              {activeProfile?.name || 'User'}
            </span>
          </button>

          {/* Voice Control Button */}
          <button
            onClick={toggleVoiceListening}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer ${
              isVoiceListening
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 animate-pulse'
                : 'bg-slate-950/70 hover:bg-slate-900 border-white/10 text-slate-300'
            }`}
            title="Toggle Hands-Free Voice Control"
          >
            {isVoiceListening ? <Mic className="w-3.5 h-3.5 text-rose-400" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{isVoiceListening ? 'Listening' : 'Voice'}</span>
          </button>

          {/* Demo Mode Toggle Pill */}
          <button
            onClick={() => setDemoMode(!isDemoMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border transition-all cursor-pointer font-bold ${
              isDemoMode
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20'
                : 'bg-slate-950/70 hover:bg-slate-900 border-white/10 text-slate-400'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isDemoMode ? 'DEMO MODE' : 'HARDWARE'}</span>
          </button>

          {/* Quick Start Check Action */}
          <button
            onClick={() => startObservationWorkflow(10)}
            disabled={isObserving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isObserving ? 'CHECKING...' : 'START CHECK'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <nav className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl glass-panel border-white/10">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}
