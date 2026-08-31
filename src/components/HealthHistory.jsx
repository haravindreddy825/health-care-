import React, { useState, useEffect } from 'react'
import {
  History,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Calendar,
  Heart,
  Thermometer,
  User,
  Moon,
  ShieldCheck,
  AlertCircle,
  Database,
  FileText,
  Printer,
  Sparkles,
  Zap,
  Layers,
  X
} from 'lucide-react'
import { getRecentHealthReadings } from '../services/supabaseHealth'

export function HealthHistory({ refreshTrigger, onSelectSessionForReport }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRecentHealthReadings(20)
      setHistory(data || [])
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Unable to load history from Supabase: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [refreshTrigger])

  const getStatusBadge = (status = 'Healthy') => {
    if (status === 'High Risk') {
      return 'bg-rose-950/80 border-rose-500/50 text-rose-300'
    } else if (status === 'Needs Attention') {
      return 'bg-amber-950/80 border-amber-500/50 text-amber-300'
    }
    return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4 no-print">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Recent Health History</h3>
            <p className="text-[11px] text-slate-400">Persisted Session Records • Supabase Cloud Database</p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loading}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-cyan-400 disabled:opacity-50 transition-all flex items-center gap-1.5 text-xs font-mono"
          title="Refresh History"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* History Records List */}
      {loading && history.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
          <span>Fetching recent reports from Supabase...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400 space-y-2">
          <Database className="w-6 h-6 mx-auto text-slate-600" />
          <p className="text-xs font-medium">No saved wellness reports found yet.</p>
          <p className="text-[11px] text-slate-500">
            Run an analysis and click "Save Reading" to record the complete test report in Supabase.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {history.map((record) => {
            const analysisList = Array.isArray(record.health_analysis)
              ? record.health_analysis
              : record.health_analysis ? [record.health_analysis] : []
            const analysis = analysisList[0] || {}
            const recList = analysis.recommendations || []

            const formattedDate = new Date(record.created_at).toLocaleString([], {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <div
                key={record.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Summary Details */}
                <div className="flex items-center gap-3">
                  {/* Score badge */}
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-slate-950 border border-cyan-500/20 font-mono shrink-0">
                    <span className="text-base font-extrabold text-white">
                      {analysis.wellness_score ?? '--'}
                    </span>
                    <span className="text-[8px] text-slate-500 uppercase">SCORE</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase font-mono px-2 py-0.5 rounded-full border ${getStatusBadge(analysis.health_status)}`}>
                        {analysis.health_status || 'Recorded'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formattedDate}
                      </span>
                      <span className="text-[10px] text-purple-300 font-mono">
                        Risk: {analysis.risk_level || 'Low'}
                      </span>
                    </div>

                    {/* Vitals row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
                      <span className="flex items-center gap-1 text-rose-300">
                        <Heart className="w-3 h-3 text-rose-400" /> {record.heart_rate ?? '--'} BPM
                      </span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Thermometer className="w-3 h-3 text-amber-400" /> {record.temperature ? `${Number(record.temperature).toFixed(1)}°C` : '--'}
                      </span>
                      <span className="flex items-center gap-1 text-cyan-300">
                        <User className="w-3.5 h-3.5 text-cyan-400" /> {record.posture_status}
                      </span>
                      <span className="flex items-center gap-1 text-purple-300">
                        <Moon className="w-3.5 h-3.5 text-purple-400" /> {record.fatigue_level}
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Full Report Button */}
                <div className="self-end sm:self-center">
                  <button
                    onClick={() => setSelectedRecord({ record, analysis, recommendations: recList, formattedDate })}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VIEW FULL REPORT</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full Report Modal View for History Record */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/40 shadow-2xl p-6 space-y-4 relative bg-slate-950">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                HISTORICAL ASSESSMENT REPORT
              </span>
              <h2 className="text-xl font-extrabold text-white">
                Session Report — {selectedRecord.formattedDate}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Session ID: {selectedRecord.record.id}
              </span>
            </div>

            {/* Score & Status */}
            <div className="grid grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">WELLNESS SCORE</span>
                <span className="text-2xl font-bold text-cyan-400">{selectedRecord.analysis.wellness_score} / 100</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">OVERALL STATUS</span>
                <span className="text-base font-bold text-emerald-400">{selectedRecord.analysis.health_status}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">RISK LEVEL</span>
                <span className="text-base font-bold text-purple-400">{selectedRecord.analysis.risk_level}</span>
              </div>
            </div>

            {/* Vitals Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">HEART RATE</span>
                <span className="text-slate-200 font-bold">{selectedRecord.record.heart_rate} BPM</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">TEMPERATURE</span>
                <span className="text-slate-200 font-bold">{selectedRecord.record.temperature}°C</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">POSTURE</span>
                <span className="text-slate-200 font-bold">{selectedRecord.record.posture_status}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">FATIGUE</span>
                <span className="text-slate-200 font-bold">{selectedRecord.record.fatigue_level}</span>
              </div>
            </div>

            {/* Assessment Narrative */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs text-slate-200">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Report Assessment:</span>
              <p className="leading-relaxed text-slate-300">
                {selectedRecord.analysis.analysis}
              </p>
            </div>

            {/* AI Summary / Observations if present */}
            {selectedRecord.analysis.ai_summary && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-1.5 text-xs">
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">Session Synthesis:</span>
                <p className="text-slate-200 leading-relaxed">
                  {selectedRecord.analysis.ai_summary}
                </p>
              </div>
            )}

            {/* Recommendations */}
            {selectedRecord.recommendations && selectedRecord.recommendations.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold">
                  Saved Recommendations ({selectedRecord.recommendations.length}):
                </span>
                <div className="space-y-1.5">
                  {selectedRecord.recommendations.map((rec, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-900/80 border border-slate-800 text-xs flex items-start gap-2">
                      <span className="text-cyan-400 font-mono font-bold">[{rec.priority || 'General'}]</span>
                      <span className="text-slate-300">{rec.suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
