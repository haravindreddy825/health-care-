import React from 'react'
import { ShieldCheck, HeartPulse, Activity } from 'lucide-react'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function GlobalFooter() {
  const { setActiveTab } = useSmartMirror()

  return (
    <footer className="w-full max-w-7xl mx-auto px-4 pt-10 pb-6 text-xs text-slate-500 space-y-4 no-print border-t border-white/10 mt-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">
            AuraMirror — AI-Powered Smart Mirror for Personal Health Monitoring
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <button onClick={() => setActiveTab('sensors')} className="hover:text-cyan-300 cursor-pointer">
            Hardware Center
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('history')} className="hover:text-cyan-300 cursor-pointer">
            Session History
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('settings')} className="hover:text-cyan-300 cursor-pointer">
            Privacy & Security
          </button>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-500 font-mono leading-relaxed text-center sm:text-left">
        * Medical Prototype Disclaimer: This Smart Mirror system is an academic engineering prototype designed for wellness screening and lifestyle observation. Its sensor measurements, optical predictions, and rule-based insights are not intended as medical diagnoses or clinical prescriptions and should not replace qualified healthcare advice.
      </div>
    </footer>
  )
}
