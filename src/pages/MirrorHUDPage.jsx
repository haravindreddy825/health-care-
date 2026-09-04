import React, { useState } from 'react'
import { CameraViewport } from '../components/hud/CameraViewport.jsx'
import { DistanceGauge } from '../components/hud/DistanceGauge.jsx'
import { ObservationControl } from '../components/hud/ObservationControl.jsx'
import { SensorCard } from '../components/sensors/SensorCard.jsx'
import { ReportModal } from '../components/analysis/ReportModal.jsx'
import { HardwareConnectionModal } from '../components/sensors/HardwareConnectionModal.jsx'
import { DemoSimulationDrawer } from '../components/sensors/DemoSimulationDrawer.jsx'
import { useSmartMirror } from '../context/SmartMirrorContext.jsx'
import { Sparkles, Cpu, Sliders, CheckCircle2, User, Eye, UserCheck, ShieldCheck } from 'lucide-react'

export function MirrorHUDPage() {
  const {
    sensorsState,
    mirrorState,
    latestReport,
    latestComparison,
    activeProfile,
    isDemoMode,
    startObservationWorkflow
  } = useSmartMirror()

  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false)
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5 animate-fadeIn pb-8">
      
      {/* 1. Top Smart Mirror User Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl glass-panel border-white/10 font-mono text-xs shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold font-sans text-sm">
                Welcome back, {activeProfile?.name || 'Jaswanth'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">
                {activeProfile?.scanCount ? `Registered User (${activeProfile.scanCount} scans)` : 'Active Profile'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Stand centered in front of the mirror within 50–80 cm for optimal reading
            </p>
          </div>
        </div>

        {/* Quick Hardware / Demo Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsHardwareModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-white/10 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hardware Status</span>
          </button>

          <button
            onClick={() => setIsDemoDrawerOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Presets</span>
          </button>
        </div>
      </div>

      {/* 2. Main Smart Mirror Visual Matrix (Camera on Left, Telemetry & Distance on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: High-Visibility Camera + Observation Control */}
        <div className="lg:col-span-8 space-y-4">
          <CameraViewport />
          <ObservationControl />
        </div>

        {/* Right Column: Proximity Distance & 4 Live Vitals Cards */}
        <div className="lg:col-span-4 space-y-4">
          {/* Proximity Distance Gauge */}
          <DistanceGauge />

          {/* 4 Required Biomedical Sensor Cards */}
          <div className="space-y-3">
            <SensorCard sensor={sensorsState.heartRate} />
            <SensorCard sensor={sensorsState.spo2} />
            <SensorCard sensor={sensorsState.temperature} />
            <SensorCard sensor={sensorsState.distance} />
          </div>

          {/* Optical Posture & Fatigue Quick Bar */}
          <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-white/10 font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Spinal Posture</span>
              <span className={`text-sm font-bold ${sensorsState.posture.reading === 'Good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {sensorsState.posture.reading}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Alertness</span>
              <span className={`text-sm font-bold ${sensorsState.fatigue.reading === 'Low' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {sensorsState.fatigue.reading}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Post-Observation Report Button Banner (if report is ready) */}
      {mirrorState === 'REPORT_READY' && latestReport && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border border-cyan-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn shadow-2xl">
          <div className="space-y-1 text-center sm:text-left font-mono">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs uppercase font-bold text-cyan-300">
                WELLNESS ASSESSMENT READY
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-white font-extrabold text-sm">
                Score: {latestReport.wellnessScore}/100 ({latestReport.healthStatus})
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans font-normal">
              {latestReport.priorityAction}
            </p>
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>View Full Report</span>
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <HardwareConnectionModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
      />

      <DemoSimulationDrawer
        isOpen={isDemoDrawerOpen}
        onClose={() => setIsDemoDrawerOpen(false)}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        report={latestReport}
        comparison={latestComparison}
        profileName={activeProfile?.name}
      />
    </div>
  )
}
