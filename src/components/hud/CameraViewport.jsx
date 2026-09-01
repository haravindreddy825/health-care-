import React, { useEffect, useRef } from 'react'
import { Camera, CameraOff, AlertCircle, RefreshCw, CheckCircle2, User, Eye } from 'lucide-react'
import { cameraManager } from '../../services/vision/CameraManager'
import { faceRecognitionService } from '../../services/vision/FaceRecognitionService'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function CameraViewport({ className = '' }) {
  const videoRef = useRef(null)
  const { cameraState, visionState, mirrorState, activeProfile } = useSmartMirror()

  useEffect(() => {
    if (videoRef.current) {
      cameraManager.startCamera(videoRef.current).then(res => {
        if (res.success) {
          faceRecognitionService.startAnalysis(cameraManager)
        }
      })
    }

    return () => {
      faceRecognitionService.stopAnalysis()
    }
  }, [])

  const handleRetryCamera = async () => {
    if (videoRef.current) {
      const res = await cameraManager.startCamera(videoRef.current)
      if (res.success) {
        faceRecognitionService.startAnalysis(cameraManager)
      }
    }
  }

  const { faceDetected, box, posture, fatigue, earValue, recognizedUser } = visionState

  return (
    <div className={`relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-[36px] overflow-hidden bg-slate-950 border border-cyan-500/30 shadow-2xl ${className}`}>
      
      {/* 1. Live WebRTC Webcam Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-100 z-10"
      />

      {/* 2. Ultra-Subtle Ambient Mirror Glare (Does NOT obscure face) */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-slate-950/20 via-transparent to-cyan-500/5" />

      {/* 3. Camera Error / Permission Fallback */}
      {!cameraState.isStreaming && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/90 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center">
            <CameraOff className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-lg font-bold text-white">Camera Initialization Required</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              {cameraState.error || 'Please grant camera access to activate the Smart Mirror vision matrix.'}
            </p>
          </div>
          <button
            onClick={handleRetryCamera}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Enable Webcam</span>
          </button>
        </div>
      )}

      {/* 4. Reticle Corner Targeting Guides */}
      <div className="absolute inset-4 z-25 pointer-events-none border border-cyan-500/15 rounded-3xl">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl" />
      </div>

      {/* 5. Center Facial Acquisition Reticle */}
      <div className="absolute inset-0 z-25 pointer-events-none flex items-center justify-center">
        <div className={`relative w-48 sm:w-64 aspect-[3/4] rounded-3xl border-2 transition-all duration-500 flex flex-col justify-between p-3 ${
          faceDetected
            ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
            : 'border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
        }`}>
          {/* Scanline laser */}
          {faceDetected && (
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scanline" />
          )}

          {/* Top Reticle Label */}
          <div className="flex items-center justify-between text-[10px] font-mono font-bold">
            <span className={`px-2 py-0.5 rounded-full ${faceDetected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
              {faceDetected ? '● TARGET ACQUIRED' : '○ SEEKING FACE'}
            </span>
            {faceDetected && (
              <span className="text-emerald-400">
                {visionState.estimatedDistance ? `${visionState.estimatedDistance} cm` : 'Optimal'}
              </span>
            )}
          </div>

          {/* Bottom Reticle Telemetry */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
            <span>Posture: <strong className={posture === 'Good' ? 'text-emerald-400' : 'text-amber-400'}>{posture}</strong></span>
            <span>Alertness: <strong className={fatigue === 'Low' ? 'text-emerald-400' : 'text-amber-400'}>{fatigue}</strong></span>
          </div>
        </div>
      </div>

      {/* 6. Top Left Live Status Pill */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-xs font-mono">
          <span className={`w-2 h-2 rounded-full ${faceDetected ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
          <span className="font-bold text-white">
            {faceDetected ? 'PERSON DETECTED' : 'CAMERA READY'}
          </span>
        </div>

        {recognizedUser && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Welcome, {recognizedUser.name}</span>
          </div>
        )}
      </div>

      {/* 7. Bottom Left Optical Specs */}
      <div className="absolute bottom-4 left-4 z-30 hidden sm:flex items-center gap-2 font-mono text-[10px] text-slate-300">
        <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-white/10">
          EAR: {earValue}
        </span>
        <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-white/10">
          Tilt: {visionState.tiltAngle}°
        </span>
      </div>

      {/* 8. Countdown Overlay (3... 2... 1...) */}
      {mirrorState === 'COUNTDOWN' && (
        <div className="absolute inset-0 z-40 bg-slate-950/70 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 animate-fadeIn">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
            PREPARING SENSOR SCAN
          </span>
          <div className="text-7xl sm:text-8xl font-extrabold font-mono text-cyan-400 animate-bounce">
            {3}
          </div>
          <p className="text-xs text-slate-300 font-mono">Please remain still and look forward</p>
        </div>
      )}
    </div>
  )
}
