import React, { useState } from 'react'
import {
  Cpu,
  Bluetooth,
  Network,
  Unplug,
  Sliders,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Heart,
  Thermometer,
  Ruler,
  Activity,
  Camera,
  Radio,
  Clock,
  Wifi,
  WifiOff,
  Zap,
  Play
} from 'lucide-react'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { HardwareConnectionModal } from '../components/sensors/HardwareConnectionModal.jsx'
import { DemoSimulationDrawer } from '../components/sensors/DemoSimulationDrawer.jsx'
import { useSmartMirror } from '../context/SmartMirrorContext.jsx'

export function SensorsPage() {
  const {
    sensorsState,
    hardwareMetrics,
    isDemoMode,
    setDemoMode,
    activeProviderName,
    cameraState,
    visionState
  } = useSmartMirror()

  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false)
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false)

  const { heartRate, spo2, temperature, distance } = sensorsState

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fadeIn pb-8 font-mono text-xs">
      
      {/* 1. Header & Live Stream Status Banner */}
      <div className="p-6 sm:p-8 rounded-[36px] glass-panel border-white/10 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/15 px-3 py-0.5 rounded-full border border-cyan-500/30">
                HARDWARE ACQUISITION & TELEMETRY MONITOR
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-sans">
                Active Provider: <strong className="text-white">{activeProviderName}</strong>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              External Sensor Monitor
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 font-sans font-normal">
              Direct physical sensor acquisition via USB Serial, Bluetooth Low Energy, and local Python bridge
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsHardwareModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Connect Hardware</span>
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

        {/* Live Stream Telemetry Header Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Bridge Status */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Radio className="w-3 h-3 text-cyan-400" />
              Sensor Bridge
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${hardwareMetrics.isBridgeConnected ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
              <span className="text-xs font-bold text-white">
                {hardwareMetrics.isBridgeConnected ? 'ONLINE (ws://8765)' : 'WAITING FOR BRIDGE'}
              </span>
            </div>
          </div>

          {/* Port / Interface */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              Active Port
            </span>
            <div className="text-xs font-bold text-white">
              {hardwareMetrics.hardwarePort || (isDemoMode ? 'DEMO-SIMULATOR' : 'No Port Active')}
            </div>
          </div>

          {/* Packet Rate */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Packet Rate
            </span>
            <div className="text-xs font-bold text-white">
              {hardwareMetrics.packetRateHz > 0 ? `${hardwareMetrics.packetRateHz} Hz` : '--'}
            </div>
          </div>

          {/* Total Packets Received */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              Packets Received
            </span>
            <div className="text-xs font-bold text-emerald-400">
              {hardwareMetrics.packetCount} packets
            </div>
          </div>
        </div>
      </div>

      {/* 2. Individual External Sensors Status Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-sans flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>INDIVIDUAL SENSOR ACQUISITION STATUS</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* MAX30102 (Heart Rate & SpO2) */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900 text-rose-400 border border-white/5">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-sans">MAX30102</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Pulse Oximeter & HR</span>
                </div>
              </div>

              <StatusBadge
                source={heartRate.source}
                status={heartRate.connected ? (heartRate.source === 'hardware' ? 'CONNECTED' : 'DEMO') : 'NOT CONNECTED'}
                size="xs"
              />
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Heart Rate:</span>
                <span className="text-xl font-extrabold text-white">
                  {heartRate.reading !== null ? `${heartRate.reading} BPM` : 'Unavailable'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Blood Oxygen (SpO₂):</span>
                <span className="text-xl font-extrabold text-white">
                  {spo2.reading !== null ? `${spo2.reading}%` : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5 flex items-center justify-between">
              <span>Hardware: <strong>I2C (0x57)</strong></span>
              <span>{heartRate.lastUpdated ? new Date(heartRate.lastUpdated).toLocaleTimeString() : 'No Packet'}</span>
            </div>
          </div>

          {/* Temperature Sensor */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900 text-amber-400 border border-white/5">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-sans">Temperature</h4>
                  <span className="text-[10px] text-slate-500 font-mono">MLX90614 / DS18B20</span>
                </div>
              </div>

              <StatusBadge
                source={temperature.source}
                status={temperature.connected ? (temperature.source === 'hardware' ? 'CONNECTED' : 'DEMO') : 'NOT CONNECTED'}
                size="xs"
              />
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Body Temperature:</span>
                <span className="text-2xl font-extrabold text-white">
                  {temperature.reading !== null ? `${temperature.reading}°C` : 'Unavailable'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">Normal range: 36.1°C – 37.2°C</span>
            </div>

            <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5 flex items-center justify-between">
              <span>Hardware: <strong>IR / Thermistor</strong></span>
              <span>{temperature.lastUpdated ? new Date(temperature.lastUpdated).toLocaleTimeString() : 'No Packet'}</span>
            </div>
          </div>

          {/* Distance Sensor */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900 text-cyan-400 border border-white/5">
                  <Ruler className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-sans">Distance Sensor</h4>
                  <span className="text-[10px] text-slate-500 font-mono">HC-SR04 / VL53L0X</span>
                </div>
              </div>

              <StatusBadge
                source={distance.source}
                status={distance.connected ? (distance.source === 'hardware' ? 'CONNECTED' : 'DEMO') : 'NOT CONNECTED'}
                size="xs"
              />
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-baseline justify-between">
                <span className="text-slate-400">Proximity:</span>
                <span className="text-2xl font-extrabold text-white">
                  {distance.reading !== null ? `${distance.reading} cm` : 'Unavailable'}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold block">{distance.proximityStatus}</span>
            </div>

            <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5 flex items-center justify-between">
              <span>Hardware: <strong>Ultrasonic / ToF</strong></span>
              <span>{distance.lastUpdated ? new Date(distance.lastUpdated).toLocaleTimeString() : 'No Packet'}</span>
            </div>
          </div>

          {/* WebRTC Camera & Face Detection */}
          <div className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 space-y-3 flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-900 text-emerald-400 border border-white/5">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase font-sans">Webcam Matrix</h4>
                  <span className="text-[10px] text-slate-500 font-mono">WebRTC Vision</span>
                </div>
              </div>

              <StatusBadge
                source="hardware"
                status={cameraState.isStreaming ? (visionState.faceDetected ? 'FACE DETECTED' : 'CAMERA READY') : 'UNAVAILABLE'}
                size="xs"
              />
            </div>

            <div className="space-y-1.5 py-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Postural Head Tilt:</span>
                <span className="font-bold text-white">{visionState.posture} ({visionState.tiltAngle}°)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Alertness (EAR):</span>
                <span className="font-bold text-white">{visionState.fatigue} ({visionState.earValue})</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5 flex items-center justify-between">
              <span>Framework: <strong>WebRTC Canvas</strong></span>
              <span className="text-emerald-400 font-bold">30 FPS Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Live Raw Stream Monitor Terminal */}
      <div className="p-6 rounded-3xl glass-panel border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">
              Live Hardware Packet Stream Log
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {hardwareMetrics.isBridgeConnected ? '🟢 STREAM ACTIVE (ws://localhost:8765)' : '🔴 WAITING FOR DATA PACKETS'}
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-white/5 font-mono text-[11px] h-48 overflow-y-auto space-y-1">
          {hardwareMetrics.rawLogStream.length === 0 ? (
            <div className="text-slate-500 flex flex-col items-center justify-center h-full space-y-2">
              <WifiOff className="w-6 h-6 text-slate-600" />
              <span>No telemetry packets received yet.</span>
              <span className="text-[10px] text-slate-600">
                Run <strong>start_sensor_bridge.bat</strong> or connect USB Serial port to begin stream.
              </span>
            </div>
          ) : (
            hardwareMetrics.rawLogStream.map((log, i) => (
              <div key={i} className="flex items-start gap-3 hover:bg-slate-900/60 px-2 py-0.5 rounded">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className="text-cyan-300 break-all">{log.raw}</span>
              </div>
            ))
          )}
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
