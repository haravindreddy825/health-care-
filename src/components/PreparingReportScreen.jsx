import React, { useState, useEffect } from 'react'
import { RefreshCw, CheckCircle2, Sparkles } from 'lucide-react'

export function PreparingReportScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    'Measurements collected',
    'Wellness indicators analyzed',
    'Wellness score calculated',
    'Previous report retrieved',
    'Current vs previous comparison prepared',
    'Improvement guidance prepared',
    'Finalizing your report...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        clearInterval(interval)
        if (onComplete) {
          setTimeout(onComplete, 300)
        }
        return prev
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onComplete, steps.length])

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-[36px] glass-panel border-cyan-500/40 text-center space-y-6 shadow-2xl animate-fadeIn">
      <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 animate-spin">
        <RefreshCw className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SYNTHESIZING TELEMETRY</span>
        </div>
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          PREPARING YOUR WELLNESS REPORT
        </h3>
        <p className="text-xs text-slate-400 font-mono">
          Applying expert clinical decision rules & comparing with baseline
        </p>
      </div>

      {/* Progress Checklist */}
      <div className="max-w-sm mx-auto text-left text-xs font-mono space-y-2.5 pt-2">
        {steps.map((step, index) => {
          const isDone = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div
              key={index}
              className={`flex items-center gap-3 transition-all duration-200 ${
                isDone
                  ? 'text-slate-200'
                  : isCurrent
                  ? 'text-cyan-300 font-bold scale-[1.02]'
                  : 'text-slate-600 opacity-50'
              }`}
            >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <span className="text-cyan-400 animate-pulse text-sm">⟳</span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                )}
              </div>
              <span className="truncate">{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
