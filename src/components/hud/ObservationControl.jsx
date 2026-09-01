import React from 'react'
import { Play, Square, FastForward, Timer, Activity, CheckCircle2, RotateCcw } from 'lucide-react'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function ObservationControl() {
  const {
    mirrorState,
    observationDuration,
    setObservationDuration,
    countdownSeconds,
    startObservationWorkflow,
    cancelObservationWorkflow,
    finalizeObservation,
    returnToMirror
  } = useSmartMirror()

  const isObserving = mirrorState === 'OBSERVING'
  const isPreparing = mirrorState === 'PREPARING'
  const isReport = mirrorState === 'REPORT_READY'

  const progressPercent = observationDuration > 0
    ? Math.min(100, Math.max(0, ((observationDuration - countdownSeconds) / observationDuration) * 100))
    : 0

  return (
    <div className="p-4 sm:p-5 rounded-3xl glass-panel border-white/10 space-y-3 font-mono text-xs shadow-xl">
      
      {/* Observation Mode Selector / Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="font-bold uppercase tracking-wider text-slate-200">
            {isObserving
              ? 'ACTIVE OBSERVATION SCAN'
              : isPreparing
              ? 'SYNTHESIZING HEALTH REPORT...'
              : isReport
              ? 'WELLNESS REPORT READY'
              : 'WELLNESS OBSERVATION CONTROL'}
          </span>
        </div>

        {/* Duration Toggle (Only editable in IDLE) */}
        {!isObserving && !isPreparing && (
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-white/5">
            <button
              onClick={() => setObservationDuration(10)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                observationDuration === 10
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              10s Fast Check
            </button>
            <button
              onClick={() => setObservationDuration(60)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                observationDuration === 60
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              60s Clinical Scan
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar & Countdown (Visible during Observation) */}
      {isObserving && (
        <div className="space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
            <span>Collecting Multi-Modal Telemetry...</span>
            <span className="text-white font-extrabold text-sm">{countdownSeconds}s remaining</span>
          </div>

          <div className="relative w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-cyan-500/30 p-0.5">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 transition-all duration-200 shadow-md shadow-cyan-500/50"
            />
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {!isObserving && !isPreparing && !isReport && (
          <button
            onClick={() => startObservationWorkflow(observationDuration)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Wellness Check</span>
          </button>
        )}

        {isObserving && (
          <>
            <button
              onClick={cancelObservationWorkflow}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>

            <button
              onClick={() => finalizeObservation()}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/25 cursor-pointer"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Finalize Now</span>
            </button>
          </>
        )}

        {isReport && (
          <button
            onClick={returnToMirror}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Mirror</span>
          </button>
        )}
      </div>
    </div>
  )
}
