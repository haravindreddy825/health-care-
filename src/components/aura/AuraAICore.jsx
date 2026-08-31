import React from 'react'
import { Brain, Sparkles, CheckCircle2, Cpu, Eye, User, Layers, ShieldCheck } from 'lucide-react'

export function AuraAICore() {
  const checklist = [
    {
      title: 'Real-time Fatigue & Eye Aperture (EAR)',
      desc: 'Monitors blink rate dynamics and palpebral fissure height to detect micro-sleeps and visual exhaustion.'
    },
    {
      title: '3D Cervical & Spinal Posture Tracking',
      desc: 'Computes spatial vectors between shoulder landmarks and cervical vertebrae to flag forward head posture.'
    },
    {
      title: 'Deterministic Expert Rule Decision Engine',
      desc: 'Instantly translates biological inputs into weighted wellness scores and clinically grounded action points.'
    },
    {
      title: 'Local Trend & Pattern Synthesis',
      desc: 'Provides longitudinal contextual wellness summaries and lifestyle insights entirely on-device.'
    }
  ]

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Holographic Wireframe Visualization */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-sm aspect-square rounded-[40px] aura-glass-cyan p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
            
            {/* Holographic Wireframe Grid SVG */}
            <div className="absolute inset-0 opacity-30 flex items-center justify-center pointer-events-none">
              <svg className="w-full h-full text-[#89ceff]" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.8" />
                <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.8" />
                <polygon points="100,40 140,80 140,140 100,170 60,140 60,80" fill="none" stroke="#4edea3" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Central Animated AI Core Node */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-[#0b0f10]/80 border-2 border-[#89ceff] flex items-center justify-center shadow-xl shadow-[#89ceff]/30 animate-pulse">
              <Brain className="w-12 h-12 text-[#89ceff]" />
            </div>

            {/* Floating Telemetry Indicator Pills */}
            <div className="absolute top-6 left-6 z-20 px-3 py-1 rounded-full bg-[#0b0f10]/90 border border-[#89ceff]/50 text-[10px] font-mono font-bold text-[#89ceff] shadow-lg">
              ● FACIAL MAP ACTIVE
            </div>

            <div className="absolute bottom-6 right-6 z-20 px-3 py-1 rounded-full bg-[#0b0f10]/90 border border-[#4edea3]/50 text-[10px] font-mono font-bold text-[#4edea3] shadow-lg">
              ✓ POSTURE ALIGNED
            </div>

            <div className="absolute bottom-6 left-6 z-20 px-3 py-1 rounded-full bg-[#0b0f10]/90 border border-[#b6c7eb]/50 text-[10px] font-mono font-bold text-[#b6c7eb] shadow-lg">
              FATIGUE: LOW (0.04)
            </div>
          </div>
        </div>

        {/* Right Column: Copy & Interactive Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full aura-glass text-xs font-mono text-[#89ceff] border-[#89ceff]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#4edea3]" />
              <span className="font-bold uppercase tracking-wider">THE AI CORE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Intelligent Edge Vision & Expert Inference.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              AuraMirror combines high-speed WebAssembly computer vision with an expert rule decision system and local longitudinal pattern analysis.
            </p>
          </div>

          {/* Checklist */}
          <div className="space-y-3 pt-2">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl aura-glass hover:border-[#89ceff]/40 transition-all flex items-start gap-3.5"
              >
                <div className="p-1 rounded-full bg-[#4edea3]/20 text-[#4edea3] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
