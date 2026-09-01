import React, { useState } from 'react'
import {
  Settings,
  Database,
  Mic,
  ShieldCheck,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Volume2
} from 'lucide-react'
import { isSupabaseConfigured } from '../lib/supabase'
import { useSmartMirror } from '../context/SmartMirrorContext'

export function SettingsPage() {
  const {
    isVoiceListening,
    toggleVoiceListening,
    isDemoMode,
    setDemoMode,
    clearAllData,
    showToast
  } = useSmartMirror()

  const [showWipeModal, setShowWipeModal] = useState(false)
  const [isWiping, setIsWiping] = useState(false)

  const handleWipeConfirm = async () => {
    setIsWiping(true)
    await clearAllData()
    setIsWiping(false)
    setShowWipeModal(false)
  }

  const voiceCommands = [
    { command: '"Start health analysis" / "Start scan"', action: 'Activates observation countdown & telemetry scan' },
    { command: '"Show dashboard"', action: 'Navigates to the executive overview' },
    { command: '"Show sensors" / "Hardware"', action: 'Opens the hardware connectivity center' },
    { command: '"Show recommendations"', action: 'Displays lifestyle guidance and active alerts' },
    { command: '"Show history"', action: 'Loads your chronological session history' },
    { command: '"Switch user" / "Profile"', action: 'Opens the user profiles manager' },
    { command: '"Enable demo" / "Disable demo"', action: 'Toggles synthetic hardware simulation' },
    { command: '"Read my report"', action: 'Speaks out current wellness score and priority action' }
  ]

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
            SYSTEM PREFERENCES & SECURITY
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Smart Mirror Configuration
        </h2>
        <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
          Manage hardware interfaces, speech recognition, database synchronization, and local privacy settings
        </p>
      </div>

      {/* 2. Voice Control Configuration */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-sans">Hands-Free Voice Recognition</h3>
          </div>

          <button
            onClick={toggleVoiceListening}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              isVoiceListening
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isVoiceListening ? 'LISTENING (ON)' : 'PAUSED (OFF)'}
          </button>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            AVAILABLE VOICE PHRASES
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {voiceCommands.map((item, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                <span className="text-cyan-300 font-bold block">{item.command}</span>
                <p className="text-[11px] text-slate-400 font-sans font-normal">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Database & Supabase Persistence */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white font-sans">Database & Cloud Persistence</h3>
          </div>

          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
            isSupabaseConfigured
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
          }`}>
            {isSupabaseConfigured ? 'SUPABASE CONNECTED' : 'OFFLINE LOCAL STORAGE'}
          </span>
        </div>

        <div className="space-y-2 text-slate-300 font-sans font-normal leading-relaxed text-xs">
          <p>
            Your health assessments and sensor telemetry are safely persisted across browser refreshes.
            {isSupabaseConfigured
              ? ' Synchronized to your configured Supabase PostgreSQL backend (tables: health_readings, health_analysis, recommendations).'
              : ' Currently operating in local offline cache mode.'}
          </p>
        </div>
      </div>

      {/* 4. Privacy & Data Wipe Controls */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-sans">User Privacy & Data Controls</h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-white/5">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white font-sans">Wipe All Stored Health Records</span>
            <p className="text-[11px] text-slate-400 font-sans font-normal">
              Permanently purges past readings, wellness analyses, and session history across this device.
            </p>
          </div>

          <button
            onClick={() => setShowWipeModal(true)}
            className="px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold whitespace-nowrap cursor-pointer transition-colors"
          >
            Clear Stored History
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showWipeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/40 max-w-md w-full rounded-3xl p-6 space-y-4 text-center animate-fadeIn shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-sans">Permanently Clear Health History?</h3>
              <p className="text-xs text-slate-400 font-sans font-normal leading-relaxed">
                This will delete all historical session logs and metric deltas across your active profiles. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowWipeModal(false)}
                disabled={isWiping}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeConfirm}
                disabled={isWiping}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
              >
                {isWiping ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Wipe History</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
