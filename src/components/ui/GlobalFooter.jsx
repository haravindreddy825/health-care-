import React from 'react'
import { Shield, AlertOctagon } from 'lucide-react'

export function GlobalFooter({ onOpenPrivacy }) {
  return (
    <footer className="w-full max-w-5xl mx-auto pt-6 text-xs text-slate-500 no-print space-y-2 border-t border-white/10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>AI-Powered Smart Mirror • Educational Wellness-Monitoring Prototype</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px]">
          <button
            onClick={onOpenPrivacy}
            className="hover:text-cyan-300 transition-colors underline cursor-pointer"
          >
            Privacy & Protections
          </button>
          <span>•</span>
          <span className="text-slate-500">Autonomous Continuity Engine</span>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 leading-relaxed text-center sm:text-left">
        * This Smart Mirror is an educational prototype. Its measurements and AI insights are not medical diagnoses and should not replace professional medical advice.
      </p>
    </footer>
  )
}
