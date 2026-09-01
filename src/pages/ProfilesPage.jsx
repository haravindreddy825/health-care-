import React, { useState } from 'react'
import { Users, UserPlus, UserCheck, Trash2, CheckCircle2, ShieldCheck, User } from 'lucide-react'
import { useSmartMirror } from '../context/SmartMirrorContext'

export function ProfilesPage() {
  const {
    profiles,
    activeProfile,
    switchProfile,
    createNewProfile,
    deleteProfile,
    showToast
  } = useSmartMirror()

  const [newName, setNewName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    createNewProfile(newName.trim())
    setNewName('')
    setShowAddForm(false)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                USER RECOGNITION & IDENTITIES
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                Active Profile: <strong className="text-white">{activeProfile?.name}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              User Profiles & Face Recognition
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
              Manage saved facial representations and isolate multi-session history comparison per user
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <form onSubmit={handleCreate} className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/30 space-y-3 animate-fadeIn">
            <h3 className="text-sm font-bold text-white font-sans">Register New Smart Mirror Profile</h3>
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter user name (e.g. Jordan Lee)"
                className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold whitespace-nowrap cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Registered Profiles Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
          REGISTERED USER IDENTITIES ({profiles.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profiles.map((p) => {
            const isActive = p.id === activeProfile?.id
            return (
              <div
                key={p.id}
                className={`p-5 rounded-3xl border transition-all space-y-3 shadow-xl ${
                  isActive
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-cyan-500/10'
                    : 'glass-panel border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base ${
                      isActive ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white font-sans">{p.name}</h4>
                        {isActive && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">ID: {p.id}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <button
                        onClick={() => switchProfile(p.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-cyan-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Select
                      </button>
                    )}

                    {profiles.length > 1 && (
                      <button
                        onClick={() => deleteProfile(p.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Facial Representation: <strong className="text-emerald-400">Enrolled</strong></span>
                  <span>Created: {new Date(p.createdAt || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Privacy & Feature Vector Guarantee */}
      <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-2 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <h4 className="text-xs font-bold uppercase tracking-wider font-sans">Biometric Privacy Guarantee</h4>
        </div>
        <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
          Raw facial photos are processed in temporary browser memory. Only mathematical landmark geometry representations are stored to identify returning users across sessions.
        </p>
      </div>
    </div>
  )
}
