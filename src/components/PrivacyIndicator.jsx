import React, { useState } from 'react'
import { ShieldCheck, Lock, Trash2, X, Info, Check } from 'lucide-react'
import { localFaceMatcher } from '../services/localFaceMatcher'

export function PrivacyIndicator({ onClearFaceData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [clearedNotice, setClearedNotice] = useState(false)

  const handleForgetLocalData = () => {
    localFaceMatcher.clearAllLocalFaceData()
    setClearedNotice(true)
    if (onClearFaceData) onClearFaceData()
    setTimeout(() => {
      setClearedNotice(false)
      setIsOpen(false)
    }, 2000)
  }

  return (
    <>
      {/* Discreet Privacy Pill in Corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 text-[11px] font-medium flex items-center gap-1.5 shadow-sm transition-all backdrop-blur-md no-print cursor-pointer"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Private on-device matching</span>
      </button>

      {/* Privacy Information Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 max-w-lg w-full rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-7 space-y-5 relative animate-fadeIn text-slate-100">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Privacy & Data Protections
                </h3>
                <p className="text-xs text-slate-400">
                  100% On-Device Facial Session Continuity
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                This Smart Mirror utilizes <strong>privacy-first on-device feature matching</strong> to associate your past wellness sessions when you stand in front of this mirror.
              </p>
              <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>No Face Uploads:</strong> Photos and raw facial images are never sent to Supabase or external servers.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>No Real-World Identity:</strong> We never store or identify real names, age, race, or ethnicity. All sessions link to anonymous local IDs (e.g. <code>mirror_person_01</code>).</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Local Inference:</strong> All scores and metrics are evaluated locally by the deterministic rule engine without external AI APIs.</span>
                </div>
              </div>
            </div>

            {clearedNotice ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Local face matching references removed from this device!</span>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={handleForgetLocalData}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Forget Device Face Data</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
