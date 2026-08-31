import React from 'react'
import { Activity, Sparkles, ShoppingBag, ShieldCheck, Cpu, ArrowRight } from 'lucide-react'

export function AuraNavbar({
  activeTab = 'mirror',
  onTabChange,
  onOpenPreorder,
  isLiveMonitoring = false
}) {
  const navLinks = [
    { id: 'mirror', label: 'Live Mirror' },
    { id: 'features', label: 'Sensors & Tech' },
    { id: 'aicore', label: 'AI Core' },
    { id: 'briefing', label: 'Daily Briefing' },
    { id: 'history', label: 'History' },
    { id: 'privacy', label: 'Privacy' }
  ]

  return (
    <header className="sticky top-4 z-50 w-full max-w-6xl mx-auto px-4 no-print">
      <div className="aura-glass rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl transition-all duration-300">
        
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange('mirror')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#89ceff] via-[#4edea3] to-[#b6c7eb] p-[1px] shadow-lg shadow-[#89ceff]/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#0b0f10] flex items-center justify-center">
              <Activity className="w-4 h-4 text-[#89ceff] animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              AuraMirror
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping" />
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#89ceff] uppercase font-semibold">
              Medical-Grade OS
            </span>
          </div>
        </div>

        {/* Desktop Nav Anchors */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0b0f10]/60 p-1 rounded-full border border-white/5 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 font-semibold cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#89ceff]/20 to-[#4edea3]/20 text-white border border-[#89ceff]/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            )
          })}
        </nav>

        {/* Pre-order & Mirror CTA */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onTabChange('mirror')}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === 'mirror'
                ? 'bg-[#89ceff]/15 text-[#89ceff] border-[#89ceff]/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
            <span>Launch Mirror</span>
          </button>

          <button
            onClick={onOpenPreorder}
            className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#89ceff] to-[#4edea3] hover:from-[#89ceff]/90 hover:to-[#4edea3]/90 text-[#0b0f10] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#89ceff]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Pre-order</span>
          </button>
        </div>
      </div>
    </header>
  )
}
