import React, { useRef } from 'react'
import {
  FileText,
  Printer,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Brain,
  Zap,
  Activity,
  Heart,
  Thermometer,
  User,
  Moon,
  Eye,
  CheckCircle2,
  Clock,
  Fingerprint,
  Calendar,
  Layers,
  ChevronRight,
  ListChecks
} from 'lucide-react'

export function HealthTestReport({
  reportData,
  aiInsights,
  isAiLoading,
  isDemoMode = true,
  isMonitoring = false,
  sessionId = 'SMR-SESSION-001',
  onReanalyze
}) {
  const {
    wellnessScore = 85,
    healthStatus = 'Healthy',
    riskLevel = 'Low',
    overallInterpretation = '',
    priorityAction = '',
    parameters = [],
    scoreDeductions = { baseScore: 100, heartRate: 0, temperature: 0, posture: 0, fatigue: 0, finalScore: 85 },
    warnings = [],
    recommendations = [],
    disclaimer = ''
  } = reportData || {}

  const handlePrint = () => {
    window.print()
  }

  // Helper for Status Badge styling
  const getStatusBadgeClass = (status = 'NORMAL') => {
    switch (status) {
      case 'NORMAL':
      case 'GOOD':
      case 'DETECTED':
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
      case 'ATTENTION':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300'
      case 'WARNING':
        return 'bg-rose-950/80 border-rose-500/50 text-rose-300'
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300'
    }
  }

  // Helper for Priority Badge
  const getPriorityBadgeClass = (priority = 'Medium') => {
    switch (priority) {
      case 'High':
        return 'bg-rose-950/80 border-rose-500/50 text-rose-300'
      case 'Medium':
        return 'bg-amber-950/80 border-amber-500/50 text-amber-300'
      default:
        return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
    }
  }

  // Category Icon
  const getCategoryIcon = (category = '') => {
    const cat = category.toUpperCase()
    if (cat.includes('CARDIO')) return <Heart className="w-4 h-4 text-rose-400" />
    if (cat.includes('THERMO')) return <Thermometer className="w-4 h-4 text-amber-400" />
    if (cat.includes('POSTURE') || cat.includes('ERGO')) return <User className="w-4 h-4 text-cyan-400" />
    if (cat.includes('REST') || cat.includes('FATIGUE')) return <Moon className="w-4 h-4 text-purple-400" />
    return <Sparkles className="w-4 h-4 text-cyan-400" />
  }

  // Categorize recommendations
  const mergedRecommendations = (aiInsights?.recommendations?.length ? aiInsights.recommendations : recommendations) || []
  const groupedRecommendations = mergedRecommendations.reduce((acc, rec) => {
    const cat = rec.category ? rec.category.toUpperCase() : 'GENERAL WELLNESS'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(rec)
    return acc
  }, {})

  const nowFormatted = new Date().toLocaleString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <div className="space-y-6 print:space-y-4 print:text-black" id="printable-report">
      {/* 1. REPORT HEADER & ACTIONS */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-2xl relative overflow-hidden print:border-black print:bg-white print:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:border-black">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-extrabold print:text-black">
                SMART MIRROR
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400 print:text-slate-700">
                HEALTH MONITORING REPORT
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white print:text-black">
              PERSONAL WELLNESS ASSESSMENT REPORT
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 print:text-slate-600">
              Comprehensive physiological and ergonomic telemetry analysis
            </p>
          </div>

          {/* Print / Export Action */}
          <div className="flex items-center gap-3 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md hover:shadow-cyan-500/20"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print / Export Report</span>
            </button>
          </div>
        </div>

        {/* Session Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-gray-100 print:border-gray-300">
            <span className="text-[10px] text-slate-500 block uppercase">Session Date & Time</span>
            <span className="text-slate-200 font-semibold print:text-black">{nowFormatted}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-gray-100 print:border-gray-300">
            <span className="text-[10px] text-slate-500 block uppercase">Session ID</span>
            <span className="text-cyan-300 font-semibold print:text-black">{sessionId}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-gray-100 print:border-gray-300">
            <span className="text-[10px] text-slate-500 block uppercase">Monitoring Mode</span>
            <span className={`font-semibold ${isDemoMode ? 'text-amber-400' : 'text-emerald-400'} print:text-black`}>
              {isDemoMode ? 'Demo Sensor Mode' : 'Live Optical Monitoring'}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-gray-100 print:border-gray-300">
            <span className="text-[10px] text-slate-500 block uppercase">Analysis Engine</span>
            <span className="text-cyan-300 font-semibold print:text-black">
              Deterministic Rule Engine
            </span>
          </div>
        </div>
      </div>

      {/* 2. OVERALL WELLNESS RESULT */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4 print:border-black print:bg-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-black">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2 print:text-black">
            <Activity className="w-4 h-4 text-cyan-400" />
            OVERALL WELLNESS RESULT
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(healthStatus === 'Healthy' ? 'NORMAL' : healthStatus === 'Needs Attention' ? 'ATTENTION' : 'WARNING')} print:text-black`}>
              Status: {healthStatus}
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs font-mono font-semibold bg-slate-900 border border-slate-700 text-slate-300 print:text-black">
              Risk: {riskLevel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Score Display */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center print:bg-gray-100 print:border-gray-300">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              AUTHORITATIVE WELLNESS SCORE
            </span>
            <div className="my-2 flex items-baseline justify-center gap-1">
              <span className={`text-5xl font-extrabold font-mono tracking-tight ${
                wellnessScore >= 80 ? 'text-emerald-400' : wellnessScore >= 60 ? 'text-amber-400' : 'text-rose-400'
              } print:text-black`}>
                {wellnessScore}
              </span>
              <span className="text-base text-slate-500 font-bold">/ 100</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {wellnessScore >= 80 ? 'Optimal Reference Balance' : wellnessScore >= 60 ? 'Moderate Physiological Variation' : 'Elevated Strain Detected'}
            </span>
          </div>

          {/* Overall Interpretation Narrative */}
          <div className="md:col-span-8 space-y-2">
            <h4 className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold print:text-black">
              Overall Interpretation:
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-900/60 p-4 rounded-xl border border-slate-800 print:bg-white print:text-black print:border-gray-200">
              {overallInterpretation}
            </p>
          </div>
        </div>
      </div>

      {/* 3. VITAL / HEALTH INDICATORS TABLE */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4 print:border-black print:bg-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-black">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2 print:text-black">
            <ListChecks className="w-4 h-4 text-cyan-400" />
            VITAL & BIOMARKER HEALTH INDICATORS
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {parameters.length} Key Parameters Monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-950/60 print:bg-gray-200 print:text-black">
                <th className="py-3 px-4 rounded-l-lg">Parameter</th>
                <th className="py-3 px-4">Current Reading</th>
                <th className="py-3 px-4">Reference / Expected Range</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono print:divide-gray-200">
              {parameters.map((param, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-200 font-sans flex items-center gap-2 print:text-black">
                    {param.name === 'Heart Rate' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
                    {param.name === 'Temperature' && <Thermometer className="w-3.5 h-3.5 text-amber-400" />}
                    {param.name === 'Posture' && <User className="w-3.5 h-3.5 text-cyan-400" />}
                    {param.name === 'Fatigue' && <Moon className="w-3.5 h-3.5 text-purple-400" />}
                    {param.name === 'Face Detection' && <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{param.name}</span>
                  </td>
                  <td className="py-3 px-4 text-white font-bold print:text-black">
                    {param.reading}
                  </td>
                  <td className="py-3 px-4 text-slate-400 print:text-slate-700">
                    {param.referenceRange}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(param.status)} print:text-black`}>
                      {param.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. INDIVIDUAL PARAMETER ANALYSIS & 5. SCORE BREAKDOWN (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Detailed Health Indicator Analysis (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-3.5 print:border-black print:bg-white">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2 print:text-black">
            <Layers className="w-4 h-4 text-cyan-400" />
            DETAILED HEALTH INDICATOR ANALYSIS
          </h3>

          <div className="space-y-3">
            {parameters.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 print:bg-gray-50 print:border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 font-sans print:text-black">{p.name}:</span>
                    <span className="font-mono text-cyan-300 font-bold print:text-black">{p.reading}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-mono rounded font-bold border ${getStatusBadgeClass(p.status)} print:text-black`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed print:text-slate-800">
                  {p.interpretation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Score Breakdown (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4 print:border-black print:bg-white flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2 print:text-black">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              WELLNESS SCORE BREAKDOWN
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 mb-3">
              Deterministic rule deductions applied from baseline 100:
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-200">
                <span className="text-slate-300 print:text-black">Base Starting Score</span>
                <span className="text-slate-200 font-bold print:text-black">100</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-200">
                <span className="text-slate-300 print:text-black">Heart Rate Adjustment</span>
                <span className={scoreDeductions.heartRate > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                  -{scoreDeductions.heartRate}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-200">
                <span className="text-slate-300 print:text-black">Temperature Adjustment</span>
                <span className={scoreDeductions.temperature > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                  -{scoreDeductions.temperature}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-200">
                <span className="text-slate-300 print:text-black">Posture Alignment</span>
                <span className={scoreDeductions.posture > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                  -{scoreDeductions.posture}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950/60 border border-slate-800 print:bg-white print:border-gray-200">
                <span className="text-slate-300 print:text-black">Fatigue & Eye Strain</span>
                <span className={scoreDeductions.fatigue > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                  -{scoreDeductions.fatigue}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700 flex justify-between p-2 rounded bg-slate-900 border border-cyan-500/30 text-sm font-bold print:bg-gray-100 print:border-gray-400">
                <span className="text-white print:text-black">Final Wellness Score</span>
                <span className={wellnessScore >= 80 ? 'text-emerald-400' : wellnessScore >= 60 ? 'text-amber-400' : 'text-rose-400'}>
                  {wellnessScore} / 100
                </span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono italic">
            * Numerical score is strictly governed by the rule-based expert system.
          </div>
        </div>
      </div>

      {/* 6. WARNING / ATTENTION SECTION */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-3 print:border-black print:bg-white">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2 print:text-black">
          {warnings.length > 0 ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          {warnings.length > 0 ? 'ATTENTION REQUIRED' : 'NO SIGNIFICANT WARNING INDICATORS'}
        </h3>

        {warnings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {warnings.map((w, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1 flex items-start gap-2.5 print:bg-rose-50 print:border-rose-300"
              >
                <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-300 uppercase print:text-rose-900">
                      ⚠ {w.parameter} Warning
                    </span>
                    <span className="font-mono text-rose-200 text-[11px]">({w.value})</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5 print:text-black">
                    {w.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300 print:bg-emerald-50 print:text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              All monitored physiological and ergonomic biomarkers remain within prototype baseline reference limits.
            </span>
          </div>
        )}
      </div>

      {/* 7. PRIORITY ACTION (Visually Prominent) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-purple-950/80 border-2 border-cyan-400/50 shadow-2xl space-y-2 print:border-black print:bg-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500 text-black">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-cyan-300 print:text-black">
            PRIORITY ACTION
          </h3>
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed pl-1 print:text-black">
          {aiInsights?.immediateAction || priorityAction}
        </p>
      </div>

      {/* 8. WELLNESS INTERPRETATION */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-4 print:border-black print:bg-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-black">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase print:text-black">
                CLINICAL WELLNESS INTERPRETATION
              </h3>
              <p className="text-[11px] text-slate-400 print:text-slate-600">
                Rule-Based Multi-Modal Synthesis
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/40 text-cyan-300">
            Deterministic Engine
          </span>
        </div>

        {aiInsights ? (
          <div className="space-y-4 text-xs">
            {/* AI Summary Narrative */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <span className="text-[10px] font-mono uppercase text-purple-300 font-bold tracking-wider">
                AI Wellness Synthesis:
              </span>
              <p className="text-slate-200 leading-relaxed text-sm font-normal print:text-black">
                {aiInsights.aiSummary}
              </p>
            </div>

            {/* Key Observations & Risk Interpretation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiInsights.observations && aiInsights.observations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 print:bg-white">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    Key AI Observations:
                  </span>
                  <div className="space-y-1">
                    {aiInsights.observations.map((obs, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-slate-300 text-xs print:text-black">
                        <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiInsights.riskAssessment && (
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 print:bg-white">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    Risk Context Evaluation:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-xs print:text-black">
                    {aiInsights.riskAssessment}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI synthesis synthesized using local expert rule guidelines.</span>
          </div>
        )}
      </div>

      {/* 9. PERSONALIZED RECOMMENDATIONS (Categorized) */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4 print:border-black print:bg-white">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 print:border-black">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 flex items-center gap-2 print:text-black">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            PERSONALIZED WELLNESS RECOMMENDATIONS
          </h3>
          <span className="text-xs font-mono text-cyan-400">
            {mergedRecommendations.length} Recommendations Active
          </span>
        </div>

        <div className="space-y-4">
          {Object.keys(groupedRecommendations).map((catName) => (
            <div key={catName} className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                {getCategoryIcon(catName)}
                <span>{catName}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {groupedRecommendations[catName].map((rec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between space-y-1.5 print:bg-gray-50 print:border-gray-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 font-mono">Tip #{i + 1}</span>
                      <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${getPriorityBadgeClass(rec.priority)}`}>
                        {rec.priority || 'Medium'} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed pl-0.5 print:text-black">
                      {rec.suggestion || rec.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. FINAL WELLNESS SUMMARY & DISCLAIMER */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-xl space-y-4 print:border-black print:bg-white">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2 print:text-black">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          FINAL WELLNESS SUMMARY
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-gray-100">
            <span className="text-[10px] text-slate-500 block">FINAL WELLNESS SCORE</span>
            <span className="text-base font-bold text-cyan-400 print:text-black">{wellnessScore} / 100</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-gray-100">
            <span className="text-[10px] text-slate-500 block">OVERALL STATUS</span>
            <span className="text-base font-bold text-emerald-400 print:text-black">{healthStatus}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 print:bg-gray-100">
            <span className="text-[10px] text-slate-500 block">RISK ASSESSMENT</span>
            <span className="text-base font-bold text-purple-300 print:text-black">{riskLevel}</span>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2 print:text-slate-600 print:border-gray-300">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>{disclaimer || MEDICAL_DISCLAIMER}</p>
        </div>
      </div>
    </div>
  )
}
