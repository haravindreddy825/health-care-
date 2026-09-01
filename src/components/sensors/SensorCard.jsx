import React from 'react'
import { Heart, Activity, Thermometer, Ruler, UserCheck, Eye, Wifi, WifiOff } from 'lucide-react'
import { StatusBadge } from '../ui/StatusBadge'

export function SensorCard({
  sensor, // { id, name, reading, unit, minNormal, maxNormal, connected, source, lastUpdated, error }
  className = ''
}) {
  if (!sensor) return null

  const getIcon = (id) => {
    switch (id) {
      case 'heartRate': return Heart
      case 'spo2': return Activity
      case 'temperature': return Thermometer
      case 'distance': return Ruler
      case 'posture': return UserCheck
      case 'fatigue': return Eye
      default: return Activity
    }
  }

  const Icon = getIcon(sensor.id)
  const isAvailable = sensor.reading !== null

  let normalRangeText = ''
  if (sensor.id === 'heartRate') normalRangeText = 'Normal: 60 – 100 BPM'
  if (sensor.id === 'spo2') normalRangeText = 'Normal: 95 – 100%'
  if (sensor.id === 'temperature') normalRangeText = 'Normal: 36.1 – 37.2°C'
  if (sensor.id === 'distance') normalRangeText = 'Optimal: 50 – 80 cm'
  if (sensor.id === 'posture') normalRangeText = 'Target: Good'
  if (sensor.id === 'fatigue') normalRangeText = 'Target: Low'

  return (
    <div className={`p-5 rounded-3xl bg-slate-950/70 border border-white/10 space-y-3 font-mono flex flex-col justify-between shadow-lg ${className}`}>
      
      {/* Header with Title & Source Badge */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-400">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-white uppercase block">{sensor.name}</span>
            <span className="text-[10px] text-slate-500">{normalRangeText}</span>
          </div>
        </div>

        <StatusBadge source={sensor.source} status={sensor.connected ? (sensor.source === 'hardware' ? 'LIVE SENSOR' : 'DEMO') : 'NOT CONNECTED'} size="xs" />
      </div>

      {/* Main Reading Display */}
      <div className="py-1">
        {isAvailable ? (
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-white">
              {sensor.reading}
            </span>
            {sensor.unit && (
              <span className="text-xs font-bold text-cyan-400">
                {sensor.unit}
              </span>
            )}
          </div>
        ) : (
          <div className="py-2 space-y-1">
            <span className="text-sm font-bold text-rose-400 flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5" />
              Sensor Not Connected
            </span>
            <p className="text-[10px] text-slate-500 font-sans">
              Connect hardware in Sensors tab or enable Demo Mode for presentation.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
        <span>Source: <strong className="text-slate-300 uppercase">{sensor.source}</strong></span>
        {sensor.lastUpdated && (
          <span>Updated {new Date(sensor.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        )}
      </div>
    </div>
  )
}
