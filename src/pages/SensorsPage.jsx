import React, { useState } from 'react'
import { Cpu, Bluetooth, Network, Unplug, Sliders, RefreshCw, CheckCircle2, AlertCircle, Terminal, Heart, Thermometer, Ruler, Activity } from 'lucide-react'
import { SensorCard } from '../components/sensors/SensorCard'
import { HardwareConnectionModal } from '../components/sensors/HardwareConnectionModal'
import { DemoSimulationDrawer } from '../components/sensors/DemoSimulationDrawer'
import { useSmartMirror } from '../context/SmartMirrorContext'

export function SensorsPage() {
  const {
    sensorsState,
    isDemoMode,
    setDemoMode,
    activeProviderName
  } = useSmartMirror()

  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false)
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false)

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                HARDWARE ACQUISITION CENTER
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                Active Provider: <strong className="text-white">{activeProviderName}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Sensor Connectivity & Telemetry
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
              Direct interfacing with physical biomedical sensors via Web Serial, Web Bluetooth, and WebSocket Bridges
            </p>
          </div>

          {/* Connection Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsHardwareModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Connect Physical Sensor</span>
            </button>

            <button
              onClick={() => setIsDemoDrawerOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Demo Presets</span>
            </button>
          </div>
        </div>

        {/* Mode Explanatory Notice */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-slate-300 font-bold text-xs font-sans">
              {isDemoMode ? 'Demo Mode Active (Simulated Values)' : 'Hardware Mode Active (Strict Physical Sensor Policy)'}
            </span>
            <p className="text-[11px] text-slate-400 font-sans font-normal">
              {isDemoMode
                ? 'Simulated values are active for classroom demonstration and testing.'
                : 'Physical sensor readings must come directly from real hardware. Disconnected sensors display "Sensor Not Connected" and are excluded from deductions.'}
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
            isDemoMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
          }`}>
            {isDemoMode ? 'DEMO SIMULATOR' : 'REAL HARDWARE ONLY'}
          </span>
        </div>
      </div>

      {/* 2. Sensor Status Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans">
          CONNECTED SENSOR MATRIX
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard sensor={sensorsState.heartRate} />
          <SensorCard sensor={sensorsState.spo2} />
          <SensorCard sensor={sensorsState.temperature} />
          <SensorCard sensor={sensorsState.distance} />
        </div>
      </div>

      {/* 3. Hardware Architecture & Supported Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* USB Serial Card */}
        <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-sans">USB Serial Microcontrollers</h4>
          <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
            Directly pairs with Arduino UNO, ESP32, STM32, or Raspberry Pi Pico running standard 115200 baud serial firmware.
          </p>
          <div className="pt-2 text-[10px] text-slate-500">
            Supported Protocol: JSON & CSV Telemetry Streams
          </div>
        </div>

        {/* Bluetooth BLE Card */}
        <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Bluetooth className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-sans">Wireless Bluetooth BLE</h4>
          <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
            Connects to Bluetooth Low Energy pulse oximeters and medical thermometers implementing standard GATT health profiles.
          </p>
          <div className="pt-2 text-[10px] text-slate-500">
            Supported Services: 0x180D (Heart Rate), 0x1809 (Thermometer)
          </div>
        </div>

        {/* WebSocket Bridge Card */}
        <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white font-sans">Local Hardware Bridge</h4>
          <p className="text-xs text-slate-300 font-sans font-normal leading-relaxed">
            Connects to a background Python or Raspberry Pi bridge daemon listening on <code>ws://localhost:8765</code> for I2C/SPI sensor reading.
          </p>
          <div className="pt-2 text-[10px] text-slate-500">
            Endpoint: ws://localhost:8765
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <HardwareConnectionModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
      />

      <DemoSimulationDrawer
        isOpen={isDemoDrawerOpen}
        onClose={() => setIsDemoDrawerOpen(false)}
      />
    </div>
  )
}
