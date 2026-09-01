import React from 'react'
import { Ruler, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function DistanceGauge() {
  const { sensorsState, visionState, isDemoMode } = useSmartMirror()

  const sensor = sensorsState.distance
  const isConnected = sensor.connected || isDemoMode
  const distance = sensor.reading ?? visionState.estimatedDistance

  // Calculate distance gauge bar (0 to 120cm range)
  const percent = distance ? Math.min(100, Math.max(0, (distance / 120) * 100)) : 0

  let statusText = 'Sensor Not Connected'
  let statusColor = 'text-slate-400'
  let barColor = 'bg-slate-700'

  if (distance !== null) {
    if (distance >= 50 && distance <= 80) {
      statusText = 'Optimal Distance'
      statusColor = 'text-emerald-400'
      barColor = 'bg-emerald-400 shadow-emerald-400/50'
    } else if (distance < 50) {
      statusText = 'Too Close — Please Step Back'
      statusColor = 'text-amber-400'
      barColor = 'bg-amber-400 shadow-amber-400/50'
    } else {
      statusText = 'Please Move Closer'
      statusColor = 'text-cyan-400'
      barColor = 'bg-cyan-400 shadow-cyan-400/50'
    }
  }

  return (
    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Ruler className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold uppercase tracking-wider">PERSON DISTANCE</span>
        </div>

        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
          distance !== null ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-rose-500/10 text-rose-300'
        }`}>
          {sensor.source === 'hardware' ? 'LIVE SENSOR' : sensor.source === 'demo' ? 'DEMO SIMULATED' : 'SENSOR NOT CONNECTED'}
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div className="text-2xl font-extrabold text-white">
          {distance !== null ? `${distance} cm` : '--'}
        </div>
        <div className={`text-[11px] font-bold ${statusColor}`}>
          {statusText}
        </div>
      </div>

      {/* Visual Range Slider Indicator */}
      <div className="relative w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-white/5">
        {/* Optimal Zone Highlight (40% to 66%) */}
        <div className="absolute left-[40%] width-[26%] h-full bg-emerald-500/20 border-x border-emerald-500/40" />
        
        {/* Current Position Marker */}
        {distance !== null && (
          <div
            style={{ width: `${percent}%` }}
            className={`h-full rounded-full transition-all duration-300 shadow-md ${barColor}`}
          />
        )}
      </div>

      <div className="flex items-center justify-between text-[9px] text-slate-500">
        <span>0 cm</span>
        <span className="text-emerald-400 font-bold">Optimal Zone: 50 – 80 cm</span>
        <span>120 cm</span>
      </div>
    </div>
  )
}
