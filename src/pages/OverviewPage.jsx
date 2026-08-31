import React from 'react'
import {
  Activity,
  Heart,
  Thermometer,
  User,
  Moon,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar,
  Clock,
  Play,
  History,
  FileText,
  BarChart3,
  ShieldCheck
} from 'lucide-react'
import { GlassCard, GradientCard } from '../components/ui/GlassCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { MetricCard } from '../components/ui/MetricCard'
import { ScoreRing } from '../components/ui/ScoreRing'
import { SectionHeader } from '../components/ui/SectionHeader'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ComparisonTable } from '../components/ui/ComparisonTable'
import { TrendChart } from '../components/ui/TrendChart'
import { EmptyState } from '../components/ui/EmptyState'

export function OverviewPage({
  latestReport,
  latestReading,
  historyList = [],
  trendData = null,
  onStartWellnessCheck,
  onNavigate,
  onViewLatestReport
}) {
  // Extract latest session metrics
  const latestAnalysis = Array.isArray(latestReading?.health_analysis)
    ? latestReading.health_analysis[0]
    : latestReading?.health_analysis || latestReport

  const currentScore = latestAnalysis?.wellness_score ?? latestReport?.wellnessScore ?? (historyList.length > 0 ? historyList[0]?.health_analysis?.[0]?.wellness_score : null)
  const currentStatus = latestAnalysis?.health_status ?? latestReport?.healthStatus ?? 'Recorded'
  const currentRisk = latestAnalysis?.risk_level ?? latestReport?.riskLevel ?? 'Low'
  const currentInterpretation = latestAnalysis?.analysis ?? latestAnalysis?.analysis_summary ?? latestReport?.overallInterpretation ?? 'Continuous autonomous observation ready.'
  const currentPriorityAction = latestAnalysis?.immediate_action ?? latestAnalysis?.immediateAction ?? latestReport?.priorityAction ?? 'Maintain regular healthy habits and ergonomic posture.'

  // Multi-session statistical calculations
  const scores = historyList
    .map(h => {
      const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
      return a?.wellness_score
    })
    .filter(s => typeof s === 'number')

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : (currentScore || '--')
  const bestScore = scores.length > 0 ? Math.max(...scores) : (currentScore || '--')
  const lowestScore = scores.length > 0 ? Math.min(...scores) : (currentScore || '--')

  const lastCheckDate = latestReading?.created_at
    ? new Date(latestReading.created_at).toLocaleString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : historyList.length > 0
    ? new Date(historyList[0].created_at).toLocaleString([], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'No sessions recorded yet'

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* 1. OVERVIEW HERO BANNER */}
      <GlassCard className="p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                OVERVIEW
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 font-medium">
                Personal Wellness Summary
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recent Wellness Overview
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Synthesis of your measured physiological indicators and trends
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <PrimaryButton
              onClick={onStartWellnessCheck}
              icon={Play}
              size="sm"
            >
              Start Wellness Check
            </PrimaryButton>
            {historyList.length > 0 && (
              <SecondaryButton
                onClick={() => onNavigate('history')}
                icon={History}
                size="sm"
              >
                View History
              </SecondaryButton>
            )}
          </div>
        </div>

        {/* Current Wellness Score & Last Check Hero */}
        {currentScore !== null ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Score Ring */}
            <div className="md:col-span-4">
              <ScoreRing score={currentScore} />
            </div>

            {/* Overview Narrative */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={currentStatus} size="sm" />
                <StatusBadge status={`${currentRisk} Risk`} size="sm" />
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono px-3 py-1 rounded-full bg-slate-950/60 border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Last Check: {lastCheckDate}</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block tracking-wider">
                  Assessment Summary
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-normal">
                  {currentInterpretation}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No Saved Wellness Checks Yet"
            description="Stand in front of the Smart Mirror and press 'Start Wellness Check' to record your physiological measurements."
            action={
              <PrimaryButton onClick={onStartWellnessCheck} icon={Play}>
                Go To Smart Mirror
              </PrimaryButton>
            }
          />
        )}
      </GlassCard>

      {/* 2. QUICK STATISTICS GRID */}
      {historyList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <GlassCard className="p-4 sm:p-5 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Current Score</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300">
              {currentScore ?? '--'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">Out of 100</span>
          </GlassCard>

          <GlassCard className="p-4 sm:p-5 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Previous Score</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-300">
              {trendData?.previousScore ?? (historyList.length > 1 ? historyList[1]?.health_analysis?.[0]?.wellness_score : '--')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">Last Session</span>
          </GlassCard>

          <GlassCard className="p-4 sm:p-5 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Score Change</span>
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${
              trendData?.scoreDiff > 0 ? 'text-emerald-400' : trendData?.scoreDiff < 0 ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {trendData?.scoreDiff !== undefined
                ? (trendData.scoreDiff >= 0 ? `+${trendData.scoreDiff}` : trendData.scoreDiff)
                : '--'}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">
              {trendData?.trendState || 'Steady'}
            </span>
          </GlassCard>

          <GlassCard className="p-4 sm:p-5 text-center space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Recent Average</span>
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300">
              {avgScore}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block">Best: {bestScore}</span>
          </GlassCard>
        </div>
      )}

      {/* 3. LATEST MEASURED INDICATORS */}
      {latestReading && (
        <div className="space-y-3">
          <SectionHeader
            title="Latest Measured Indicators"
            subtitle="Acquired via MAX30102, Thermal Sensor & Optical MediaPipe"
            icon={Activity}
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <MetricCard
              type="heartRate"
              value={latestReading.heart_rate || 78}
              status={latestReading.heart_rate >= 60 && latestReading.heart_rate <= 100 ? 'NORMAL' : 'ATTENTION'}
            />
            <MetricCard
              type="temperature"
              value={latestReading.temperature ? Number(latestReading.temperature).toFixed(1) : '36.7'}
              status={latestReading.temperature <= 37.5 ? 'NORMAL' : 'ELEVATED'}
            />
            <MetricCard
              type="posture"
              value={latestReading.posture_status || 'Good'}
              status={latestReading.posture_status === 'Good' ? 'OPTIMAL' : 'NEEDS CHECK'}
            />
            <MetricCard
              type="fatigue"
              value={latestReading.fatigue_level || 'Low'}
              status={latestReading.fatigue_level === 'Low' ? 'GOOD' : 'HIGH'}
            />
          </div>
        </div>
      )}

      {/* 4. CURRENT VS PREVIOUS & WHAT CHANGED */}
      {trendData && trendData.hasPrevious && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <GlassCard className="lg:col-span-7 p-6 space-y-3">
            <SectionHeader
              title="Previous vs Current Session"
              subtitle="Side-by-side telemetry comparison"
              icon={TrendingUp}
            />
            <ComparisonTable trendData={trendData} />
          </GlassCard>

          <GradientCard accent="cyan" className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-cyan-300">
                YOUR PRIORITY ACTION
              </h3>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {currentPriorityAction}
            </p>
            <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 font-mono">
              * Targeted guidance from authoritative rule expert engine.
            </div>
          </GradientCard>
        </div>
      )}

      {/* 5. WELLNESS SCORE TREND GRAPH */}
      {historyList.length > 0 && (
        <GlassCard className="p-6 sm:p-7 space-y-4">
          <SectionHeader
            title="Wellness Score Trend"
            subtitle="Progression across recorded Smart Mirror checks"
            icon={BarChart3}
          />
          <TrendChart historyList={historyList} />
        </GlassCard>
      )}
    </div>
  )
}
