import React, { useState } from 'react'
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Brain,
  Trash2,
  Check,
  AlertTriangle,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { GlassCard, GradientCard } from '../components/ui/GlassCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { localFaceMatcher } from '../services/localFaceMatcher'
import { deleteProfileHealthHistory } from '../services/supabaseHealth'

export function PrivacyPage({
  currentProfile = 'mirror_person_01',
  onHistoryCleared = null
}) {
  const [clearedFaceNotice, setClearedFaceNotice] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [cloudNotice, setCloudNotice] = useState(null)

  const handleForgetLocalData = () => {
    localFaceMatcher.clearAllLocalFaceData()
    setClearedFaceNotice(true)
    setTimeout(() => setClearedFaceNotice(false), 3500)
  }

  const handleDeleteCloudHistory = async () => {
    setIsDeleting(true)
    const res = await deleteProfileHealthHistory(currentProfile)
    setIsDeleting(false)
    setShowDeleteModal(false)

    if (res.success) {
      setCloudNotice({ text: 'All cloud-stored session history was successfully deleted.', type: 'success' })
      if (onHistoryCleared) onHistoryCleared()
    } else {
      setCloudNotice({ text: 'Failed to delete cloud history: ' + res.error, type: 'error' })
    }
    setTimeout(() => setCloudNotice(null), 4000)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* 1. HEADER BANNER */}
      <GlassCard className="p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/15 px-3 py-0.5 rounded-full border border-emerald-500/30">
                PRIVACY & SECURITY
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400 font-medium">
                On-Device Data Protections
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Privacy & Data Protections
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              100% on-device facial session continuity & anonymous health records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Biometric Cloud Storage</span>
            </span>
          </div>
        </div>

        {/* Action Notices */}
        {clearedFaceNotice && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Local face recognition reference data has been removed from this browser.</span>
          </div>
        )}

        {cloudNotice && (
          <div className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
            cloudNotice.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}>
            <Check className="w-4 h-4" />
            <span>{cloudNotice.text}</span>
          </div>
        )}
      </GlassCard>

      {/* 2. THREE CORE PRIVACY PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">No Face Uploads</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Your camera images and biometric facial templates are never sent to external servers or cloud databases. All facial detection occurs locally inside your browser.
          </p>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">Anonymous Identity</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            No username, login, or real names are used. Returning session continuity is linked via an anonymous device token (e.g. <code className="text-cyan-300 font-mono">mirror_person_01</code>).
          </p>
        </GlassCard>

        <GlassCard className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white font-sans">100% Local Inference</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            All physiological assessments and wellness scores are calculated on-device by the deterministic local clinical rule engine without any external AI API.
          </p>
        </GlassCard>
      </div>

      {/* 3. USER DATA CONTROLS */}
      <GlassCard className="p-6 sm:p-8 space-y-5">
        <SectionHeader
          title="Your Data Controls"
          subtitle="Manage locally stored tokens and cloud session records"
          icon={Database}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Action 1: Clear Face Data */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase text-white block">
                Local Face References
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Clears on-device local face descriptors stored in browser memory for returning-person recognition.
              </p>
            </div>

            <button
              onClick={handleForgetLocalData}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-200 hover:text-white text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Forget This Device's Face Data</span>
            </button>
          </div>

          {/* Action 2: Clear Cloud History */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-white/5 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase text-white block">
                Cloud Session History
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Erases all past telemetry readings and wellness analysis reports stored for this profile in Supabase.
              </p>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Cloud Session History</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-md w-full rounded-3xl border border-rose-500/30 shadow-2xl p-6 space-y-4 text-center animate-fadeIn text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Delete Session History?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will permanently delete all stored health telemetry and reports from the database. This action cannot be undone.
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
                onClick={handleDeleteCloudHistory}
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
