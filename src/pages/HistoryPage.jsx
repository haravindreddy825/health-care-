import React, { useState } from 'react'
import {
  History,
  TrendingUp,
  Calendar,
  Clock,
  Heart,
  Thermometer,
  Activity,
  UserCheck,
  Eye,
  FileText,
  Trash2,
  RefreshCw,
  User
} from 'lucide-react'
import { TrendChart } from '../components/ui/TrendChart'
import { StatusBadge } from '../components/ui/StatusBadge'
import { ReportModal } from '../components/analysis/ReportModal'
import { useSmartMirror } from '../context/SmartMirrorContext'

export function HistoryPage() {
  const {
    activeProfile,
    historyList,
    isHistoryLoading,
    loadUserHistory,
    clearAllData,
    showToast
  } = useSmartMirror()

  const [selectedRecord, setSelectedRecord] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)

  const scores = historyList.map(h => {
    const a = Array.isArray(h.health_analysis) ? h.health_analysis[0] : h.health_analysis
    return a?.wellness_score || 80
  }).reverse()

  const handleOpenReport = (record) => {
    const a = Array.isArray(record.health_analysis) ? record.health_analysis[0] : record.health_analysis
    const reportObj = {
      wellnessScore: a?.wellness_score || 80,
      healthStatus: a?.health_status || 'Healthy',
      riskLevel: a?.risk_level || 'LOW',
      priorityAction: a?.immediate_action || 'Maintain healthy daily habits.',
      summary: a?.analysis || 'Historical session reading.',
      recommendations: a?.recommendations || [],
      parameters: [
        { name: 'Heart Rate', reading: record.heart_rate ? `${record.heart_rate} BPM` : 'Sensor Disconnected', source: record.heart_rate ? (record.is_demo ? 'demo' : 'hardware') : 'unavailable' },
        { name: 'Blood Oxygen (SpO₂)', reading: record.spo2 ? `${record.spo2}%` : 'Sensor Disconnected', source: record.spo2 ? (record.is_demo ? 'demo' : 'hardware') : 'unavailable' },
        { name: 'Body Temperature', reading: record.temperature ? `${record.temperature}°C` : 'Sensor Disconnected', source: record.temperature ? (record.is_demo ? 'demo' : 'hardware') : 'unavailable' },
        { name: 'Spinal Posture', reading: record.posture_status || 'Good', source: record.is_demo ? 'demo' : 'vision' },
        { name: 'Alertness / Fatigue', reading: record.fatigue_level || 'Low', source: record.is_demo ? 'demo' : 'vision' }
      ],
      disclaimer: 'Disclaimer: This Smart Mirror is an educational prototype and personal wellness-monitoring system.'
    }

    setSelectedRecord(record)
    setSelectedReport(reportObj)
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                CHRONOLOGICAL HEALTH TIMELINE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                Profile: <strong className="text-white">{activeProfile?.name}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Personal Session History
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
              Stored telemetry assessments and historical trend progressions for this user
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => loadUserHistory(activeProfile.id)}
              disabled={isHistoryLoading}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isHistoryLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={clearAllData}
              className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe Records</span>
            </button>
          </div>
        </div>

        {/* Longitudinal Score Trend Graph */}
        {scores.length > 1 && (
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase text-xs font-sans">
                  Wellness Score History ({scores.length} Sessions)
                </span>
              </div>
              <span className="text-cyan-300 font-bold">{scores.join(' → ')}</span>
            </div>
            <div className="h-24 w-full pt-2">
              <TrendChart data={scores} height={80} color="#06b6d4" />
            </div>
          </div>
        )}
      </div>

      {/* 2. Sessions List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
          HISTORICAL SESSIONS ({historyList.length})
        </h3>

        {historyList.length === 0 ? (
          <div className="p-12 rounded-3xl glass-panel border-white/10 text-center space-y-2 text-slate-400">
            <History className="w-8 h-8 text-slate-600 mx-auto" />
            <span className="font-bold text-white block text-sm font-sans">No Recorded Sessions Yet</span>
            <p className="font-sans font-normal">Complete your first wellness check on the Smart Mirror to build your personal timeline.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historyList.map((session, idx) => {
              const a = Array.isArray(session.health_analysis) ? session.health_analysis[0] : session.health_analysis
              const dateStr = new Date(session.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
              const timeStr = new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

              return (
                <div
                  key={session.id || idx}
                  className="p-5 rounded-3xl glass-panel border-white/10 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg"
                >
                  {/* Left: Date, Time & Score */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-col items-center justify-center text-center shadow-inner">
                      <span className="text-lg font-extrabold text-white">{a?.wellness_score ?? 85}</span>
                      <span className="text-[9px] text-slate-500 uppercase">PTS</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-sans">
                          {dateStr}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{timeStr}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={a?.health_status || 'Healthy'} size="xs" />
                        <span className="text-[10px] text-slate-500">
                          {session.observation_duration || '10s Check'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Key Parameters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-500 uppercase">Heart Rate</span>
                      <div className="font-bold text-white">{session.heart_rate ? `${session.heart_rate} BPM` : 'Offline'}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-500 uppercase">Temperature</span>
                      <div className="font-bold text-white">{session.temperature ? `${session.temperature}°C` : 'Offline'}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-500 uppercase">Posture</span>
                      <div className="font-bold text-white">{session.posture_status || 'Good'}</div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-500 uppercase">Fatigue</span>
                      <div className="font-bold text-white">{session.fatigue_level || 'Low'}</div>
                    </div>
                  </div>

                  {/* Right: View Report Button */}
                  <button
                    onClick={() => handleOpenReport(session)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-300 font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Report</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={Boolean(selectedReport)}
        onClose={() => { setSelectedReport(null); setSelectedRecord(null); }}
        report={selectedReport}
        comparison={null}
        profileName={activeProfile?.name}
      />
    </div>
  )
}
