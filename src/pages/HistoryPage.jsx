import React, { useState } from 'react'
import {
  History,
  Search,
  Filter,
  Calendar,
  Heart,
  Thermometer,
  User,
  Moon,
  FileText,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { StatusBadge } from '../components/ui/StatusBadge'
import { SectionHeader } from '../components/ui/SectionHeader'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { EmptyState } from '../components/ui/EmptyState'
import { deleteProfileHealthHistory } from '../services/supabaseHealth'

export function HistoryPage({
  historyList = [],
  onRefresh,
  currentProfile = 'mirror_person_01',
  onStartWellnessCheck
}) {
  const [filterStatus, setFilterStatus] = useState('ALL') // 'ALL' | 'HEALTHY' | 'NEEDS ATTENTION' | 'HIGH RISK'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [compareSessions, setCompareSessions] = useState([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notice, setNotice] = useState(null)

  // Filter history records
  const filteredHistory = historyList.filter((item) => {
    const analysis = Array.isArray(item.health_analysis) ? item.health_analysis[0] : item.health_analysis
    const status = (analysis?.health_status || '').toUpperCase()

    // Status filter
    if (filterStatus === 'HEALTHY' && status !== 'HEALTHY') return false
    if (filterStatus === 'NEEDS ATTENTION' && status !== 'NEEDS ATTENTION' && status !== 'ATTENTION') return false
    if (filterStatus === 'HIGH RISK' && status !== 'HIGH RISK' && status !== 'HIGH') return false

    // Search filter (date or ID)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      const dStr = new Date(item.created_at).toLocaleDateString().toLowerCase()
      const dText = new Date(item.created_at).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()
      const idStr = (item.session_id || item.id || '').toLowerCase()
      return dStr.includes(term) || dText.includes(term) || idStr.includes(term)
    }

    return true
  })

  // Handle Session Comparison toggle (up to 2 sessions)
  const toggleCompareSession = (item) => {
    setCompareSessions((prev) => {
      if (prev.some(p => p.id === item.id)) {
        return prev.filter(p => p.id !== item.id)
      }
      if (prev.length >= 2) {
        return [prev[1], item]
      }
      return [...prev, item]
    })
  }

  // Handle Delete Confirmation
  const handleDeleteHistory = async () => {
    setIsDeleting(true)
    const res = await deleteProfileHealthHistory(currentProfile)
    setIsDeleting(false)
    setShowDeleteModal(false)

    if (res.success) {
      setNotice({ text: 'Session history successfully removed.', type: 'success' })
      if (onRefresh) onRefresh()
    } else {
      setNotice({ text: 'Could not delete history: ' + res.error, type: 'error' })
    }
    setTimeout(() => setNotice(null), 4000)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* 1. HEADER BANNER */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                HISTORY
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 font-medium">
                Cloud-Persisted Telemetry
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Wellness History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Your previous Smart Mirror wellness sessions & comparative records
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {historyList.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete History</span>
              </button>
            )}
            <PrimaryButton onClick={onStartWellnessCheck} size="sm">
              New Wellness Check
            </PrimaryButton>
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
            notice.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{notice.text}</span>
          </div>
        )}

        {/* 2. FILTER & SEARCH CONTROLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Status Filters */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/5 font-mono text-xs overflow-x-auto">
            {['ALL', 'HEALTHY', 'NEEDS ATTENTION', 'HIGH RISK'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-xl transition-all font-bold whitespace-nowrap cursor-pointer ${
                  filterStatus === st
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'NEEDS ATTENTION' ? 'ATTENTION' : st}
              </button>
            ))}
          </div>

          {/* Search by Date */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by date (e.g. Aug 30)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-slate-950/75 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
      </GlassCard>

      {/* 3. TWO-SESSION COMPARISON TOOL (IF 2 SELECTED) */}
      {compareSessions.length === 2 && (
        <GlassCard className="p-6 border-cyan-500/40 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-extrabold uppercase text-cyan-300 tracking-wider">
                Custom Session Comparison
              </h3>
            </div>
            <button
              onClick={() => setCompareSessions([])}
              className="text-xs text-slate-400 hover:text-white cursor-pointer font-mono"
            >
              Clear Comparison [X]
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            {compareSessions.map((s, idx) => {
              const a = Array.isArray(s.health_analysis) ? s.health_analysis[0] : s.health_analysis
              const date = new Date(s.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
              return (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">
                    Session {idx === 0 ? 'A' : 'B'} • {date}
                  </span>
                  <div className="text-xl font-extrabold text-white">
                    Score: <span className="text-cyan-300">{a?.wellness_score ?? '--'}</span> / 100
                  </div>
                  <div className="text-slate-300 text-[11px] space-y-0.5">
                    <div>HR: {s.heart_rate} BPM | Temp: {s.temperature}°C</div>
                    <div>Posture: {s.posture_status} | Fatigue: {s.fatigue_level}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassCard>
      )}

      {/* 4. HISTORY CARDS LIST */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          title={historyList.length === 0 ? 'No Wellness Reports Yet' : 'No Matching Sessions'}
          description={
            historyList.length === 0
              ? 'Complete your first wellness check in front of the Smart Mirror to populate this timeline.'
              : 'Try clearing your search term or adjusting status filter.'
          }
          action={
            historyList.length === 0 ? (
              <PrimaryButton onClick={onStartWellnessCheck} size="sm">
                Start First Check
              </PrimaryButton>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHistory.map((item) => {
            const analysis = Array.isArray(item.health_analysis) ? item.health_analysis[0] : item.health_analysis
            const isCompared = compareSessions.some(p => p.id === item.id)

            const dateStr = new Date(item.created_at).toLocaleString([], {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            return (
              <GlassCard
                key={item.id}
                className={`p-5 space-y-4 flex flex-col justify-between ${
                  isCompared ? 'ring-2 ring-cyan-400 border-cyan-400/60' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-white font-sans block">{dateStr}</span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        ID: {item.session_id || item.id.slice(0, 8)}
                      </span>
                    </div>
                    <StatusBadge status={analysis?.health_status || 'Recorded'} size="sm" />
                  </div>

                  {/* Score & Vitals Box */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="font-extrabold text-white text-base">
                        {analysis?.wellness_score ?? '--'}
                      </span>
                      <span className="text-[7px] text-slate-400 uppercase font-bold">SCORE</span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-mono space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-rose-300 font-semibold">{item.heart_rate} BPM</span>
                        <span className="text-cyan-300 font-semibold">{item.temperature}°C</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        {item.posture_status} • {item.fatigue_level}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions: View Report & Compare */}
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <button
                    onClick={() => setSelectedRecord({ record: item, analysis, dateStr })}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VIEW REPORT</span>
                  </button>

                  <button
                    onClick={() => toggleCompareSession(item)}
                    className={`w-full py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                      isCompared
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isCompared ? '✓ Selected for Compare' : '+ Compare with Another'}
                  </button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* 5. HISTORICAL REPORT MODAL DETAIL VIEWER */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-2xl w-full rounded-[32px] border border-white/15 shadow-2xl p-6 sm:p-7 space-y-5 relative max-h-[85vh] overflow-y-auto animate-fadeIn text-slate-100">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                HISTORICAL ASSESSMENT REPORT
              </span>
              <h3 className="text-xl font-bold text-white">
                Session: {selectedRecord.dateStr}
              </h3>
              <p className="text-xs text-slate-500 font-mono">ID: {selectedRecord.record.id}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 text-[10px] block font-bold">WELLNESS SCORE</span>
                <span className="text-2xl font-bold text-white">{selectedRecord.analysis?.wellness_score} / 100</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 text-[10px] block font-bold">STATUS</span>
                <span className="text-base font-bold text-slate-200">{selectedRecord.analysis?.health_status}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <span className="text-slate-400 text-[10px] block font-bold">RISK</span>
                <span className="text-base font-bold text-slate-200">{selectedRecord.analysis?.risk_level}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-xs text-slate-300 leading-relaxed space-y-1">
              <p className="font-semibold text-white">Assessment Summary:</p>
              <p>{selectedRecord.analysis?.analysis || selectedRecord.analysis?.analysis_summary}</p>
            </div>

            {selectedRecord.analysis?.ai_summary && (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-200 space-y-1">
                <p className="font-semibold text-cyan-300">Session Synthesis:</p>
                <p>{selectedRecord.analysis.ai_summary}</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <SecondaryButton onClick={() => setSelectedRecord(null)} size="sm">
                Close Report
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}

      {/* 6. DELETE HISTORY CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-md w-full rounded-3xl border border-rose-500/30 shadow-2xl p-6 space-y-4 text-center animate-fadeIn text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Delete Session History?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will safely erase all stored wellness readings and reports for this profile from the cloud database. This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHistory}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
