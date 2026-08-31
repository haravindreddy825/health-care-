import React from 'react'
import {
  Activity,
  Heart,
  Thermometer,
  User,
  Moon,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Printer,
  RotateCcw,
  Play,
  Zap,
  Sparkles,
  ShieldCheck
} from 'lucide-react'

export function HealthReportViewer({
  reportData,
  trendData,
  historyList = [],
  onReturnToMirror,
  onStartNewCheck,
  profileId = 'mirror_person_01',
  sessionId
}) {
  if (!reportData) return null

  const score = reportData.wellnessScore ?? 85
  const isHealthy = score >= 80
  const isAttention = score >= 60 && score < 80

  const scoreBadgeClass = isHealthy
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    : isAttention
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : 'bg-rose-500/20 text-rose-300 border-rose-500/30'

  const scoreRingColor = isHealthy
    ? 'border-emerald-400/50 bg-emerald-500/10 shadow-emerald-500/20'
    : isAttention
    ? 'border-amber-400/50 bg-amber-500/10 shadow-amber-500/20'
    : 'border-rose-400/50 bg-rose-500/10 shadow-rose-500/20'

  const handlePrint = () => {
    window.print()
  }

  // Get previous session if available
  const previousRecord = historyList.find(
    h => h.id !== sessionId && h.session_id !== sessionId
  ) || (historyList.length > 1 ? historyList[1] : null)

  const prevAnalysis = previousRecord
    ? (Array.isArray(previousRecord.health_analysis) ? previousRecord.health_analysis[0] : previousRecord.health_analysis)
    : null

  // Extract non-optimal improvements
  const nonOptimalRecommendations = (reportData.recommendations || []).filter(
    r => r.category !== 'GENERAL WELLNESS' || score < 90
  )

  // Get recent 4 scores for trend sequence
  const scoreSequence = historyList
    .slice(0, 4)
    .reverse()
    .map(h => {
      const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
      return a?.wellness_score ?? score
    })

  if (!scoreSequence.includes(score)) {
    scoreSequence.push(score)
  }

  return (
    <div id="printable-report" className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* 1. REPORT HERO CARD */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/15 shadow-2xl space-y-6">
        
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                PERSONAL WELLNESS REPORT
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                {new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personal Wellness Assessment
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Session ID: <span className="text-slate-200">{sessionId || 'SMR-CURRENT'}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print</span>
            </button>
            <button
              onClick={onReturnToMirror}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Return to Mirror</span>
            </button>
            <button
              onClick={onStartNewCheck}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>New Wellness Check</span>
            </button>
          </div>
        </div>

        {/* 2. Hero Score Ring & Assessment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Circular Score Ring */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-slate-950/70 border border-white/5 space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
              CURRENT WELLNESS
            </span>
            <div className={`w-28 h-28 rounded-full border-4 ${scoreRingColor} flex flex-col items-center justify-center shadow-xl`}>
              <span className="text-4xl font-extrabold font-mono text-white">{score}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">/ 100</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase border ${scoreBadgeClass}`}>
                {reportData.healthStatus.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-semibold">
                {reportData.riskLevel.toUpperCase()} RISK
              </span>
            </div>
          </div>

          {/* Assessment Summary */}
          <div className="md:col-span-8 space-y-3">
            <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider block">
                ASSESSMENT SUMMARY
              </span>
              <p className="text-sm text-slate-200 leading-relaxed font-normal">
                {reportData.overallInterpretation || reportData.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5">
                MAX30102 (Demo)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5">
                IR Thermal (Demo)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5">
                Optical Posture
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-white/5">
                Optical Fatigue
              </span>
            </div>
          </div>
        </div>

        {/* 3. CURRENT INDICATORS */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            CURRENT INDICATORS
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {reportData.parameters?.map((param) => {
              const isNormal = param.status === 'NORMAL' || param.status === 'GOOD'
              return (
                <div
                  key={param.id || param.name}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 font-bold uppercase">{param.name}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold ${
                        isNormal
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {param.status}
                      </span>
                    </div>

                    <div className="text-2xl font-extrabold font-mono text-white pt-1">
                      {param.reading}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                    Ref: {param.referenceRange}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4. PREVIOUS REPORT CARD */}
        {previousRecord ? (
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                YOUR PREVIOUS WELLNESS REPORTS
              </span>
              <span className="text-xs font-mono text-slate-500">
                {new Date(previousRecord.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Score:</span>
                <span className="font-bold text-white">{prevAnalysis?.wellness_score ?? 80} / 100</span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-cyan-300">
                  {prevAnalysis?.health_status || 'Healthy'}
                </span>
              </div>
              <div>•</div>
              <div>HR: <span className="text-white font-bold">{previousRecord.heart_rate} BPM</span></div>
              <div>•</div>
              <div>Temp: <span className="text-white font-bold">{previousRecord.temperature}°C</span></div>
              <div>•</div>
              <div>Posture: <span className="text-white font-bold">{previousRecord.posture_status}</span></div>
              <div>•</div>
              <div>Fatigue: <span className="text-white font-bold">{previousRecord.fatigue_level}</span></div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-xs text-slate-400 font-mono">
            No previous wellness report is available yet. Your first wellness check starts here.
          </div>
        )}

        {/* 5. CURRENT VS PREVIOUS COMPARISON */}
        {trendData && trendData.hasPrevious && previousRecord ? (
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono font-bold uppercase text-cyan-300 tracking-wider">
                  CURRENT VS PREVIOUS
                </h3>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                trendData.scoreDelta > 0 ? 'bg-emerald-500/20 text-emerald-300' :
                trendData.scoreDelta < 0 ? 'bg-amber-500/20 text-amber-300' :
                'bg-slate-800 text-slate-300'
              }`}>
                {trendData.scoreDelta >= 0 ? `+${trendData.scoreDelta} WELLNESS SCORE (${trendData.overallTrend})` : `${trendData.scoreDelta} WELLNESS SCORE (${trendData.overallTrend})`}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase">
                    <th className="pb-2 font-bold">METRIC</th>
                    <th className="pb-2 font-bold">PREVIOUS</th>
                    <th className="pb-2 font-bold">CURRENT</th>
                    <th className="pb-2 font-bold">CHANGE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-200">
                  <tr>
                    <td className="py-2 font-semibold">Wellness Score</td>
                    <td className="py-2 text-slate-400">{trendData.previousScore} / 100</td>
                    <td className="py-2 font-bold text-white">{trendData.currentScore} / 100</td>
                    <td className="py-2 font-bold text-cyan-300">{trendData.scoreDelta >= 0 ? `+${trendData.scoreDelta}` : trendData.scoreDelta} pts</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Heart Rate</td>
                    <td className="py-2 text-slate-400">{trendData.comparison.heartRate.previous || '--'} BPM</td>
                    <td className="py-2 font-bold text-white">{trendData.comparison.heartRate.current} BPM</td>
                    <td className="py-2 text-slate-300">
                      {trendData.heartRateDelta != null ? `${trendData.heartRateDelta >= 0 ? '+' : ''}${trendData.heartRateDelta} BPM` : 'Recorded'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Temperature</td>
                    <td className="py-2 text-slate-400">{trendData.comparison.temperature.previous || '--'}°C</td>
                    <td className="py-2 font-bold text-white">{trendData.comparison.temperature.current}°C</td>
                    <td className="py-2 text-slate-300">
                      {trendData.temperatureDelta != null ? `${trendData.temperatureDelta >= 0 ? '+' : ''}${trendData.temperatureDelta}°C` : 'Recorded'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Posture</td>
                    <td className="py-2 text-slate-400">{trendData.comparison.posture.previous || '--'}</td>
                    <td className="py-2 font-bold text-white">{trendData.comparison.posture.current}</td>
                    <td className="py-2 text-slate-300">{trendData.postureChange}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Fatigue</td>
                    <td className="py-2 text-slate-400">{trendData.comparison.fatigue.previous || '--'}</td>
                    <td className="py-2 font-bold text-white">{trendData.comparison.fatigue.current}</td>
                    <td className="py-2 text-slate-300">{trendData.fatigueChange}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 6. WHAT CHANGED? */}
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                WHAT CHANGED?
              </span>
              <ul className="space-y-1 text-xs text-slate-300 font-mono">
                {trendData.changedItems.map((ch, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>{ch}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {/* 7. WHAT CAN I IMPROVE? & PRIORITY ACTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Priority Action Card (5 Cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-tr from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/40 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-cyan-300">
                YOUR PRIORITY ACTION
              </h3>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {reportData.priorityAction}
            </p>
            <span className="text-[10px] text-slate-500 font-mono block pt-1 border-t border-white/10">
              * Targeted clinical decision takeaway
            </span>
          </div>

          {/* What Can I Improve Suggestions (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              WHAT CAN I IMPROVE?
            </h3>

            <div className="space-y-2.5">
              {nonOptimalRecommendations.length > 0 ? (
                nonOptimalRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-1 flex items-start gap-3"
                  >
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 block">
                        {rec.category || 'WELLNESS'}
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        {rec.suggestion || rec.title}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/20 text-xs text-emerald-300 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Your current wellness indicators are within normal reference ranges. Continue your current balanced routine.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 8. RECENT REPORTS & WELLNESS TREND */}
        {historyList.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider">
                RECENT REPORTS & WELLNESS TREND
              </h3>
              <div className="text-xs font-mono text-cyan-300 font-bold">
                Wellness score trend: {scoreSequence.join(' → ')}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {historyList.slice(0, 4).map((h, i) => {
                const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
                const d = new Date(h.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
                return (
                  <div key={h.id || i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-center space-y-1 font-mono text-xs">
                    <span className="text-[10px] text-slate-500 block">{d}</span>
                    <div className="text-lg font-bold text-white">{a?.wellness_score ?? 85} pts</div>
                    <span className="text-[9px] text-emerald-400 uppercase">{a?.health_status || 'Healthy'}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 9. Medical Prototype Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-[10px] text-slate-500 font-mono leading-relaxed text-center sm:text-left">
          {reportData.disclaimer || 'Disclaimer: This Smart Mirror is an educational wellness-monitoring prototype. Its measurements and AI-generated insights are not medical diagnoses and should not replace professional medical advice.'}
        </div>

        {/* 10. Bottom Navigation Controls (WAIT FOR USER — NO AUTO RETURN) */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 no-print">
          <button
            onClick={onReturnToMirror}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Mirror</span>
          </button>

          <button
            onClick={onStartNewCheck}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start New Wellness Check</span>
          </button>
        </div>
      </div>
    </div>
  )
}
