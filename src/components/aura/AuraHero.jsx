import React, { useState, useEffect } from 'react'
import {
  Heart,
  Thermometer,
  Activity,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
  Play,
  Cpu,
  CheckCircle2,
  Waves
} from 'lucide-react'

export function AuraHero({
  onLaunchMirror,
  onOpenPreorder,
  liveHeartRate = 72,
  liveTemp = 36.7
}) {
  const [pulse, setPulse] = useState(72)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000)
    const pulseTimer = setInterval(() => {
      setPulse(72 + Math.floor(Math.random() * 5 - 2))
    }, 2000)
    return () => {
      clearInterval(clock)
      clearInterval(pulseTimer)
    }
  }, [])

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-8 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#89ceff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#4edea3]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Column: Hero Typography & CTAs */}
      <div className="flex-1 space-y-6 text-center lg:text-left z-10">
        
        {/* Top Clinical Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full aura-glass border-[#89ceff]/30 text-xs font-mono text-[#89ceff] shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#4edea3]" />
          <span className="font-bold tracking-wider uppercase">Next-Gen Optical Biosensing</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Your Health, <br />
            <span className="bg-gradient-to-r from-[#89ceff] via-[#4edea3] to-[#b6c7eb] bg-clip-text text-transparent">
              Reflected.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
            A medical-grade smart mirror integrating non-contact optical oximetry, thermopile sensing, and real-time computer vision into a reflective glass interface.
          </p>
        </div>

        {/* Feature Pill Tags */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 font-mono text-[11px] text-slate-400">
          <span className="px-3 py-1 rounded-full bg-[#0b0f10]/80 border border-white/10 text-[#89ceff]">
            MAX30102 PPG
          </span>
          <span className="px-3 py-1 rounded-full bg-[#0b0f10]/80 border border-white/10 text-[#4edea3]">
            IR THERMOPILE
          </span>
          <span className="px-3 py-1 rounded-full bg-[#0b0f10]/80 border border-white/10 text-[#b6c7eb]">
            OPENCV / MEDIAPIPE
          </span>
          <span className="px-3 py-1 rounded-full bg-[#0b0f10]/80 border border-white/10 text-slate-300">
            0-BIOMETRIC CLOUD
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
          <button
            onClick={onLaunchMirror}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#89ceff] via-[#4edea3] to-[#89ceff] hover:opacity-95 text-[#0b0f10] font-extrabold text-sm uppercase tracking-wider shadow-xl shadow-[#89ceff]/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Smart Mirror</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenPreorder}
            className="w-full sm:w-auto px-7 py-4 rounded-full aura-glass hover:border-[#89ceff]/50 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Pre-order AuraMirror</span>
          </button>
        </div>
      </div>

      {/* Right Column: Glassmorphic Smart Mirror Vertical HUD */}
      <div className="flex-1 w-full max-w-md mx-auto lg:max-w-none flex justify-center z-10">
        <div className="relative w-full max-w-[380px] aspect-[9/16] rounded-[44px] aura-glass p-5 flex flex-col justify-between shadow-2xl border-2 border-white/15 animate-float overflow-hidden">
          
          {/* Subtle Ambient HUD Reflection Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#89ceff]/10 via-transparent to-[#4edea3]/5 pointer-events-none" />

          {/* Top HUD Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping" />
              <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
                AURA OS v2.4
              </span>
            </div>
            <span className="font-mono text-xs text-[#89ceff] font-bold">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Middle HUD: Live Biowave & Vitals Stack */}
          <div className="space-y-4 my-auto z-10">
            
            {/* Animated ECG Biowave Card */}
            <div className="p-4 rounded-3xl bg-[#0b0f10]/70 border border-[#89ceff]/30 shadow-inner space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#89ceff]" />
                  PHOTOPLETHYSMOGRAPHY
                </span>
                <span className="text-[#4edea3] font-bold">LIVE OPTICAL</span>
              </div>

              {/* Animated SVG ECG Wave */}
              <div className="relative h-12 w-full overflow-hidden flex items-center">
                <svg className="w-[200%] h-full text-[#89ceff] animate-ecg" viewBox="0 0 400 40">
                  <path
                    d="M 0 20 L 40 20 L 50 5 L 60 35 L 70 10 L 80 25 L 90 20 L 140 20 L 150 5 L 160 35 L 170 10 L 180 25 L 190 20 L 240 20 L 250 5 L 260 35 L 270 10 L 280 25 L 290 20 L 340 20 L 350 5 L 360 35 L 370 10 L 380 25 L 390 20 L 400 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold font-mono text-white tracking-tight">{pulse}</span>
                  <span className="text-xs font-mono text-slate-400 font-bold">BPM</span>
                </div>
                <span className="text-[10px] font-mono text-[#89ceff] bg-[#89ceff]/10 px-2 py-0.5 rounded-full border border-[#89ceff]/20 font-semibold">
                  SpO2: 98%
                </span>
              </div>
            </div>

            {/* Twin Telemetry Pills (Temperature & Posture) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-[#0b0f10]/70 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>TEMP</span>
                  <span className="text-[#4edea3]">THERMAL</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold font-mono text-white">98.6</span>
                  <span className="text-xs font-mono text-slate-400">°F</span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 block">36.7°C Norm</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0b0f10]/70 border border-white/10 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>POSTURE</span>
                  <span className="text-[#89ceff]">CV MESH</span>
                </div>
                <div className="text-xl font-extrabold font-sans text-[#4edea3]">
                  Aligned
                </div>
                <span className="text-[9px] font-mono text-slate-500 block">0° Spine Tilt</span>
              </div>
            </div>

            {/* Daily Health Summary Preview */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#89ceff]/15 to-[#4edea3]/15 border border-[#89ceff]/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#89ceff] font-bold block">
                  DAILY WELLNESS
                </span>
                <span className="text-sm font-extrabold text-white">
                  Score: 88 / 100
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#4edea3]/20 border border-[#4edea3]/40 text-[#4edea3] text-[10px] font-mono font-bold">
                NORMAL
              </span>
            </div>
          </div>

          {/* Bottom HUD Bar */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-white/10 z-10">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4edea3]" />
              <span>Continuous Defense</span>
            </span>
            <span className="text-[#89ceff]">Non-Contact Optical</span>
          </div>
        </div>
      </div>
    </section>
  )
}
