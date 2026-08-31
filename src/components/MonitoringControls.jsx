import React from 'react'
import {
  Play,
  Square,
  Sparkles,
  Save,
  Sliders,
  RefreshCw,
  Heart,
  Thermometer,
  UserCheck,
  Moon,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Check,
  Loader2
} from 'lucide-react'

export function MonitoringControls({
  isMonitoring,
  onToggleMonitoring,
  onAnalyzeNow,
  onSaveReading,
  isSaving,
  isAiLoading,
  aiLoadingStep = 0,
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
  demoFaceDetected,
  setDemoFaceDetected,
  onApplyScenario,
  activeScenario
}) {
  const scenarios = [
    {
      id: 'healthy',
      label: 'Healthy',
      desc: 'HR 78 • 36.7°C • Good • Low',
      color: 'hover:border-emerald-500/60 text-emerald-300'
    },
    {
      id: 'high-heart-rate',
      label: 'High Heart Rate',
      desc: 'HR 115 • 36.7°C • Good • Medium',
      color: 'hover:border-rose-500/60 text-rose-300'
    },
    {
      id: 'elevated-temperature',
      label: 'Elevated Temperature',
      desc: 'HR 88 • 38.2°C • Good • High',
      color: 'hover:border-amber-500/60 text-amber-300'
    },
    {
      id: 'poor-posture',
      label: 'Poor Posture',
      desc: 'HR 80 • 36.6°C • Poor • Medium',
      color: 'hover:border-cyan-500/60 text-cyan-300'
    },
    {
      id: 'high-fatigue',
      label: 'High Fatigue',
      desc: 'HR 95 • 36.8°C • Attention • High',
      color: 'hover:border-purple-500/60 text-purple-300'
    },
    {
      id: 'multiple-warnings',
      label: 'Multiple Warning Conditions',
      desc: 'HR 115 • 38.2°C • Poor • High',
      color: 'hover:border-rose-500/80 text-rose-400 font-bold'
    }
  ]

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 shadow-xl space-y-5 no-print">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Main Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onToggleMonitoring}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
              isMonitoring
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30'
            }`}
          >
            {isMonitoring ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Start Monitoring
              </>
            )}
          </button>

          <button
            onClick={onAnalyzeNow}
            disabled={isAiLoading}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
            {isAiLoading ? 'Analyzing...' : 'Analyze Now'}
          </button>

          <button
            onClick={onSaveReading}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Report...' : 'Save Reading'}
          </button>
        </div>

        {/* Demo Mode Switch */}
        <div className="flex items-center gap-2 self-end sm:self-auto bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Demo Sensor Mode:</span>
          <button
            type="button"
            onClick={onToggleDemoMode}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isDemoMode ? 'bg-cyan-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isDemoMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Multi-Step Analysis Loading Experience */}
      {isAiLoading && (
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-purple-300 font-bold flex items-center gap-1.5 uppercase">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              ANALYZING WELLNESS DATA...
            </span>
            <span className="text-purple-400">Step {aiLoadingStep || 4} of 5</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Reading health indicators</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Calculating wellness score</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Evaluating risk factors</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-300 animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Generating AI wellness interpretation</span>
            </div>
          </div>
        </div>
      )}

      {/* Test Scenarios & Sliders (Demo Mode) */}
      {isDemoMode && (
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
                  TEST SCENARIOS (6 PRESETS)
                </span>
                <span className="text-[10px] text-slate-400">Click a scenario to evaluate dynamic reporting</span>
              </div>
            </div>

            {/* 6 Scenario Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {scenarios.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => onApplyScenario(sc.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    activeScenario === sc.id
                      ? 'bg-slate-900 border-cyan-400 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400'
                      : 'bg-slate-950/60 border-slate-800 ' + sc.color
                  }`}
                >
                  <span className="text-xs font-bold font-sans block">{sc.label}</span>
                  <span className="text-[9px] font-mono text-slate-400 block mt-1 leading-tight">{sc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Individual Fine-Tuning Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            {/* Heart Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Heart Rate:
                </span>
                <span className="font-mono font-bold text-rose-400">{demoHeartRate} BPM</span>
              </div>
              <input
                type="range"
                min="45"
                max="140"
                value={demoHeartRate}
                onChange={(e) => setDemoHeartRate(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>45 BPM</span>
                <span>Ref: 60-100</span>
                <span>140 BPM</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-300 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temperature:
                </span>
                <span className="font-mono font-bold text-amber-400">{Number(demoTemperature).toFixed(1)} °C</span>
              </div>
              <input
                type="range"
                min="35.0"
                max="40.5"
                step="0.1"
                value={demoTemperature}
                onChange={(e) => setDemoTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>35.0°C</span>
                <span>Ref: &lt;37.5°C</span>
                <span>40.5°C</span>
              </div>
            </div>

            {/* Posture Selector */}
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Posture Alignment:
              </div>
              <div className="grid grid-cols-3 gap-1">
                {['Good', 'Needs Attention', 'Poor'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDemoPosture(p)}
                    className={`py-1 px-1.5 text-[10px] font-semibold rounded-md border transition-all ${
                      demoPosture === p
                        ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {p === 'Needs Attention' ? 'Attention' : p}
                  </button>
                ))}
              </div>
            </div>

            {/* Fatigue Selector */}
            <div className="space-y-1.5">
              <div className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Moon className="w-3.5 h-3.5 text-purple-400" /> Fatigue Level:
              </div>
              <div className="grid grid-cols-3 gap-1">
                {['Low', 'Medium', 'High'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setDemoFatigue(f)}
                    className={`py-1 px-1.5 text-[10px] font-semibold rounded-md border transition-all ${
                      demoFatigue === f
                        ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
