import React, { useRef, useEffect } from 'react'
import { Camera, CameraOff, UserCheck, UserX, AlertCircle, Scan, Eye } from 'lucide-react'

export function CameraView({
  videoRef,
  isMonitoring,
  faceDetected,
  cameraError,
  postureStatus,
  fatigueLevel,
  onStartCamera,
  onStopCamera
}) {
  return (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between border border-cyan-500/20 shadow-xl">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">Optical Sensor / Smart Mirror View</h3>
            <p className="text-[11px] text-slate-400">Real-time Computer Vision Telemetry</p>
          </div>
        </div>

        {/* Face Status Pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
          faceDetected
            ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/30'
            : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
        }`}>
          {faceDetected ? (
            <>
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Face Detected</span>
            </>
          ) : (
            <>
              <UserX className="w-3.5 h-3.5 text-rose-400" />
              <span>No Face Detected</span>
            </>
          )}
        </div>
      </div>

      {/* Video Viewport with HUD Overlay */}
      <div className="relative w-full aspect-video bg-slate-950/90 rounded-xl overflow-hidden border border-cyan-500/30 mirror-hud-corner group flex items-center justify-center">
        {/* Video Element */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-500 ${
            isMonitoring && !cameraError ? 'opacity-90' : 'opacity-20'
          }`}
        />

        {/* Holographic Mirror Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-black/60" />

        {/* Animated Scan Line when monitoring */}
        {isMonitoring && !cameraError && (
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan shadow-[0_0_15px_#38bdf8] pointer-events-none" />
        )}

        {/* HUD Target Framing Box */}
        {isMonitoring && !cameraError && (
          <div className={`absolute w-56 h-64 border-2 rounded-2xl transition-all duration-500 pointer-events-none flex flex-col justify-between p-2 ${
            faceDetected ? 'border-cyan-400/70 shadow-[0_0_20px_rgba(56,189,248,0.25)]' : 'border-amber-400/50'
          }`}>
            <div className="flex justify-between text-[10px] font-mono text-cyan-400">
              <span>TARGET_LOCK</span>
              <span>{faceDetected ? 'TRACKING' : 'SEARCHING'}</span>
            </div>
            <div className="flex justify-between items-end text-[10px] font-mono text-cyan-400/70">
              <span>POSTURE: {postureStatus.toUpperCase()}</span>
              <span>FATIGUE: {fatigueLevel.toUpperCase()}</span>
            </div>
          </div>
        )}

        {/* Camera Off / Error State Overlay */}
        {(!isMonitoring || cameraError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-slate-950/80 backdrop-blur-sm">
            {cameraError ? (
              <div className="max-w-xs space-y-3">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto animate-bounce" />
                <p className="text-sm font-semibold text-rose-200">{cameraError}</p>
                <p className="text-xs text-slate-400">
                  You can continue using the smart mirror in Simulation Mode with adjustable controls.
                </p>
                <button
                  onClick={onStartCamera}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all"
                >
                  Retry Camera
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <CameraOff className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-300 font-medium">Camera Feed is Standby</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Click "Start Monitoring" below to activate camera telemetry & computer vision scanning.
                </p>
                <button
                  onClick={onStartCamera}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2 mx-auto"
                >
                  <Scan className="w-4 h-4" />
                  Activate Smart Mirror
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer HUD info */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>VISION ENGINE: {faceDetected ? 'TARGET ACQUIRED' : 'SCANNING'}</span>
        </div>
        <div className="text-slate-500 text-[11px]">
          640x480 RGB AUTO-REFLECT
        </div>
      </div>
    </div>
  )
}
