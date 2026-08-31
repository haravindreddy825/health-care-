import React from 'react'
import { Heart, Thermometer, User, Moon, Activity, Flame, CheckCircle, AlertTriangle } from 'lucide-react'

export function HealthMetricGrid({
  heartRate,
  temperature,
  posture,
  fatigue,
  isDemoMode = true
}) {
  // Determine heart rate status
  let hrStatus = 'Normal'
  let hrColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
  if (heartRate > 100) {
    hrStatus = 'Elevated'
    hrColor = 'text-rose-400 border-rose-500/30 bg-rose-950/40'
  } else if (heartRate < 60) {
    hrStatus = 'Low'
    hrColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40'
  }

  // Determine temperature status
  let tempStatus = 'Normal'
  let tempColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
  if (temperature >= 38.0) {
    tempStatus = 'Fever'
    tempColor = 'text-rose-400 border-rose-500/30 bg-rose-950/40'
  } else if (temperature >= 37.5) {
    tempStatus = 'Elevated'
    tempColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40'
  } else if (temperature < 36.0) {
    tempStatus = 'Low'
    tempColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40'
  }

  // Determine posture status color
  let postureColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
  if (posture === 'Needs Attention') {
    postureColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40'
  } else if (posture === 'Poor') {
    postureColor = 'text-rose-400 border-rose-500/30 bg-rose-950/40'
  }

  // Determine fatigue status color
  let fatigueColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
  if (fatigue === 'Medium') {
    fatigueColor = 'text-amber-400 border-amber-500/30 bg-amber-950/40'
  } else if (fatigue === 'High') {
    fatigueColor = 'text-rose-400 border-rose-500/30 bg-rose-950/40'
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Heart Rate Card */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-400">
              <Heart className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Heart Rate</span>
          </div>
          {isDemoMode && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
              Demo Sensor Data
            </span>
          )}
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {heartRate ?? '--'}
            </span>
            <span className="text-xs text-slate-400 font-semibold uppercase">BPM</span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${hrColor}`}>
            {hrStatus}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
          <span>MAX30102 Optical</span>
          <span className="font-mono text-slate-500">60-100 Normal</span>
        </div>
      </div>

      {/* 2. Temperature Card */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-400">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Temperature</span>
          </div>
          {isDemoMode && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
              Demo Sensor Data
            </span>
          )}
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {temperature ? Number(temperature).toFixed(1) : '--'}
            </span>
            <span className="text-xs text-slate-400 font-semibold uppercase">°C</span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${tempColor}`}>
            {tempStatus}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
          <span>IR Thermal Sensor</span>
          <span className="font-mono text-slate-500">&lt;38.0°C Safe</span>
        </div>
      </div>

      {/* 3. Posture Card */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Posture</span>
          </div>
          {isDemoMode && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
              Demo Sensor Data
            </span>
          )}
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">
            {posture}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${postureColor}`}>
            {posture === 'Good' ? 'Optimal' : posture === 'Needs Attention' ? 'Slouched' : 'Imbalanced'}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
          <span>Pose Landmarker</span>
          <span className="font-mono text-slate-500">Spine Alignment</span>
        </div>
      </div>

      {/* 4. Fatigue Card */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between hover:border-cyan-400/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-400">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fatigue</span>
          </div>
          {isDemoMode && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-cyan-500/30">
              Demo Sensor Data
            </span>
          )}
        </div>

        <div className="my-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">
            {fatigue}
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${fatigueColor}`}>
            {fatigue === 'Low' ? 'Alert' : fatigue === 'Medium' ? 'Drowsy' : 'Exhausted'}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60 pt-2">
          <span>Ocular / Blink Model</span>
          <span className="font-mono text-slate-500">Eye-Aspect Ratio</span>
        </div>
      </div>
    </div>
  )
}
