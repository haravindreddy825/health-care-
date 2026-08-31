import React from 'react'
import { Heart, Thermometer, User, Moon } from 'lucide-react'

export function MetricCard({
  type = 'heartRate', // 'heartRate' | 'temperature' | 'posture' | 'fatigue'
  value = '--',
  status = 'NORMAL',
  sensorLabel = null,
  reference = null,
  className = ''
}) {
  const configs = {
    heartRate: {
      label: 'Heart Rate',
      unit: 'BPM',
      icon: Heart,
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      iconFill: 'fill-rose-500/20',
      defaultSensor: 'MAX30102 Sensor',
      defaultRef: 'Ref: 60–100 BPM'
    },
    temperature: {
      label: 'Temperature',
      unit: '°C',
      icon: Thermometer,
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      iconFill: '',
      defaultSensor: 'Thermal Sensor',
      defaultRef: 'Ref: 36.1–37.2 °C'
    },
    posture: {
      label: 'Posture Alignment',
      unit: '',
      icon: User,
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      iconFill: '',
      defaultSensor: 'MediaPipe / CV',
      defaultRef: 'Spine & head aligned'
    },
    fatigue: {
      label: 'Fatigue Level',
      unit: '',
      icon: Moon,
      iconBg: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
      iconFill: '',
      defaultSensor: 'Optical & Rule AI',
      defaultRef: 'Blink frequency & tone'
    }
  }

  const conf = configs[type] || configs.heartRate
  const Icon = conf.icon

  const getStatusBadge = () => {
    const s = (status || '').toUpperCase()
    if (s === 'NORMAL' || s === 'GOOD' || s === 'OPTIMAL' || s === 'LOW') {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    }
    if (s === 'NEEDS ATTENTION' || s === 'ATTENTION' || s === 'ELEVATED' || s === 'MEDIUM') {
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
    return 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  }

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-slate-900/75 backdrop-blur-xl border border-white/10 shadow-lg hover:border-white/20 transition-all space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-2xl border shadow-inner ${conf.iconBg}`}>
          <Icon className={`w-5 h-5 ${conf.iconFill}`} />
        </div>
        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge()}`}>
          {status}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            {conf.label}
          </span>
          <span className="text-[9px] font-mono text-slate-500 uppercase">
            {sensorLabel || conf.defaultSensor}
          </span>
        </div>

        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {value}
          </span>
          {conf.unit && (
            <span className="text-xs font-mono text-slate-400 font-semibold">{conf.unit}</span>
          )}
        </div>

        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
          {reference || conf.defaultRef}
        </span>
      </div>
    </div>
  )
}
