import React, { useState } from 'react'
import {
  Brain,
  Sparkles,
  TrendingUp,
  Heart,
  Thermometer,
  User,
  Moon,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react'
import { GlassCard, GradientCard } from '../components/ui/GlassCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { SectionHeader } from '../components/ui/SectionHeader'
import { TrendChart } from '../components/ui/TrendChart'
import { EmptyState } from '../components/ui/EmptyState'

export function InsightsPage({
  historyList = [],
  trendData = null,
  latestReport = null,
  latestReading = null
}) {
  const latestAnalysis = Array.isArray(latestReading?.health_analysis)
    ? latestReading.health_analysis[0]
    : latestReading?.health_analysis || latestReport

  // Derive patterns from real data
  const generateDataPatterns = () => {
    if (!historyList || historyList.length === 0) {
      return []
    }

    const patterns = []
    const scores = historyList
      .map(h => {
        const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
        return a?.wellness_score
      })
      .filter(s => typeof s === 'number')

    if (scores.length >= 2) {
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      const diff = scores[0] - scores[1]
      if (diff > 3) {
        patterns.push({
          title: 'IMPROVING SCORE MOMENTUM',
          desc: `Your latest wellness score (${scores[0]}) increased by ${diff} points from your previous check.`,
          type: 'positive'
        })
      } else if (diff < -3) {
        patterns.push({
          title: 'VARIATION DETECTED',
          desc: `Your wellness score lowered by ${Math.abs(diff)} points between your last two sessions.`,
          type: 'attention'
        })
      } else {
        patterns.push({
          title: 'CONSISTENT WELLNESS BASELINE',
          desc: `Your wellness scores show steady stability with an average of ${avg} / 100 across ${scores.length} sessions.`,
          type: 'neutral'
        })
      }
    }

    // Check posture occurrences
    const attentionPostureCount = historyList.filter(h => h.posture_status && h.posture_status !== 'Good').length
    if (attentionPostureCount > 0) {
      patterns.push({
        title: 'POSTURE ALIGNMENT FREQUENCY',
        desc: `Spinal/shoulder adjustments were recommended in ${attentionPostureCount} of your recent ${historyList.length} monitoring sessions.`,
        type: 'attention'
      })
    } else if (historyList.length >= 2) {
      patterns.push({
        title: 'EXCELLENT POSTURE HABITS',
        desc: 'All recent observations recorded optimal upright posture alignment.',
        type: 'positive'
      })
    }

    // Check fatigue
    const highFatigueCount = historyList.filter(h => h.fatigue_level === 'High' || h.fatigue_level === 'Medium').length
    if (highFatigueCount > 0) {
      patterns.push({
        title: 'FATIGUE & BLINK PATTERNS',
        desc: `Elevated blink rate and fatigue indicators were detected in ${highFatigueCount} session(s).`,
        type: 'attention'
      })
    }

    return patterns
  }

  const patterns = generateDataPatterns()

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* 1. HEADER BANNER */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-300 bg-violet-500/15 px-3 py-0.5 rounded-full border border-violet-500/30">
                AI INSIGHTS & TRENDS
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 font-medium">
                Autonomous Pattern Synthesis
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Wellness Insights & Guidance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Longitudinal analysis and pattern detection derived from your saved sessions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              Deterministic Pattern Engine
            </span>
          </div>
        </div>

        {/* Synthesis Summary */}
        {latestAnalysis?.analysis ? (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Latest Session Synthesis:</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {latestAnalysis.analysis || latestAnalysis.ai_summary}
            </p>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1 text-xs text-slate-400">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Pattern Detection:</span>
            <p>Complete consecutive wellness checks to unlock multi-session pattern insights.</p>
          </div>
        )}
      </GlassCard>

      {/* 2. RECENT WELLNESS PATTERNS */}
      <div className="space-y-3">
        <SectionHeader
          title="Recent Wellness Patterns"
          subtitle="Identified across your recorded timeline"
          icon={Sparkles}
        />

        {patterns.length === 0 ? (
          <EmptyState
            title="Patterns Pending"
            description="Complete more wellness checks to generate meaningful longitudinal trends."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patterns.map((pat, idx) => (
              <GlassCard key={idx} className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                    {pat.title}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    pat.type === 'positive' ? 'bg-emerald-400' : pat.type === 'attention' ? 'bg-amber-400' : 'bg-cyan-400'
                  }`} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pat.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* 3. METRIC TREND TABS */}
      {historyList.length > 0 && (
        <GlassCard className="p-6 sm:p-7 space-y-4">
          <SectionHeader
            title="Telemetry Metric Trends"
            subtitle="Interactive trend graphs for Score, Heart Rate & Temperature"
            icon={TrendingUp}
          />
          <TrendChart historyList={historyList} />
        </GlassCard>
      )}

      {/* 4. WHAT CAN I IMPROVE & YOUR WELLNESS PLAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* What Can I Improve */}
        <GlassCard className="lg:col-span-7 p-6 space-y-4">
          <SectionHeader
            title="What Can I Improve?"
            subtitle="Targeted advice for non-optimal readings"
            icon={CheckCircle2}
          />

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="font-mono text-cyan-300 font-bold uppercase text-[11px] block">
                POSTURE & ERGONOMICS
              </span>
              <p className="text-slate-300 leading-relaxed">
                Maintain an upright cervical spine alignment and keep your shoulders relaxed while sitting or standing in front of screens.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="font-mono text-cyan-300 font-bold uppercase text-[11px] block">
                FATIGUE & SCREEN BREAKS
              </span>
              <p className="text-slate-300 leading-relaxed">
                Apply the 20-20-20 rule: every 20 minutes, look at an object 20 feet away for 20 seconds to reduce ocular strain.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="font-mono text-cyan-300 font-bold uppercase text-[11px] block">
                CARDIOVASCULAR RELAXATION
              </span>
              <p className="text-slate-300 leading-relaxed">
                Practice 2 minutes of calm diaphragmatic breathing to stabilize resting heart rate.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Your Wellness Plan */}
        <GradientCard accent="emerald" className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-emerald-300">
              YOUR WELLNESS PLAN
            </h3>
          </div>

          <div className="space-y-2 text-xs text-slate-200">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">TODAY</span>
            <div className="space-y-1.5 pl-1">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Maintain comfortable upright posture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Take regular 5-minute rest breaks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Stay adequately hydrated throughout the day</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">NEXT CHECK</span>
            <p className="text-[11px] text-slate-400">
              Repeat your Smart Mirror observation session when convenient to record your next comparative data point.
            </p>
          </div>
        </GradientCard>
      </div>
    </div>
  )
}
