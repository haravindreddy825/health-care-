import React, { useState } from 'react'
import {
  History,
  Search,
  Filter,
  FileText,
  Trash2,
  X,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Clock,
  Play
} from 'lucide-react'
import { clearAllSessionData } from '../services/sessionStore'

export function SessionHistoryView({
  historyList = [],
  onRefresh,
  onStartHealthCheck
}) {
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [comparedSessions, setComparedSessions] = useState([])
  const [showWipeModal, setShowWipeModal] = useState(false)
  const [isWiping, setIsWiping] = useState(false)
  const [toast, setToast] = useState(null)

  // Filter and search
  const filteredList = historyList.filter(item => {
    const analysis = Array.isArray(item.health_analysis) ? item.health_analysis[0] : item.health_analysis
    const status = (analysis?.health_status || '').toUpperCase()

    if (filterStatus === 'HEALTHY' && status !== 'HEALTHY') return false
    if (filterStatus === 'NEEDS ATTENTION' && status !== 'NEEDS ATTENTION' && status !== 'ATTENTION') return false
    if (filterStatus === 'HIGH RISK' && status !== 'HIGH RISK' && status !== 'HIGH') return false

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      const dStr = new Date(item.created_at).toLocaleDateString().toLowerCase()
      const dText = new Date(item.created_at).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase()
      const sid = (item.session_id || item.id || '').toLowerCase()
      return dStr.includes(term) || dText.includes(term) || sid.includes(term)
    }

    return true
  })

  const toggleCompare = (item) => {
    setComparedSessions(prev => {
      if (prev.some(p => p.id === item.id)) {
        return prev.filter(p => p.id !== item.id)
      }
      if (prev.length >= 2) {
        return [prev[1], item]
      }
      return [...prev, item]
    })
  }

  const handleWipeData = async () => {
    setIsWiping(true)
    await clearAllSessionData()
    setIsWiping(false)
    setShowWipeModal(false)
    setToast('All previous session history has been cleared.')
    if (onRefresh) onRefresh()
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* 1. Header Card */}
      <div className="p-6 sm:p-8 rounded-[36px] bg-slate-900/90 border border-white/15 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                SESSION TIMELINE
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                {historyList.length} Sessions Recorded
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Health Session History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and compare your past physiological monitoring sessions
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {historyList.length > 0 && (
              <button
                onClick={() => setShowWipeModal(true)}
                className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Data</span>
              </button>
            )}
            <button
              onClick={onStartHealthCheck}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>New Check</span>
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-white/5 font-mono text-xs overflow-x-auto">
            {['ALL', 'HEALTHY', 'NEEDS ATTENTION', 'HIGH RISK'].map(st => (
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

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by date (e.g. Aug 31)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-2xl bg-slate-950/75 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Comparison Box (When 2 selected) */}
      {comparedSessions.length === 2 && (
        <div className="p-6 rounded-[32px] bg-slate-900/90 border-2 border-cyan-500/50 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-extrabold uppercase text-cyan-300 tracking-wider">
                CUSTOM 2-SESSION COMPARISON
              </h3>
            </div>
            <button
              onClick={() => setComparedSessions([])}
              className="text-xs text-slate-400 hover:text-white cursor-pointer font-mono"
            >
              Clear Comparison [X]
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            {comparedSessions.map((s, idx) => {
              const a = Array.isArray(s.health_analysis) ? s.health_analysis[0] : s.health_analysis
              const date = new Date(s.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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
        </div>
      )}

      {/* 3. Session Cards List */}
      {filteredList.length === 0 ? (
        <div className="p-10 rounded-[36px] bg-slate-900/60 border border-dashed border-white/10 text-center space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">No Sessions Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {historyList.length === 0
              ? 'Complete your first health check on the Smart Mirror to build your timeline.'
              : 'Try adjusting your search query or status filter.'}
          </p>
          {historyList.length === 0 && (
            <button
              onClick={onStartHealthCheck}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              Start First Check
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const analysis = Array.isArray(item.health_analysis) ? item.health_analysis[0] : item.health_analysis
            const isSelected = comparedSessions.some(c => c.id === item.id)
            const dateStr = new Date(item.created_at).toLocaleString([], {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })

            const scoreVal = analysis?.wellness_score ?? 80
            const isGood = scoreVal >= 80

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl bg-slate-900/80 border transition-all flex flex-col justify-between space-y-4 shadow-xl ${
                  isSelected ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">{dateStr}</span>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                        ID: {item.session_id || item.id.slice(0, 10)}
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      isGood
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {analysis?.health_status || 'RECORDED'}
                    </span>
                  </div>

                  {/* Score & Vitals Box */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/70 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center justify-center font-mono shrink-0">
                      <span className="font-extrabold text-white text-base">
                        {scoreVal}
                      </span>
                      <span className="text-[7px] text-slate-400 uppercase font-bold">SCORE</span>
                    </div>

                    <div className="text-[11px] text-slate-300 font-mono space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-rose-300 font-semibold">{item.heart_rate} BPM</span>
                        <span className="text-cyan-300 font-semibold">{item.temperature}°C</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Posture: {item.posture_status} • Fatigue: {item.fatigue_level}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1 border-t border-white/5">
                  <button
                    onClick={() => setSelectedRecord({ record: item, analysis, dateStr })}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>VIEW FULL REPORT</span>
                  </button>

                  <button
                    onClick={() => toggleCompare(item)}
                    className={`w-full py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ Selected for Compare' : '+ Compare with Another'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. Report Viewer Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-2xl w-full rounded-[36px] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-5 relative max-h-[85vh] overflow-y-auto animate-fadeIn text-slate-100">
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                HISTORICAL ASSESSMENT REPORT
              </span>
              <h3 className="text-xl font-bold text-white">
                Session: {selectedRecord.dateStr}
              </h3>
              <p className="text-xs text-slate-500 font-mono">ID: {selectedRecord.record.session_id || selectedRecord.record.id}</p>
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
              <p>{selectedRecord.analysis?.analysis}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Safe Wipe Confirmation Modal */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-md w-full rounded-3xl border border-rose-500/30 shadow-2xl p-6 space-y-4 text-center animate-fadeIn text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Clear All Session Data?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will safely erase all past stored health readings and analysis reports from this device and cloud.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowWipeModal(false)}
                disabled={isWiping}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeData}
                disabled={isWiping}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
              >
                {isWiping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Clear All Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
