import React, { useState } from 'react'
import { Cpu, Bluetooth, Network, X, CheckCircle2, AlertCircle, RefreshCw, Unplug, ShieldCheck } from 'lucide-react'
import { sensorManager } from '../../services/sensors/SensorManager'
import { useSmartMirror } from '../../context/SmartMirrorContext'

export function HardwareConnectionModal({ isOpen, onClose }) {
  const { showToast } = useSmartMirror()
  const [activeType, setActiveType] = useState('serial') // 'serial' | 'bluetooth' | 'bridge'
  const [baudRate, setBaudRate] = useState(115200)
  const [bridgeUrl, setBridgeUrl] = useState('ws://localhost:8765')
  const [isConnecting, setIsConnecting] = useState(false)
  const [statusMessage, setStatusMessage] = useState(null)
  const [statusType, setStatusType] = useState(null) // 'success' | 'error'

  if (!isOpen) return null

  const handleConnectSerial = async () => {
    setIsConnecting(true)
    setStatusMessage(null)
    try {
      const res = await sensorManager.connectSerial({ baudRate: Number(baudRate) })
      setStatusType('success')
      setStatusMessage(res.message || 'Connected to USB Serial port successfully!')
      showToast('USB Serial sensor hardware connected!')
    } catch (err) {
      setStatusType('error')
      setStatusMessage(err.message || 'Failed to connect to serial device.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnectBluetooth = async () => {
    setIsConnecting(true)
    setStatusMessage(null)
    try {
      const res = await sensorManager.connectBluetooth()
      setStatusType('success')
      setStatusMessage(res.message || 'Connected to BLE health device!')
      showToast('Bluetooth health device connected!')
    } catch (err) {
      setStatusType('error')
      setStatusMessage(err.message || 'Failed to connect to Bluetooth device.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleConnectBridge = async () => {
    setIsConnecting(true)
    setStatusMessage(null)
    try {
      const res = await sensorManager.connectBridge({ url: bridgeUrl })
      setStatusType('success')
      setStatusMessage(res.message || 'Connected to local hardware bridge!')
      showToast('Local hardware bridge connected!')
    } catch (err) {
      setStatusType('error')
      setStatusMessage(err.message || 'Failed to connect to local hardware bridge.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    await sensorManager.disconnectAll()
    setStatusType('success')
    setStatusMessage('Hardware disconnected. Sensors reset to offline state.')
    showToast('Hardware disconnected')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/30 max-w-xl w-full rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn text-slate-100 font-mono text-xs">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-base font-bold text-white font-sans">Hardware Connection Center</h2>
              <p className="text-[11px] text-slate-400">Connect real microcontrollers and biomedical sensors</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => { setActiveType('serial'); setStatusMessage(null); }}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
              activeType === 'serial'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>USB Serial</span>
          </button>

          <button
            onClick={() => { setActiveType('bluetooth'); setStatusMessage(null); }}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
              activeType === 'bluetooth'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Bluetooth className="w-4 h-4" />
            <span>Bluetooth BLE</span>
          </button>

          <button
            onClick={() => { setActiveType('bridge'); setStatusMessage(null); }}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
              activeType === 'bridge'
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Bridge Daemon</span>
          </button>
        </div>

        {/* Configuration Body */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4">
          {activeType === 'serial' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase text-[10px]">Baud Rate</label>
                <select
                  value={baudRate}
                  onChange={(e) => setBaudRate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                >
                  <option value={115200}>115200 baud (Recommended for ESP32 / Arduino)</option>
                  <option value={9600}>9600 baud (Standard Arduino UNO)</option>
                  <option value={57600}>57600 baud</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <span className="text-cyan-400 font-bold block">Supported Serial Formats:</span>
                <p>1. JSON: <code>{"{\"hr\": 78, \"spo2\": 98, \"temp\": 36.7, \"dist\": 65}"}</code></p>
                <p>2. CSV: <code>78,98,36.7,65</code> (HR, SpO2, Temp, Distance)</p>
              </div>

              <button
                onClick={handleConnectSerial}
                disabled={isConnecting}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                <span>Select & Pair USB Serial Port</span>
              </button>
            </div>
          )}

          {activeType === 'bluetooth' && (
            <div className="space-y-3">
              <p className="text-slate-300 leading-relaxed">
                Connects to standard wireless Bluetooth Low Energy (BLE) pulse oximeters, smart wristbands, and medical thermometers.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <p>• Standard Heart Rate Service (UUID: <code>0x180D</code>)</p>
                <p>• Health Thermometer Service (UUID: <code>0x1809</code>)</p>
              </div>

              <button
                onClick={handleConnectBluetooth}
                disabled={isConnecting}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bluetooth className="w-4 h-4" />}
                <span>Scan & Pair BLE Health Device</span>
              </button>
            </div>
          )}

          {activeType === 'bridge' && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold uppercase text-[10px]">WebSocket Server URL</label>
                <input
                  type="text"
                  value={bridgeUrl}
                  onChange={(e) => setBridgeUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:border-cyan-400 focus:outline-none"
                  placeholder="ws://localhost:8765"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Connect to a local Raspberry Pi or Python background daemon reading I2C/SPI sensors.
              </p>

              <button
                onClick={handleConnectBridge}
                disabled={isConnecting}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Network className="w-4 h-4" />}
                <span>Connect to WebSocket Daemon</span>
              </button>
            </div>
          )}
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`p-3.5 rounded-2xl flex items-start gap-2 text-xs ${
            statusType === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}>
            {statusType === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <button
            onClick={handleDisconnect}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-rose-400 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Unplug className="w-3.5 h-3.5" />
            <span>Disconnect Hardware</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
