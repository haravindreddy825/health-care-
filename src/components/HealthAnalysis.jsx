import React from 'react'
import { FileText, Sparkles, Activity, AlertTriangle, ShieldCheck } from 'lucide-react'

export function HealthAnalysis({
  analysisSummary,
  findings = [],
  healthStatus,
  wellnessScore
}) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Wellness Analysis</h3>
            <p className="text-[11px] text-slate-400">Deterministic Clinical Rule Engine</p>
          </div>
        </div>
      </div>

      {/* Summary Panel */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
            Clinical Assessment Summary
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-normal">
          {analysisSummary || 'Physiological and optical telemetry metrics analyzed successfully.'}
        </p>
      </div>

      {/* Findings List */}
      {findings.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Key Findings:</span>
          <div className="space-y-1">
            {findings.map((f, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                <span className="text-cyan-400">•</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
