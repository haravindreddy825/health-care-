import React, { useState } from 'react'
import { X, Check, ShoppingBag, Sparkles, ShieldCheck, Heart, Thermometer, Camera, ArrowRight, CheckCircle2 } from 'lucide-react'

export function AuraPreorderModal({ isOpen, onClose }) {
  const [selectedFinish, setSelectedFinish] = useState('obsidian')
  const [selectedSize, setSelectedSize] = useState('32')
  const [isSuccess, setIsSuccess] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')

  if (!isOpen) return null

  const finishes = [
    { id: 'obsidian', name: 'Obsidian Space', color: 'bg-[#101415] border-[#89ceff]' },
    { id: 'titanium', name: 'Brushed Titanium', color: 'bg-slate-700 border-slate-400' },
    { id: 'frost', name: 'Frost Glass', color: 'bg-slate-200 border-white text-slate-900' },
    { id: 'arctic', name: 'Arctic Silver', color: 'bg-cyan-900 border-cyan-400' }
  ]

  const sizes = [
    { id: '24', name: '24" Vanity', price: 899, desc: 'Compact bathroom & desk mirror' },
    { id: '32', name: '32" Studio', price: 1299, desc: 'Flagship smart bedroom mirror', popular: true },
    { id: '48', name: '48" Full Length', price: 1899, desc: 'Full-body ergonomic posture mirror' }
  ]

  const currentPrice = sizes.find(s => s.id === selectedSize)?.price || 1299

  const handlePreorderSubmit = (e) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      onClose()
    }, 3500)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="aura-glass max-w-2xl w-full rounded-[40px] border border-white/20 p-6 sm:p-8 space-y-6 relative shadow-2xl animate-fadeIn text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#4edea3]/20 border-2 border-[#4edea3] flex items-center justify-center mx-auto text-[#4edea3]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">Pre-Order Reservation Confirmed!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your AuraMirror reservation priority slot has been secured. Telemetry shipment updates will be sent to your email.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePreorderSubmit} className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-[#89ceff] uppercase font-bold tracking-widest block mb-1">
                HARDWARE CUSTOMIZER & RESERVATION
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Configure Your AuraMirror
              </h3>
              <p className="text-xs text-slate-400">
                Reserve your production unit with non-contact medical-grade optical sensor package.
              </p>
            </div>

            {/* 1. Size Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-slate-300">
                1. Select Mirror Form Factor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sizes.map((sz) => (
                  <button
                    type="button"
                    key={sz.id}
                    onClick={() => setSelectedSize(sz.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      selectedSize === sz.id
                        ? 'bg-[#89ceff]/20 border-[#89ceff] shadow-lg shadow-[#89ceff]/20 text-white'
                        : 'bg-[#0b0f10]/60 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-sans text-white">{sz.name}</span>
                        {sz.popular && (
                          <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3]">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{sz.desc}</span>
                    </div>
                    <span className="text-sm font-mono font-extrabold text-[#89ceff] mt-2">${sz.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Finish Selection */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold uppercase text-slate-300">
                2. Glass & Frame Finish
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {finishes.map((fn) => (
                  <button
                    type="button"
                    key={fn.id}
                    onClick={() => setSelectedFinish(fn.id)}
                    className={`p-3 rounded-2xl border text-center font-mono text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedFinish === fn.id
                        ? 'border-[#89ceff] bg-[#89ceff]/15 text-white shadow-sm'
                        : 'border-white/10 bg-[#0b0f10]/50 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border ${fn.color}`} />
                    <span>{fn.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Included Biosensors Package */}
            <div className="p-4 rounded-2xl bg-[#0b0f10]/80 border border-white/10 space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Included Medical Hardware Package:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>MAX30102 Pulse Sensor</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>IR Thermal Array</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                  <span>MediaPipe CV Pipeline</span>
                </span>
              </div>
            </div>

            {/* Email Input & Submit */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email for reservation..."
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-[#0b0f10] border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#89ceff] font-mono"
                />

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#89ceff] to-[#4edea3] hover:opacity-95 text-[#0b0f10] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#89ceff]/25 whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 fill-current" />
                  <span>Reserve for ${currentPrice}</span>
                </button>
              </div>

              <span className="text-[10px] text-slate-500 font-mono block text-center">
                * Zero upfront deposit required today. Priority invitation token will be generated.
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
