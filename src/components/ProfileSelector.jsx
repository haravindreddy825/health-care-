import React, { useState } from 'react'
import { User, Shield, QrCode, KeyRound, Check } from 'lucide-react'

export function ProfileSelector({ currentProfile, onSelectProfile, disabled = false }) {
  const [customInput, setCustomInput] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const presetProfiles = ['User 001', 'User 002', 'Guest']

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (customInput.trim()) {
      onSelectProfile(customInput.trim())
      setCustomInput('')
      setShowCustom(false)
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-sm space-y-2 no-print">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800">Active Profile:</span>
            <span className="ml-1.5 text-xs font-bold text-cyan-700 font-mono bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
              {currentProfile}
            </span>
          </div>
        </div>

        {/* Profile Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {presetProfiles.map((p) => (
            <button
              key={p}
              disabled={disabled}
              onClick={() => onSelectProfile(p)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                currentProfile === p
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            disabled={disabled}
            onClick={() => setShowCustom(!showCustom)}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
          >
            {showCustom ? 'Cancel' : '+ ID'}
          </button>
        </div>
      </div>

      {showCustom && (
        <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-2 border-t border-slate-100">
          <input
            type="text"
            placeholder="Enter Profile ID / PIN..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className="flex-1 px-3 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold rounded-lg"
          >
            Set Profile
          </button>
        </form>
      )}

      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
        <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Privacy Notice: Camera analysis is used for wellness monitoring. Identity is not determined from facial appearance.</span>
      </div>
    </div>
  )
}
