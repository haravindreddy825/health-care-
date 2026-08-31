import React, { useState } from 'react'
import {
  Settings,
  X,
  Sliders,
  Sparkles,
  RotateCcw,
  FastForward,
  Play,
  Heart,
  Thermometer,
  UserCheck,
  Moon,
  Shield,
  Clock,
  Zap
} from 'lucide-react'

export function DemoTestingDrawer({
  isDemoMode,
  onToggleDemoMode,
  demoHeartRate,
  setDemoHeartRate,
  demoTemperature,
  setDemoTemperature,
  demoPosture,
  setDemoPosture,
  demoFatigue,
  setDemoFatigue,
  observationDurationSetting = 10,
  onChangeObservationDuration,
  onApplyScenario,
  activeScenario,
  onSimulateDetection,
  onRunTestNow,
  onResetIdle
}) {
  const [isOpen, setIsOpen] = useState(false)

  const scenarios = [
    { id: 'healthy', label: 'Healthy', desc: 'HR 78 • 36.7°C • Good • Low' },
    { id: 'high-heart-rate', label: 'High Heart Rate', desc: 'HR 115 • 36.7°C • Good • Medium' },
    { id: 'elevated-temperature', label: 'Elevated Temperature', desc: 'HR 88 • 38.2°C • Good • High' },
    { id: 'poor-posture', label: 'Poor Posture', desc: 'HR 80 • 36.6°C • Poor • Medium' },
    { id: 'high-fatigue', label: 'High Fatigue', desc: 'HR 95 • 36.8°C • Attention • High' },
    { id: 'multiple-warnings', label: 'Multiple Warnings', desc: 'HR 115 • 38.2°C • Poor • High' }
  ]

  return (
    <div className="no-print">
      {/* Floating Discreet Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-mono font-semibold border border-white/15 shadow-xl flex items-center gap-2 backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
      >
        <Settings className="w-3.5 h-3.5 text-cyan-400" />
        <span>Demo Controls</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-5 border-l border-white/10 text-slate-100 animate-slideLeft">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
                  DEMO CONTROLLER
                </span>
                <h3 className="text-base font-bold text-white">
                  Scenario & Speed Settings
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Triggers */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                Workflow Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onRunTestNow()
                    setIsOpen(false)
                  }}
                  className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md col-span-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Run Test Now (Instant &lt; 3s)</span>
                </button>

                <button
                  onClick={() => {
                    onSimulateDetection()
                    setIsOpen(false)
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Approach</span>
                </button>
                <button
                  onClick={() => {
                    onResetIdle()
                    setIsOpen(false)
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Idle</span>
                </button>
              </div>
            </div>

            {/* Observation Duration Setting (Default: 10s Fast Demo) */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Observation Speed:
              </span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onChangeObservationDuration(10)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    observationDurationSetting === 10
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 font-bold shadow-sm'
                      : 'bg-slate-850 text-slate-300 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  10 Sec (Fast Demo) ⭐
                </button>
                <button
                  onClick={() => onChangeObservationDuration(120)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    observationDurationSetting === 120
                      ? 'bg-cyan-500 text-slate-950 border-cyan-500 font-bold shadow-sm'
                      : 'bg-slate-850 text-slate-300 border-white/10 hover:bg-slate-800'
                  }`}
                >
                  2 Min (Standard)
                </button>
              </div>
            </div>

            {/* 6 Scenarios */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                6 Clinical Scenarios
              </span>
              <div className="space-y-1.5">
                {scenarios.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      onApplyScenario(sc.id)
                      setIsOpen(false)
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      activeScenario === sc.id
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-sm'
                        : 'bg-slate-950/50 border-white/5 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold font-sans block text-white">{sc.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">{sc.desc}</span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-slate-300 uppercase font-mono block">
                Manual Sensor Overrides
              </span>

              {/* Heart Rate */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-400" /> HR:
                  </span>
                  <span className="font-mono font-bold text-white">{demoHeartRate} BPM</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="140"
                  value={demoHeartRate}
                  onChange={(e) => setDemoHeartRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Temperature */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-cyan-400" /> Temp:
                  </span>
                  <span className="font-mono font-bold text-white">{Number(demoTemperature).toFixed(1)} °C</span>
                </div>
                <input
                  type="range"
                  min="35.0"
                  max="40.5"
                  step="0.1"
                  value={demoTemperature}
                  onChange={(e) => setDemoTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Posture */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Posture:</span>
                <div className="grid grid-cols-3 gap-1">
                  {['Good', 'Needs Attention', 'Poor'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setDemoPosture(p)}
                      className={`py-1 text-[10px] font-semibold rounded border cursor-pointer ${
                        demoPosture === p ? 'bg-cyan-500 text-slate-950 border-cyan-500 font-bold' : 'bg-slate-950/50 border-white/5 text-slate-300'
                      }`}
                    >
                      {p === 'Needs Attention' ? 'Attention' : p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fatigue */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Fatigue:</span>
                <div className="grid grid-cols-3 gap-1">
                  {['Low', 'Medium', 'High'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setDemoFatigue(f)}
                      className={`py-1 text-[10px] font-semibold rounded border cursor-pointer ${
                        demoFatigue === f ? 'bg-violet-500 text-white border-violet-500 font-bold' : 'bg-slate-950/50 border-white/5 text-slate-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
