import React from 'react'
import { TrendingUp, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react'

export function ComparisonTable({ trendData, className = '' }) {
  if (!trendData || !trendData.hasPrevious || !trendData.comparison) {
    return (
      <div className={`p-6 rounded-3xl bg-slate-950/60 border border-white/5 text-center text-xs text-slate-400 space-y-2 ${className}`}>
        <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto" />
        <h4 className="font-bold text-white text-sm">NO PREVIOUS SESSION YET</h4>
        <p className="max-w-sm mx-auto">
          Complete another wellness check to see automated side-by-side metric comparison and score differences.
        </p>
      </div>
    )
  }

  const { heartRate, temperature, posture, fatigue } = trendData.comparison
  const diff = trendData.scoreDiff

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase text-slate-400">
          Metric Comparison
        </span>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${
            diff > 0
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : diff < 0
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-slate-800 text-slate-300 border-white/10'
          }`}>
            {trendData.trendDirection} {trendData.trendState} ({diff >= 0 ? `+${diff}` : diff} pts)
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-white/10 text-[10px] text-slate-400 uppercase">
              <th className="py-2.5 px-3">Metric</th>
              <th className="py-2.5 px-3">Previous</th>
              <th className="py-2.5 px-3">Current</th>
              <th className="py-2.5 px-3 text-right">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-300">
            {/* Score */}
            <tr className="bg-white/5 font-bold text-white">
              <td className="py-2.5 px-3 font-sans">Wellness Score</td>
              <td className="py-2.5 px-3">{trendData.previousScore}</td>
              <td className="py-2.5 px-3 text-cyan-300">{trendData.currentScore}</td>
              <td className={`py-2.5 px-3 text-right ${diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {diff >= 0 ? `+${diff}` : diff} pts
              </td>
            </tr>

            {/* Heart Rate */}
            <tr>
              <td className="py-2 px-3 font-sans">Heart Rate</td>
              <td className="py-2 px-3">{heartRate?.previous ? `${heartRate.previous} BPM` : '--'}</td>
              <td className="py-2 px-3 text-white">{heartRate?.current ? `${heartRate.current} BPM` : '--'}</td>
              <td className="py-2 px-3 text-right font-medium">
                {heartRate?.previous && heartRate?.current
                  ? heartRate.current === heartRate.previous
                    ? 'Stable'
                    : `${heartRate.current - heartRate.previous > 0 ? '+' : ''}${heartRate.current - heartRate.previous} BPM`
                  : '--'}
              </td>
            </tr>

            {/* Temperature */}
            <tr>
              <td className="py-2 px-3 font-sans">Temperature</td>
              <td className="py-2 px-3">{temperature?.previous ? `${Number(temperature.previous).toFixed(1)}°C` : '--'}</td>
              <td className="py-2 px-3 text-white">{temperature?.current ? `${Number(temperature.current).toFixed(1)}°C` : '--'}</td>
              <td className="py-2 px-3 text-right font-medium">
                {temperature?.previous && temperature?.current
                  ? Number(temperature.current) === Number(temperature.previous)
                    ? 'Stable'
                    : `${(Number(temperature.current) - Number(temperature.previous)).toFixed(1)}°C`
                  : '--'}
              </td>
            </tr>

            {/* Posture */}
            <tr>
              <td className="py-2 px-3 font-sans">Posture</td>
              <td className="py-2 px-3">{posture?.previous ?? '--'}</td>
              <td className="py-2 px-3 text-white">{posture?.current ?? '--'}</td>
              <td className="py-2 px-3 text-right font-medium">
                {posture?.previous && posture?.current
                  ? posture.previous === posture.current
                    ? 'Stable'
                    : `${posture.previous} → ${posture.current}`
                  : '--'}
              </td>
            </tr>

            {/* Fatigue */}
            <tr>
              <td className="py-2 px-3 font-sans">Fatigue Level</td>
              <td className="py-2 px-3">{fatigue?.previous ?? '--'}</td>
              <td className="py-2 px-3 text-white">{fatigue?.current ?? '--'}</td>
              <td className="py-2 px-3 text-right font-medium">
                {fatigue?.previous && fatigue?.current
                  ? fatigue.previous === fatigue.current
                    ? 'Stable'
                    : `${fatigue.previous} → ${fatigue.current}`
                  : '--'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
