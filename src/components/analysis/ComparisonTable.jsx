import React from 'react'
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus, Calendar } from 'lucide-react'

export function ComparisonTable({ comparison, className = '' }) {
  if (!comparison || !comparison.hasPrevious) {
    return (
      <div className={`p-5 rounded-3xl bg-slate-950/60 border border-white/10 text-xs font-mono text-slate-400 space-y-1 text-center ${className}`}>
        <span className="font-bold text-white block">Initial Baseline Record</span>
        <p>This is your first recorded session. Subsequent checks will automatically generate side-by-side metric deltas.</p>
      </div>
    )
  }

  const { comparisonTable, overallTrend, previousScore, currentScore, scoreDelta } = comparison

  const renderDelta = (delta, unit = '') => {
    if (delta == null) return <span className="text-slate-500">--</span>
    if (delta > 0) {
      return (
        <span className="text-emerald-400 font-bold flex items-center gap-0.5">
          <ArrowUpRight className="w-3.5 h-3.5" />
          +{delta}{unit}
        </span>
      )
    }
    if (delta < 0) {
      return (
        <span className="text-cyan-400 font-bold flex items-center gap-0.5">
          <ArrowDownRight className="w-3.5 h-3.5" />
          {delta}{unit}
        </span>
      )
    }
    return (
      <span className="text-slate-400 font-bold flex items-center gap-0.5">
        <Minus className="w-3.5 h-3.5" />
        0{unit}
      </span>
    )
  }

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-cyan-500/30 space-y-4 font-mono text-xs shadow-xl ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold uppercase tracking-wider text-white font-sans text-sm">
            Current vs. Previous Session
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
            overallTrend === 'IMPROVING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            overallTrend === 'NEEDS ATTENTION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            'bg-slate-800 text-slate-300'
          }`}>
            {overallTrend}
          </span>
          {comparisonTable.previousDate && (
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(comparisonTable.previousDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Comparison Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-slate-500 uppercase">
              <th className="pb-2 font-bold">HEALTH PARAMETER</th>
              <th className="pb-2 font-bold">PREVIOUS</th>
              <th className="pb-2 font-bold">CURRENT</th>
              <th className="pb-2 font-bold">CHANGE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            <tr>
              <td className="py-2.5 font-bold text-white">Wellness Score</td>
              <td className="py-2.5 text-slate-400">{previousScore} pts</td>
              <td className="py-2.5 font-bold text-white">{currentScore} pts</td>
              <td className="py-2.5">{renderDelta(scoreDelta, ' pts')}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold">Heart Rate</td>
              <td className="py-2.5 text-slate-400">{comparisonTable.heartRate.previous ? `${comparisonTable.heartRate.previous} BPM` : 'Unavailable'}</td>
              <td className="py-2.5 font-bold">{comparisonTable.heartRate.current ? `${comparisonTable.heartRate.current} BPM` : 'Unavailable'}</td>
              <td className="py-2.5">{renderDelta(comparisonTable.heartRate.delta, ' BPM')}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold">Blood Oxygen (SpO₂)</td>
              <td className="py-2.5 text-slate-400">{comparisonTable.spo2.previous ? `${comparisonTable.spo2.previous}%` : 'Unavailable'}</td>
              <td className="py-2.5 font-bold">{comparisonTable.spo2.current ? `${comparisonTable.spo2.current}%` : 'Unavailable'}</td>
              <td className="py-2.5">{renderDelta(comparisonTable.spo2.delta, '%')}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold">Body Temperature</td>
              <td className="py-2.5 text-slate-400">{comparisonTable.temperature.previous ? `${comparisonTable.temperature.previous}°C` : 'Unavailable'}</td>
              <td className="py-2.5 font-bold">{comparisonTable.temperature.current ? `${comparisonTable.temperature.current}°C` : 'Unavailable'}</td>
              <td className="py-2.5">{renderDelta(comparisonTable.temperature.delta, '°C')}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold">Spinal Posture</td>
              <td className="py-2.5 text-slate-400">{comparisonTable.posture.previous || 'Good'}</td>
              <td className="py-2.5 font-bold">{comparisonTable.posture.current || 'Good'}</td>
              <td className="py-2.5 text-slate-300">{comparisonTable.posture.shift}</td>
            </tr>
            <tr>
              <td className="py-2.5 font-bold">Alertness / Fatigue</td>
              <td className="py-2.5 text-slate-400">{comparisonTable.fatigue.previous || 'Low'}</td>
              <td className="py-2.5 font-bold">{comparisonTable.fatigue.current || 'Low'}</td>
              <td className="py-2.5 text-slate-300">{comparisonTable.fatigue.shift}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
