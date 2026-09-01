import React from 'react'
import {
  X,
  Printer,
  Sparkles,
  Zap,
  Activity,
  Heart,
  Thermometer,
  Ruler,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Volume2
} from 'lucide-react'
import { WellnessScoreGauge } from './WellnessScoreGauge'
import { ComparisonTable } from './ComparisonTable'
import { WhatChangedCard } from './WhatChangedCard'
import { StatusBadge } from '../ui/StatusBadge'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function ReportModal({ isOpen, onClose, report, comparison, profileName }) {
  const { speakReport, returnToMirror } = useSmartMirror()

  if (!isOpen || !report) return null

  const handlePrint = () => {
    window.print()
  }

  const {
    wellnessScore,
    healthStatus,
    riskLevel,
    parameters = [],
    recommendations = [],
    priorityAction,
    summary,
    alerts = [],
    disclaimer
  } = report

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        id="printable-report"
        className="bg-slate-900 border border-cyan-500/30 max-w-4xl w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn text-slate-100 font-mono text-xs my-auto"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                WELLNESS ASSESSMENT REPORT
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-sans">
                Profile: <strong className="text-white">{profileName || 'Active User'}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-sans">
              Smart Mirror Health Assessment
            </h2>
            <p className="text-[11px] text-slate-400">
              Generated on {new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={speakReport}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 cursor-pointer"
              title="Speak Assessment Report Aloud"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Score & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 p-4 rounded-3xl bg-slate-950/70 border border-white/5 flex justify-center">
            <WellnessScoreGauge
              score={wellnessScore}
              healthStatus={healthStatus}
              riskLevel={riskLevel}
            />
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-2">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                ASSESSMENT SUMMARY
              </span>
              <p className="text-slate-200 leading-relaxed font-sans text-xs font-normal">
                {summary}
              </p>
            </div>

            {/* Single Priority Action Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 space-y-1.5">
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

        {/* Telemetry Parameters Grid */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            SESSION TELEMETRY READINGS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {parameters.map((param, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] uppercase font-bold truncate">{param.name}</span>
                  <StatusBadge source={param.source} status={param.status} size="xs" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  {param.reading}
                </div>
                <div className="text-[9px] text-slate-500">
                  Ref: {param.referenceRange}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Same-User Comparison Table & Deltas */}
        {comparison && (
          <div className="space-y-4">
            <ComparisonTable comparison={comparison} />
            <WhatChangedCard comparison={comparison} />
          </div>
        )}

        {/* Categorized Lifestyle Recommendations */}
        {recommendations.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              PERSONALIZED LIFESTYLE GUIDANCE
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1"
                >
                  <span className="text-[10px] font-bold uppercase text-cyan-400 block">
                    {rec.category || 'WELLNESS'}
                  </span>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed font-normal">
                    {rec.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Prototype Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-[10px] text-slate-500 font-mono leading-relaxed">
          {disclaimer}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 no-print">
          <button
            onClick={() => { onClose(); returnToMirror(); }}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Mirror</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
