import React from 'react'
import { Sliders, Sparkles, X, Check, Activity, Heart, Thermometer, Ruler, UserCheck, Eye } from 'lucide-react'
import { DEMO_PRESETS } from '../../services/sensors/DemoSensorProvider'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function DemoSimulationDrawer({ isOpen, onClose }) {
  const { isDemoMode, setDemoMode, applyDemoPreset, sensorsState } = useSmartMirror()

  if (!isOpen) return null

  const presets = Object.values(DEMO_PRESETS)

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border-l border-amber-500/30 p-6 shadow-2xl space-y-5 flex flex-col justify-between font-mono text-xs text-slate-100 overflow-y-auto animate-slideLeft">
      
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-sans">College Demo Simulator</h2>
              <span className="text-[10px] text-amber-300 font-bold">● SIMULATED DATA MODE</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Master Demo Switch */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white">Simulate Hardware Telemetry</span>
            <p className="text-[10px] text-slate-400 font-sans">
              Provides synthetic inputs when physical biomedical sensors are unavailable.
            </p>
          </div>

          <button
            onClick={() => setDemoMode(!isDemoMode)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              isDemoMode
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isDemoMode ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* Clinical Demo Scenario Presets */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            DEMO SCENARIO PRESETS
          </span>

          <div className="grid grid-cols-1 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyDemoPreset(preset.id)}
                className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-950 hover:border-amber-500/50 border border-white/5 text-left space-y-1 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-amber-300">{preset.name}</span>
                  <span className="text-[10px] text-slate-500">
                    {preset.heartRate ? `${preset.heartRate} BPM` : 'No HR'} • {preset.temperature ? `${preset.temperature}°C` : 'No Temp'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-white/5 text-[10px] text-slate-500 font-sans leading-relaxed">
        * Transparency Guarantee: When Demo Mode is active, all dashboard cards and generated reports explicitly indicate <strong className="text-amber-300">DEMO / SIMULATED DATA</strong>.
      </div>
    </div>
  )
}
