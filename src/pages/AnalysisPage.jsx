import React, { useState } from 'react'
import {
  ClipboardCheck,
  Zap,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Play,
  RotateCcw,
  Volume2
} from 'lucide-react'
import { WellnessScoreGauge } from '../components/analysis/WellnessScoreGauge'
import { ComparisonTable } from '../components/analysis/ComparisonTable'
import { WhatChangedCard } from '../components/analysis/WhatChangedCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ReportModal } from '../components/analysis/ReportModal'
import { useSmartMirror } from '../context/SmartMirrorContext'

export function AnalysisPage() {
  const {
    latestReport,
    latestComparison,
    activeProfile,
    startObservationWorkflow,
    speakReport
  } = useSmartMirror()

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)

  if (!latestReport) {
    return (
      <div className="w-full max-w-5xl mx-auto p-12 rounded-[36px] glass-panel border-white/10 text-center space-y-4 font-mono text-xs animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-sans">No Assessment Session Generated Yet</h2>
          <p className="text-slate-400 font-sans font-normal">
            Run a wellness check from the Smart Mirror view or click the button below to generate a detailed report.
          </p>
        </div>
        <button
          onClick={() => startObservationWorkflow(10)}
          className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Wellness Check</span>
        </button>
      </div>
    )
  }

  const {
    wellnessScore,
    healthStatus,
    riskLevel,
    parameters = [],
    recommendations = [],
    deductions = [],
    positiveFactors = [],
    attentionFactors = [],
    priorityAction,
    summary,
    disclaimer
  } = latestReport

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                CLINICAL ANALYSIS & COMPARISON
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                Profile: <strong className="text-white">{activeProfile?.name}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Session Assessment & Same-User Deltas
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
              Evaluating available physical sensors and computer vision landmarks against reference baselines
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={speakReport}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-cyan-400 cursor-pointer"
              title="Speak Assessment Aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Full Report / Print</span>
            </button>
          </div>
        </div>

        {/* Hero Score Gauge & Priority Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-950/70 border border-white/5 flex justify-center shadow-xl">
            <WellnessScoreGauge
              score={wellnessScore}
              healthStatus={healthStatus}
              riskLevel={riskLevel}
            />
          </div>

          <div className="lg:col-span-8 space-y-4">
            {/* Assessment Narrative */}
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                ASSESSMENT NARRATIVE
              </span>
              <p className="text-slate-200 leading-relaxed font-sans text-xs font-normal">
                {summary}
              </p>
            </div>

            {/* Priority Action */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/80 to-slate-900 border border-cyan-500/40 space-y-1.5 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Zap className="w-4 h-4 text-cyan-400 fill-current" />
                <span className="text-xs uppercase">YOUR PRIORITY ACTION:</span>
              </div>
              <p className="text-sm font-semibold text-white font-sans leading-relaxed">
                {priorityAction}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Same-User Previous Session Comparison Table & What Changed */}
      {latestComparison && (
        <div className="space-y-4">
          <ComparisonTable comparison={latestComparison} />
          <WhatChangedCard comparison={latestComparison} />
        </div>
      )}

      {/* 3. Deductions Breakdown (Transparency Engine) */}
      <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>SCORE DEDUCTION & TRANSPARENCY BREAKDOWN</span>
        </h3>

        {deductions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Optimal Baseline: No point deductions were triggered across your active sensor readings.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deductions.map((d, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>{d.metric}</span>
                  <span>-{d.deduction} pts</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans font-normal">{d.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Categorized Lifestyle Guidance */}
      {recommendations.length > 0 && (
        <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>PERSONALIZED LIFESTYLE SUGGESTIONS</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[10px] font-bold uppercase text-cyan-400 block">{rec.category}</span>
                <p className="text-xs text-slate-200 font-sans leading-relaxed font-normal">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-[10px] text-slate-500 leading-relaxed">
        {disclaimer}
      </div>

      {/* Full Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={latestReport}
        comparison={latestComparison}
        profileName={activeProfile?.name}
      />
    </div>
  )
}
