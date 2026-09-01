import React from 'react'
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

export function WhatChangedCard({ comparison, className = '' }) {
  if (!comparison) return null

  const { changedItems = [], whatToImprove = [] } = comparison

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${className}`}>
      
      {/* 1. What Changed Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-white/10 space-y-3 font-mono text-xs shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold uppercase tracking-wider text-white font-sans text-sm">
            What Changed Since Last Check?
          </h3>
        </div>

        <ul className="space-y-2 text-slate-200">
          {changedItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-cyan-400 font-bold mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 2. What to Improve Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-white/10 space-y-3 font-mono text-xs shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold uppercase tracking-wider text-white font-sans text-sm">
            Targeted Improvement Focus
          </h3>
        </div>

        <div className="space-y-2">
          {whatToImprove.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-900 border border-white/5 space-y-1"
            >
              <span className="text-[10px] font-bold text-cyan-300 uppercase block">
                {item.category || 'LIFESTYLE'}
              </span>
              <p className="text-slate-300 leading-relaxed font-sans text-xs font-normal">
                {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
