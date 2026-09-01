/**
 * WebSerialProvider.js
 * Hardware driver communicating directly with USB Serial microcontrollers
 * (Arduino UNO/Nano, ESP32, STM32, Raspberry Pi Pico) via standard Web Serial API.
 * 
 * Protocol Support:
 * - JSON stream: {"hr": 78, "spo2": 98, "temp": 36.7, "dist": 65}
 * - CSV stream: 78,98,36.7,65 (HR, SpO2, Temp, Distance)
 */

export class WebSerialProvider {
  constructor() {
    this.name = 'USB Serial (Arduino / ESP32)'
    this.port = null
    this.reader = null
    this.readableStreamClosed = null
    this.isConnected = false
    this.onDataCallback = null
    this.onErrorCallback = null
    this.baudRate = 115200
  }

  isSupported() {
    return typeof navigator !== 'undefined' && 'serial' in navigator
  }

  async connect(options = { baudRate: 115200 }) {
    if (!this.isSupported()) {
      throw new Error('Web Serial API is not supported in this browser. Please use Chrome, Edge, or Opera.')
    }

    try {
      this.baudRate = options.baudRate || 115200
      this.port = await navigator.serial.requestPort()
      await this.port.open({ baudRate: this.baudRate })
      this.isConnected = true

      this.readLoop()
      return { success: true, message: `Connected to USB Serial port at ${this.baudRate} baud` }
    } catch (err) {
      this.isConnected = false
      if (this.onErrorCallback) this.onErrorCallback(err.message)
      throw err
    }
  }

  async readLoop() {
    const textDecoder = new TextDecoderStream()
    this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable)
    this.reader = textDecoder.readable.getReader()

    let buffer = ''

    try {
      while (true) {
        const { value, done } = await this.reader.read()
        if (done) break
        if (value) {
          buffer += value
          const lines = buffer.split('\n')
          buffer = lines.pop() // keep incomplete last line in buffer

          for (const line of lines) {
            const cleanLine = line.trim()
            if (cleanLine) {
              this.parseIncomingLine(cleanLine)
            }
          }
        }
      }
    } catch (err) {
      if (this.isConnected) {
        console.warn('WebSerial read loop terminated:', err)
        if (this.onErrorCallback) this.onErrorCallback(err.message)
      }
    } finally {
      this.isConnected = false
    }
  }

  parseIncomingLine(rawLine) {
    try {
      // 1. Try JSON parsing
      if (rawLine.startsWith('{') && rawLine.endsWith('}')) {
        const json = JSON.parse(rawLine)
        const parsed = {
          heartRate: json.hr ?? json.heartRate ?? json.heart_rate ?? null,
          spo2: json.spo2 ?? json.spO2 ?? json.oxygen ?? null,
          temperature: json.temp ?? json.temperature ?? null,
          distance: json.dist ?? json.distance ?? null,
          source: 'hardware',
          raw: rawLine,
          timestamp: new Date().toISOString()
        }
        if (this.onDataCallback) this.onDataCallback(parsed)
        return
      }

      // 2. Try CSV parsing: "78,98,36.7,65"
      const parts = rawLine.split(',').map(s => parseFloat(s.trim()))
      if (parts.length >= 2 && !isNaN(parts[0])) {
        const parsed = {
          heartRate: isNaN(parts[0]) ? null : Math.round(parts[0]),
          spo2: isNaN(parts[1]) ? null : Math.round(parts[1]),
          temperature: (parts.length > 2 && !isNaN(parts[2])) ? parseFloat(parts[2].toFixed(1)) : null,
          distance: (parts.length > 3 && !isNaN(parts[3])) ? Math.round(parts[3]) : null,
          source: 'hardware',
          raw: rawLine,
          timestamp: new Date().toISOString()
        }
        if (this.onDataCallback) this.onDataCallback(parsed)
      }
    } catch (e) {
      // invalid line format, skip
    }
  }

  async disconnect() {
    this.isConnected = false
    try {
      if (this.reader) {
        await this.reader.cancel()
        this.reader = null
      }
      if (this.readableStreamClosed) {
        await this.readableStreamClosed.catch(() => {})
      }
      if (this.port) {
        await this.port.close()
        this.port = null
      }
    } catch (e) {
      console.warn('Error during serial disconnect:', e)
    }
  }

  onData(callback) {
    this.onDataCallback = callback
  }

  onError(callback) {
    this.onErrorCallback = callback
  }
}
