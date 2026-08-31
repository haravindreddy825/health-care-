import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Heart,
  Thermometer,
  User,
  Moon,
  FileText,
  History,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'

export function WellnessTrendComparison({
  trendData,
  historyList = [],
  currentProfile = 'User 001'
}) {
  const [selectedHistoricalRecord, setSelectedHistoricalRecord] = useState(null)

  const {
    hasPrevious = false,
    previousScore,
    currentScore,
    scoreDiff = 0,
    trendState = 'Stable',
    trendDirection = '→',
    message = '',
    comparison = {}
  } = trendData || {}

  return (
    <div className="space-y-4 no-print">
      {/* 1. WELLNESS SCORE TREND & COMPARISON CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                Wellness Score Trend & Comparison
              </h3>
              <p className="text-[11px] text-slate-500">
                Session history analysis for {currentProfile}
              </p>
            </div>
          </div>

          {hasPrevious && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border flex items-center gap-1 ${
              trendState === 'Improving'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : trendState === 'Needs Attention'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}>
              <span>{trendDirection}</span>
              <span>{trendState}</span>
            </span>
          )}
        </div>

        {hasPrevious ? (
          <div className="space-y-4">
            {/* Score Comparison Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 items-center text-center">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Previous Score</span>
                <span className="text-2xl font-bold font-mono text-slate-600">{previousScore}</span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-100/60 px-2 py-0.5 rounded-full border border-cyan-200">
                  {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} pts
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 my-1 hidden sm:block" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Current Score</span>
                <span className={`text-3xl font-extrabold font-mono ${
                  currentScore >= 80 ? 'text-emerald-600' : currentScore >= 60 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {currentScore}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
              {message}
            </p>

            {/* Parameter Delta Comparison Table */}
            {comparison && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase bg-slate-50/60">
                      <th className="py-2 px-3">Metric</th>
                      <th className="py-2 px-3">Previous Session</th>
                      <th className="py-2 px-3">Current Session</th>
                      <th className="py-2 px-3 text-right">Observation Change</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-2 px-3 font-semibold font-sans">Heart Rate</td>
                      <td className="py-2 px-3">{comparison.heartRate?.previous ?? '--'} BPM</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{comparison.heartRate?.current ?? '--'} BPM</td>
                      <td className="py-2 px-3 text-right">
                        {comparison.heartRate?.previous && comparison.heartRate?.current ? (
                          <span>{comparison.heartRate.previous} → {comparison.heartRate.current} BPM</span>
                        ) : '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold font-sans">Temperature</td>
                      <td className="py-2 px-3">{comparison.temperature?.previous ? `${Number(comparison.temperature.previous).toFixed(1)}°C` : '--'}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{comparison.temperature?.current ? `${Number(comparison.temperature.current).toFixed(1)}°C` : '--'}</td>
                      <td className="py-2 px-3 text-right">
                        {comparison.temperature?.previous && comparison.temperature?.current ? (
                          <span>{Number(comparison.temperature.previous).toFixed(1)}°C → {Number(comparison.temperature.current).toFixed(1)}°C</span>
                        ) : '--'}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold font-sans">Posture</td>
                      <td className="py-2 px-3">{comparison.posture?.previous ?? '--'}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{comparison.posture?.current ?? '--'}</td>
                      <td className="py-2 px-3 text-right">
                        {comparison.posture?.previous} → {comparison.posture?.current}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-semibold font-sans">Fatigue Level</td>
                      <td className="py-2 px-3">{comparison.fatigue?.previous ?? '--'}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{comparison.fatigue?.current ?? '--'}</td>
                      <td className="py-2 px-3 text-right">
                        {comparison.fatigue?.previous} → {comparison.fatigue?.current}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-1">
            <Sparkles className="w-5 h-5 text-cyan-600 mx-auto" />
            <p className="font-semibold text-slate-700">First wellness session recorded for {currentProfile}.</p>
            <p className="text-[11px] text-slate-400">
              Future observations will automatically compare trends against this baseline assessment.
            </p>
          </div>
        )}
      </div>

      {/* 2. PREVIOUS WELLNESS REPORTS FOR THIS PROFILE */}
      {historyList && historyList.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-700" />
              Previous Wellness Reports ({historyList.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Profile: {currentProfile}</span>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {historyList.map((rec) => {
              const analysis = Array.isArray(rec.health_analysis) ? rec.health_analysis[0] : rec.health_analysis
              const dateStr = new Date(rec.created_at).toLocaleString([], {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })

              return (
                <div
                  key={rec.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-cyan-300 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="font-bold text-slate-900">{analysis?.wellness_score ?? '--'}</span>
                      <span className="text-[7px] text-slate-400 uppercase">SCORE</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800 font-sans">{dateStr}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 text-slate-700 font-mono">
                          {analysis?.health_status || 'Recorded'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-3 mt-0.5">
                        <span>HR: {rec.heart_rate} BPM</span>
                        <span>Temp: {rec.temperature}°C</span>
                        <span>Posture: {rec.posture_status}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedHistoricalRecord({ record: rec, analysis, dateStr })}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-600" />
                    <span>VIEW REPORT</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Historical Report Modal */}
      {selectedHistoricalRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedHistoricalRecord(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono text-cyan-700 uppercase font-bold tracking-wider">
                HISTORICAL WELLNESS REPORT
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                Session: {selectedHistoricalRecord.dateStr}
              </h3>
              <p className="text-xs text-slate-400 font-mono">ID: {selectedHistoricalRecord.record.id}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">WELLNESS SCORE</span>
                <span className="text-2xl font-bold text-slate-900">{selectedHistoricalRecord.analysis?.wellness_score} / 100</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">STATUS</span>
                <span className="text-base font-bold text-slate-800">{selectedHistoricalRecord.analysis?.health_status}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] block">RISK</span>
                <span className="text-base font-bold text-slate-800">{selectedHistoricalRecord.analysis?.risk_level}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">Assessment Narrative:</p>
              <p>{selectedHistoricalRecord.analysis?.analysis}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedHistoricalRecord(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
