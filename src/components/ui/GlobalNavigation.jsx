import React from 'react'
import { Camera, LayoutDashboard, History, Brain, ShieldCheck } from 'lucide-react'

export function GlobalNavigation({ activePage = 'mirror', onNavigate }) {
  const tabs = [
    { id: 'mirror', label: 'MIRROR', icon: Camera },
    { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'history', label: 'HISTORY', icon: History },
    { id: 'insights', label: 'INSIGHTS', icon: Brain },
    { id: 'privacy', label: 'PRIVACY', icon: ShieldCheck }
  ]

  return (
    <nav className="w-full max-w-5xl mx-auto flex items-center justify-center p-1.5 rounded-full bg-slate-900/85 backdrop-blur-xl border border-white/10 shadow-xl no-print">
      <div className="flex items-center gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activePage === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-3.5 sm:px-5 py-2 rounded-full font-mono text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
