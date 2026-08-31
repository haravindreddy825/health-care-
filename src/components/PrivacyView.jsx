import React, { useState } from 'react'
import { ShieldCheck, Lock, EyeOff, Database, Trash2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { clearAllSessionData } from '../services/sessionStore'
import { localFaceMatcher } from '../services/localFaceMatcher'

export function PrivacyView({ onDataWiped }) {
  const [notice, setNotice] = useState(null)
  const [showWipeModal, setShowWipeModal] = useState(false)
  const [isWiping, setIsWiping] = useState(false)

  const handleForgetDevice = () => {
    localFaceMatcher.clearProfile()
    setNotice('Local anonymous profile forgotten from this device. A new anonymous ID will be generated on next session.')
    setTimeout(() => setNotice(null), 3500)
  }

  const handleWipeAll = async () => {
    setIsWiping(true)
    await clearAllSessionData()
    localFaceMatcher.clearProfile()
    setIsWiping(false)
    setShowWipeModal(false)
    setNotice('All stored session history and health reports successfully wiped from database and local memory.')
    if (onDataWiped) onDataWiped()
    setTimeout(() => setNotice(null), 3500)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/15 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30">
                PRIVACY & SECURITY
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                On-Device Computing Architecture
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Data Privacy & Security Protections
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              100% on-device optical processing, zero face images uploaded, anonymous health records, zero external AI
            </p>
          </div>
        </div>

        {/* Notice */}
        {notice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* 2. Privacy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl glass-panel space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">No Cloud Video Uploads</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Your camera frames and facial video feeds are processed locally in your browser memory and are never uploaded or stored on any external server.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Anonymous Identification</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            No username, passwords, or personal credentials are required. Session continuity is maintained via anonymous local device identifiers.
          </p>
        </div>

        <div className="p-6 rounded-3xl glass-panel space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">100% Local Inference</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Health scores and recommendations are evaluated entirely on-device by the deterministic local clinical rule engine without any external AI APIs.
          </p>
        </div>
      </div>

      {/* 3. User Data Controls */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/15 space-y-5 shadow-2xl">
        <h3 className="text-sm font-mono font-bold uppercase text-white tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          YOUR DATA CONTROLS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-white block">
                Local Device Profile
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clears the anonymous device profile identifier stored in this browser for session continuity.
              </p>
            </div>
            <button
              onClick={handleForgetDevice}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Forget This Device</span>
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950/70 border border-white/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase text-white block">
                Stored Session Reports
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Permanently wipes all historical telemetry readings, wellness analysis summaries, and recommendations from Supabase and local cache.
              </p>
            </div>
            <button
              onClick={() => setShowWipeModal(true)}
              className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stored Health History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-md w-full rounded-3xl border border-rose-500/30 shadow-2xl p-6 space-y-4 text-center animate-fadeIn text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Wipe All Health Records?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will delete all past readings and reports across this device and Supabase database. This action cannot be undone.
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
                onClick={handleWipeAll}
                disabled={isWiping}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer"
              >
                {isWiping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
