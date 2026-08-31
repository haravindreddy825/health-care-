import React, { useState } from 'react'
import {
  Sliders,
  Sparkles,
  Heart,
  Thermometer,
  User,
  Moon,
  ChevronUp,
  ChevronDown,
  Play,
  RotateCcw,
  Zap,
  Cpu
} from 'lucide-react'

export function SensorSimulatorDrawer({
  heartRate,
  setHeartRate,
  temperature,
  setTemperature,
  posture,
  setPosture,
  fatigue,
  setFatigue,
  observationDuration,
  setObservationDuration,
  onApplyScenario,
  onRunTestNow
}) {
  const [isOpen, setIsOpen] = useState(false)

  const scenarios = [
    { id: 'healthy', label: 'Healthy Baseline', score: '95–100', hr: 74, temp: 36.7, post: 'Good', fat: 'Low' },
    { id: 'high-hr', label: 'Tachycardia (High HR)', score: '~75', hr: 112, temp: 36.7, post: 'Good', fat: 'Medium' },
    { id: 'fever', label: 'Fever (Elevated Temp)', score: '~65', hr: 88, temp: 38.3, post: 'Good', fat: 'High' },
    { id: 'slouch', label: 'Poor Posture Slouch', score: '~75', hr: 78, temp: 36.6, post: 'Poor', fat: 'Low' },
    { id: 'fatigue', label: 'High Fatigue Strain', score: '~75', hr: 94, temp: 36.8, post: 'Needs Attention', fat: 'High' },
    { id: 'critical', label: 'Multi-Warning State', score: '~45', hr: 118, temp: 38.4, post: 'Poor', fat: 'High' }
  ]

  const handleSelectScenario = (sc) => {
    setHeartRate(sc.hr)
    setTemperature(sc.temp)
    setPosture(sc.post)
    setFatigue(sc.fat)
    if (onApplyScenario) onApplyScenario(sc.id)
  }

  return (
    <div className="fixed bottom-3 right-4 z-40 no-print font-mono text-xs">
      
      {/* Toggle Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-cyan-500/40 text-cyan-300 shadow-2xl flex items-center gap-2 backdrop-blur-xl transition-all cursor-pointer"
      >
        <Cpu className="w-4 h-4 text-cyan-400" />
        <span className="font-bold uppercase tracking-wider">Telemetry Testing Console</span>
        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Drawer Body */}
      {isOpen && (
        <div className="mt-2 w-80 sm:w-96 rounded-3xl bg-slate-900/95 border border-white/15 p-5 shadow-2xl space-y-4 backdrop-blur-2xl text-slate-200 animate-fadeIn max-h-[75vh] overflow-y-auto">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Hardware Telemetry Presets
            </span>
            <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full">
              Live Testing
            </span>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Preset Health Scenarios:</span>
            <div className="grid grid-cols-2 gap-2">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-white/5 text-left transition-all cursor-pointer space-y-0.5"
                >
                  <div className="text-[11px] font-bold text-white truncate">{sc.label}</div>
                  <span className="text-[9px] text-cyan-300 block">Target: {sc.score} pts</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-2 border-t border-white/10 text-[11px]">
            {/* Heart Rate Slider */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">MAX30102 Heart Rate:</span>
                <span className="font-bold text-rose-300">{heartRate} BPM</span>
              </div>
              <input
                type="range"
                min="45"
                max="145"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full accent-rose-400 cursor-pointer"
              />
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">IR Body Temperature:</span>
                <span className="font-bold text-cyan-300">{Number(temperature).toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="35.0"
                max="40.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Posture Select */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Posture Alignment:</span>
              <select
                value={posture}
                onChange={(e) => setPosture(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value="Good">Good (Upright)</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Poor">Poor (Slouch)</option>
              </select>
            </div>

            {/* Fatigue Select */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Fatigue Index:</span>
              <select
                value={fatigue}
                onChange={(e) => setFatigue(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value="Low">Low (Alert)</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Drowsy)</option>
              </select>
            </div>

            {/* Observation Duration */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-400">Scan Duration:</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setObservationDuration(10)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    observationDuration === 10 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  10s Fast
                </button>
                <button
                  onClick={() => setObservationDuration(60)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    observationDuration === 60 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  60s Full
                </button>
              </div>
            </div>
          </div>

          {/* Quick Trigger Button */}
          <button
            onClick={() => {
              setIsOpen(false)
              if (onRunTestNow) onRunTestNow()
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate Check Now (&lt;2s)</span>
          </button>
        </div>
      )}
    </div>
  )
}
