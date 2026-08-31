import React from 'react'
import { Camera, Heart, Thermometer, Radio, Cpu, Eye, Activity, Sparkles, Check } from 'lucide-react'

export function AuraSensorsBento() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 space-y-8">
      
      {/* Section Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full aura-glass text-xs font-mono text-[#89ceff] border-[#89ceff]/30">
          <Cpu className="w-3.5 h-3.5" />
          <span className="font-bold uppercase tracking-wider">HARDWARE ACQUISITION LAYER</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Precision Multi-Modal Sensors.
        </h2>
        <p className="text-sm text-slate-400">
          Three dedicated telemetry pipelines continuously gather contactless physiological biomarkers without wearables.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Card 1: High-Res Camera (Optical Vision) - 7 Cols */}
        <div className="md:col-span-7 aura-glass rounded-[36px] p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-[#89ceff]/40 transition-all shadow-xl group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#89ceff]/15 text-[#89ceff] border border-[#89ceff]/30 shadow-inner">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-[#89ceff]/15 text-[#89ceff] border border-[#89ceff]/30">
                OPTICAL 1080P
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                High-Resolution Optical Matrix
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Streams 60fps video directly to on-device MediaPipe & OpenCV neural models. Tracks 468 3D facial landmarks to gauge ocular fatigue, blink velocity, and cervical posture alignment in real-time.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b0f10]/70 border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>Micro-Expression & EAR</span>
              </span>
              <span className="text-[#89ceff]">Sub-pixel tracking</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>Zero Cloud Streaming</span>
              </span>
              <span className="text-[#4edea3]">100% On-Device</span>
            </div>
          </div>
        </div>

        {/* Card 2: Pulse Oximetry (MAX30102) - 5 Cols */}
        <div className="md:col-span-5 aura-glass rounded-[36px] p-6 sm:p-8 space-y-6 flex flex-col justify-between hover:border-[#4edea3]/40 transition-all shadow-xl group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30 shadow-inner">
                <Heart className="w-6 h-6 fill-[#4edea3]/20" />
              </div>
              <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
                MAX30102 PPG
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Pulse Oximetry & Heart Rate
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Dual-wavelength red and infrared LED photoplethysmography sensor detects microscopic arterial blood pulsations to measure continuous heart rate and SpO2.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0b0f10]/70 border border-white/5 space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center text-slate-300">
              <span>Sampling Frequency</span>
              <span className="text-[#4edea3] font-bold">100 Hz Continuous</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Precision Threshold</span>
              <span className="text-white font-bold">±1 BPM / ±1% SpO2</span>
            </div>
          </div>
        </div>

        {/* Card 3: Medical-Grade IR Temp Sensor - 12 Cols Full Width */}
        <div className="md:col-span-12 aura-glass rounded-[36px] p-6 sm:p-8 space-y-4 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[#89ceff]/40 transition-all shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#89ceff]/15 text-[#89ceff] border border-[#89ceff]/30 shrink-0">
              <Thermometer className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Contactless Infrared Thermopile Sensor</h3>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#89ceff]/15 text-[#89ceff] border border-[#89ceff]/30">
                  THERMAL CORE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Passive medical-grade infrared thermopile array captures thermal radiation emitted from the forehead region to infer core body temperature with 0.1°C resolution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0 font-mono text-center">
            <div className="p-3.5 rounded-2xl bg-[#0b0f10]/80 border border-white/10 px-5">
              <span className="text-[10px] text-slate-400 block uppercase">Accuracy</span>
              <span className="text-lg font-bold text-[#4edea3]">±0.1°C</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0b0f10]/80 border border-white/10 px-5">
              <span className="text-[10px] text-slate-400 block uppercase">Range</span>
              <span className="text-lg font-bold text-[#89ceff]">34–42°C</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
