import React from 'react'
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Moon,
  Activity,
  Heart,
  UserCheck,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useSmartMirror } from '../context/SmartMirrorContext'

export function RecommendationsPage() {
  const { latestReport, activeProfile } = useSmartMirror()

  const alerts = latestReport?.alerts || []
  const recommendations = latestReport?.recommendations || []

  const generalHabits = [
    {
      category: 'HYDRATION',
      icon: Droplets,
      color: 'text-cyan-400',
      title: 'Target Daily Fluid Intake',
      desc: 'Aim for 2.5L to 3.0L of water daily. Staying properly hydrated helps stabilize cardiovascular hemodynamics and resting pulse rate.'
    },
    {
      category: 'ERGONOMICS',
      icon: UserCheck,
      color: 'text-emerald-400',
      title: 'Display Eye-Level Alignment',
      desc: 'Position your primary workstation display so the top third of the screen is at eye level to prevent cervical vertebrae strain.'
    },
    {
      category: 'RECOVERY',
      icon: Moon,
      color: 'text-violet-400',
      title: 'Circadian Sleep Rhythm',
      desc: 'Maintain a consistent 7.5 to 8.5 hour sleep window. Dim ambient blue lighting 60 minutes prior to bedtime.'
    },
    {
      category: 'ACTIVITY',
      icon: Activity,
      color: 'text-amber-400',
      title: 'Hourly Postural Resets',
      desc: 'Stand up and perform 60 seconds of gentle shoulder blade retractions every hour during extended desk tasks.'
    }
  ]

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30">
                PERSONALIZED LIFESTYLE & ALERTS
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                Profile: <strong className="text-white">{activeProfile?.name}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Guidance, Action Points & Alerts
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
              Dynamically derived from your active physical readings and computer-vision assessments
            </p>
          </div>
        </div>

        {/* Priority Action Highlight */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 space-y-1.5 shadow-xl">
          <div className="flex items-center gap-2 text-cyan-300 font-bold">
            <Zap className="w-4 h-4 text-cyan-400 fill-current" />
            <span>SESSION PRIORITY ACTION:</span>
          </div>
          <p className="text-sm font-semibold text-white font-sans leading-relaxed">
            {latestReport?.priorityAction || 'Continue your regular healthy lifestyle routine and stay hydrated throughout the day.'}
          </p>
        </div>
      </div>

      {/* 2. Active Health Alerts (if any) */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2 font-sans">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>ACTIVE HEALTH ALERTS ({alerts.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-rose-950/30 border border-rose-500/40 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase font-sans flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    {alert.metric} Alert
                  </span>
                  <StatusBadge status={alert.severity} size="xs" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase">Reason:</span>
                  <p className="text-slate-200 font-sans font-normal">{alert.reason} ({alert.reading})</p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/80 border border-rose-500/20 space-y-0.5">
                  <span className="text-[10px] font-bold text-rose-300 uppercase">Recommended Action:</span>
                  <p className="text-xs text-white font-sans font-semibold">{alert.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Dynamic Session-Generated Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-sans">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span>SESSION-DERIVED RECOMMENDATIONS</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl glass-panel border-white/10 space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase">{rec.category}</span>
                  <span className="text-[10px] text-slate-500 font-bold">Priority: {rec.priority}</span>
                </div>
                {rec.title && (
                  <h4 className="text-sm font-bold text-white font-sans">{rec.title}</h4>
                )}
                <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Foundational Wellness Pillars */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>FOUNDATIONAL WELLNESS PROTOCOLS</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {generalHabits.map((habit, idx) => {
            const Icon = habit.icon
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl glass-panel border-white/10 space-y-2.5 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className={`w-9 h-9 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center ${habit.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {habit.category}
                  </span>
                  <h4 className="text-sm font-bold text-white font-sans">{habit.title}</h4>
                  <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">{habit.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
