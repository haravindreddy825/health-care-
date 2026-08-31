import React from 'react'
import { Sparkles, TrendingUp, CheckCircle2, Heart, Thermometer, User, Moon, Zap, Shield, Activity } from 'lucide-react'

export function AIInsightsView({
  historyList = [],
  trendData,
  latestReport
}) {
  const score = latestReport?.wellnessScore ?? (historyList[0]?.health_analysis?.[0]?.wellness_score || 85)

  // Derive patterns purely from stored session data
  const patterns = []
  if (historyList.length >= 2) {
    const scores = historyList.map(h => {
      const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
      return a?.wellness_score
    }).filter(s => typeof s === 'number')

    if (scores.length >= 2) {
      const diff = scores[0] - scores[1]
      if (diff > 3) {
        patterns.push({
          title: 'Positive Score Momentum',
          desc: `Your wellness score improved by +${diff} points from your previous monitoring check.`,
          type: 'positive'
        })
      } else if (diff < -3) {
        patterns.push({
          title: 'Mild Variance Detected',
          desc: `Your wellness score decreased by ${Math.abs(diff)} points between your last two sessions.`,
          type: 'attention'
        })
      } else {
        patterns.push({
          title: 'Consistent Physiological Baseline',
          desc: `Your wellness score has remained stable across recent sessions (${scores[0]} / 100).`,
          type: 'positive'
        })
      }
    }

    const postureIssues = historyList.filter(h => h.posture_status && h.posture_status !== 'Good').length
    if (postureIssues > 0) {
      patterns.push({
        title: 'Common Attention Area',
        desc: `Posture alignment was noted in ${postureIssues} of your recent ${historyList.length} monitoring sessions.`,
        type: 'attention'
      })
    } else {
      patterns.push({
        title: 'Optimal Posture Habits',
        desc: 'All recent monitoring sessions recorded upright spinal posture alignment.',
        type: 'positive'
      })
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/15 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                WELLNESS INSIGHTS
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                Pattern Recognition Engine
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Wellness Insights
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Longitudinal pattern detection and restorative lifestyle guidance synthesized from your stored sessions
            </p>
          </div>
        </div>

        {/* Local Assessment Synthesis */}
        <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>SESSION INTERPRETATION:</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {latestReport?.overallInterpretation || 'Complete regular Smart Mirror checks to unlock longitudinal multi-session trend predictions.'}
          </p>
        </div>
      </div>

      {/* Identified Historical Patterns */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          SESSION-DERIVED PATTERNS
        </h3>

        {patterns.length === 0 ? (
          <div className="p-6 rounded-3xl glass-panel text-center space-y-1 text-xs text-slate-400">
            <span className="font-bold text-white block">Pattern Engine Active</span>
            <p>Complete 2 or more checks to populate automated multi-session trends.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((pat, idx) => (
              <div key={idx} className="p-5 rounded-3xl glass-panel space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-cyan-300">{pat.title}</span>
                  <span className={`w-2 h-2 rounded-full ${pat.type === 'positive' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{pat.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Wellness Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            TODAY'S WELLNESS PLAN
          </h3>
          <div className="space-y-2 text-xs text-slate-200">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-emerald-400">✓</span>
              <span>Maintain upright cervical spine alignment in front of screens</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-emerald-400">✓</span>
              <span>Hydrate with fresh water (aim for 2.5L daily baseline)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-white/5">
              <span className="text-emerald-400">✓</span>
              <span>Engage in 2 minutes of calming diaphragmatic breathing</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-tr from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/40 space-y-3 shadow-xl">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 fill-current" />
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-cyan-300">
              NEXT MONITORING RECOMMENDATION
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Perform your next check later today or tomorrow morning. Repeating observations at similar times helps establish your true resting physiological baseline.
          </p>
        </div>
      </div>
    </div>
  )
}
