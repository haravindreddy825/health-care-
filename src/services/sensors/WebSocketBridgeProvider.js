/**
 * WebSocketBridgeProvider.js
 * Connects to the local Python / Raspberry Pi hardware sensor bridge daemon
 * Default endpoints: ws://localhost:8765 (WebSocket) and http://localhost:8766/api/sensors (REST Fallback)
 */

export class WebSocketBridgeProvider {
  constructor() {
    this.name = 'Python Local Hardware Bridge'
    this.ws = null
    this.isConnected = false
    this.onDataCallback = null
    this.onErrorCallback = null
    this.onStatusChangeCallback = null
    this.url = 'ws://localhost:8765'
    this.httpFallbackUrl = 'http://localhost:8766/api/sensors'

    this.reconnectTimer = null
    this.isAutoReconnectEnabled = true
    this.lastPacketTime = null
    this.packetCount = 0
    this.pollingTimer = null
  }

  isSupported() {
    return typeof window !== 'undefined' && 'WebSocket' in window
  }

  async connect(options = { url: 'ws://localhost:8765' }) {
    if (!this.isSupported()) {
      throw new Error('WebSockets are not supported in this browser.')
    }

    this.url = options.url || 'ws://localhost:8765'
    this.isAutoReconnectEnabled = true

    return new Promise((resolve) => {
      try {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
          this.ws.close()
        }

        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          this.isConnected = true
          this.stopPollingFallback()
          if (this.onStatusChangeCallback) this.onStatusChangeCallback(true, `Connected to Sensor Bridge at ${this.url}`)
          resolve({ success: true, message: `Connected to Hardware Bridge at ${this.url}` })
        }

        this.ws.onmessage = (event) => {
          this.handleIncomingRaw(event.data)
        }

        this.ws.onerror = () => {
          this.isConnected = false
          if (this.onStatusChangeCallback) this.onStatusChangeCallback(false, 'Sensor Bridge offline')
          this.startPollingFallback()
          resolve({ success: false, message: `Waiting for Sensor Bridge at ${this.url}` })
        }

        this.ws.onclose = () => {
          this.isConnected = false
          if (this.onStatusChangeCallback) this.onStatusChangeCallback(false, 'Sensor Bridge disconnected')
          this.scheduleReconnect()
          this.startPollingFallback()
        }
      } catch (err) {
        this.isConnected = false
        this.startPollingFallback()
        resolve({ success: false, message: err.message })
      }
    })
  }

  handleIncomingRaw(rawText) {
    try {
      const data = JSON.parse(rawText)
      this.lastPacketTime = Date.now()
      this.packetCount += 1

      // Handle nested or flat payloads
      let hr = null
      let spo2 = null
      let temp = null
      let dist = null
      let isDemo = Boolean(data.isDemo)

      if (data.sensors) {
        hr = data.sensors.heartRate?.value ?? null
        spo2 = data.sensors.spo2?.value ?? null
        temp = data.sensors.temperature?.value ?? null
        dist = data.sensors.distance?.value ?? null
      } else {
        hr = data.hr ?? data.heartRate ?? data.bpm ?? null
        spo2 = data.spo2 ?? data.spO2 ?? data.oxygen ?? null
        temp = data.temp ?? data.temperature ?? null
        dist = data.dist ?? data.distance ?? null
      }

      const parsed = {
        heartRate: hr != null && !isNaN(hr) && hr > 0 ? Number(hr) : null,
        spo2: spo2 != null && !isNaN(spo2) && spo2 > 0 ? Number(spo2) : null,
        temperature: temp != null && !isNaN(temp) && temp > 0 ? Number(temp) : null,
        distance: dist != null && !isNaN(dist) && dist > 0 ? Number(dist) : null,
        source: isDemo ? 'demo' : 'hardware',
        port: data.port || 'USB-SERIAL',
        raw: rawText,
        packetCount: this.packetCount,
        timestamp: data.timestamp || new Date().toISOString()
      }

      if (this.onDataCallback) this.onDataCallback(parsed)
    } catch (e) {
      // non-JSON message
    }
  }

  startPollingFallback() {
    if (this.pollingTimer) return
    this.pollingTimer = setInterval(async () => {
      try {
        const res = await fetch(this.httpFallbackUrl, { mode: 'cors' }).catch(() => null)
        if (res && res.ok) {
          const json = await res.json()
          this.isConnected = true
          this.handleIncomingRaw(JSON.stringify(json))
        }
      } catch (e) {}
    }, 500)
  }

  stopPollingFallback() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
      this.pollingTimer = null
    }
  }

  scheduleReconnect() {
    if (!this.isAutoReconnectEnabled || this.reconnectTimer) return
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      if (!this.isConnected) {
        this.connect({ url: this.url }).catch(() => {})
      }
    }, 3000)
  }

  async disconnect() {
    this.isAutoReconnectEnabled = false
    this.isConnected = false
    this.stopPollingFallback()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  onData(callback) {
    this.onDataCallback = callback
  }

  onError(callback) {
    this.onErrorCallback = callback
  }

  onStatusChange(callback) {
    this.onStatusChangeCallback = callback
  }
}
