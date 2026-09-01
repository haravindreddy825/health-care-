/**
 * WebSocketBridgeProvider.js
 * Connects to a local hardware bridge daemon (Python / Node / Raspberry Pi daemon)
 * Default endpoint: ws://localhost:8765
 */

export class WebSocketBridgeProvider {
  constructor() {
    this.name = 'WebSocket Local Hardware Bridge'
    this.ws = null
    this.isConnected = false
    this.onDataCallback = null
    this.onErrorCallback = null
    this.url = 'ws://localhost:8765'
  }

  isSupported() {
    return typeof window !== 'undefined' && 'WebSocket' in window
  }

  async connect(options = { url: 'ws://localhost:8765' }) {
    if (!this.isSupported()) {
      throw new Error('WebSockets are not supported in this browser.')
    }

    this.url = options.url || 'ws://localhost:8765'

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          this.isConnected = true
          resolve({ success: true, message: `Connected to Hardware Bridge at ${this.url}` })
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            const parsed = {
              heartRate: data.hr ?? data.heartRate ?? null,
              spo2: data.spo2 ?? data.spO2 ?? null,
              temperature: data.temp ?? data.temperature ?? null,
              distance: data.dist ?? data.distance ?? null,
              source: 'hardware',
              raw: event.data,
              timestamp: new Date().toISOString()
            }
            if (this.onDataCallback) this.onDataCallback(parsed)
          } catch (e) {
            // non-JSON message
          }
        }

        this.ws.onerror = (err) => {
          this.isConnected = false
          if (this.onErrorCallback) this.onErrorCallback('Failed to connect to local hardware bridge. Ensure bridge server is running on ' + this.url)
          reject(new Error('WebSocket connection failed to ' + this.url))
        }

        this.ws.onclose = () => {
          this.isConnected = false
          if (this.onErrorCallback) this.onErrorCallback('Hardware Bridge disconnected')
        }
      } catch (err) {
        this.isConnected = false
        reject(err)
      }
    })
  }

  async disconnect() {
    this.isConnected = false
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
}
