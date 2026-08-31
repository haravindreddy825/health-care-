import React from 'react'
import { Lightbulb, AlertOctagon, Info, Zap, Heart, Thermometer, User, Moon, CheckCircle } from 'lucide-react'

export function Recommendations({ recommendations = [] }) {
  const getCategoryIcon = (cat = '') => {
    const lower = cat.toLowerCase()
    if (lower.includes('cardio') || lower.includes('heart')) return <Heart className="w-4 h-4 text-rose-400" />
    if (lower.includes('thermo') || lower.includes('temp')) return <Thermometer className="w-4 h-4 text-amber-400" />
    if (lower.includes('ergo') || lower.includes('posture')) return <User className="w-4 h-4 text-cyan-400" />
    if (lower.includes('fatigue') || lower.includes('rest') || lower.includes('wellness')) return <Moon className="w-4 h-4 text-purple-400" />
    return <Zap className="w-4 h-4 text-cyan-400" />
  }

  const getPriorityStyle = (priority = 'Medium') => {
    switch (priority) {
      case 'High':
        return 'bg-rose-950/80 border-rose-500/50 text-rose-300'
      case 'Medium':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300'
      default:
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
    }
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Personalized Recommendations</h3>
            <p className="text-[11px] text-slate-400">Adaptive AI Lifestyle & Health Guidance</p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
          {recommendations.length} Active Tip{recommendations.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className="text-xs font-bold text-slate-200 tracking-wide">
                    {item.category || 'General Health'}
                  </span>
                </div>
                <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${getPriorityStyle(item.priority)}`}>
                  {item.priority || 'Medium'} Priority
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-1">
                {item.suggestion}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-2 p-6 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-center text-xs text-slate-500">
            No active recommendations. Begin monitoring to receive tailored guidance.
          </div>
        )}
      </div>
    </div>
  )
}
