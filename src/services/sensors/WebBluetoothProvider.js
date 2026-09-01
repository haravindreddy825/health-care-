/**
 * WebBluetoothProvider.js
 * Hardware driver communicating with wireless BLE Health Monitors
 * Standard Services:
 * - Heart Rate Service (0x180D) -> Characteristic (0x2A37)
 * - Health Thermometer Service (0x1809) -> Characteristic (0x2A1C)
 */

export class WebBluetoothProvider {
  constructor() {
    this.name = 'Bluetooth BLE (Heart Rate & Temp Monitors)'
    this.device = null
    this.server = null
    this.isConnected = false
    this.onDataCallback = null
    this.onErrorCallback = null
    this.latestTelemetry = {
      heartRate: null,
      spo2: null,
      temperature: null,
      distance: null,
      source: 'hardware'
    }
  }

  isSupported() {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator
  }

  async connect() {
    if (!this.isSupported()) {
      throw new Error('Web Bluetooth API is not supported in this browser. Please use Chrome or Edge on Windows/macOS/Android.')
    }

    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: ['heart_rate'] },
          { services: ['health_thermometer'] }
        ],
        optionalServices: ['battery_service']
      })

      this.device.addEventListener('gattserverdisconnected', () => {
        this.isConnected = false
        if (this.onErrorCallback) this.onErrorCallback('BLE Device Disconnected')
      })

      this.server = await this.device.gatt.connect()
      this.isConnected = true

      // Try Heart Rate Characteristic
      try {
        const hrService = await this.server.getPrimaryService('heart_rate')
        const hrChar = await hrService.getCharacteristic('heart_rate_measurement')
        await hrChar.startNotifications()
        hrChar.addEventListener('characteristicvaluechanged', (e) => this.handleHeartRateData(e))
      } catch (e) {
        console.log('No Heart Rate service found on this BLE device')
      }

      // Try Thermometer Characteristic
      try {
        const tempService = await this.server.getPrimaryService('health_thermometer')
        const tempChar = await tempService.getCharacteristic('temperature_measurement')
        await tempChar.startNotifications()
        tempChar.addEventListener('characteristicvaluechanged', (e) => this.handleTemperatureData(e))
      } catch (e) {
        console.log('No Health Thermometer service found on this BLE device')
      }

      return { success: true, message: `Connected to BLE Device: ${this.device.name || 'Wireless Sensor'}` }
    } catch (err) {
      this.isConnected = false
      if (this.onErrorCallback) this.onErrorCallback(err.message)
      throw err
    }
  }

  handleHeartRateData(event) {
    const value = event.target.value
    const flags = value.getUint8(0)
    let hr = 0
    if (flags & 0x01) {
      // 16-bit HR
      hr = value.getUint16(1, true)
    } else {
      // 8-bit HR
      hr = value.getUint8(1)
    }

    this.latestTelemetry.heartRate = hr
    this.latestTelemetry.timestamp = new Date().toISOString()
    if (this.onDataCallback) this.onDataCallback({ ...this.latestTelemetry })
  }

  handleTemperatureData(event) {
    const value = event.target.value
    // IEEE 11073 32-bit float
    const rawTemp = value.getFloat32(1, true)
    const celsius = parseFloat(rawTemp.toFixed(1))

    this.latestTelemetry.temperature = celsius
    this.latestTelemetry.timestamp = new Date().toISOString()
    if (this.onDataCallback) this.onDataCallback({ ...this.latestTelemetry })
  }

  async disconnect() {
    this.isConnected = false
    try {
      if (this.device && this.device.gatt.connected) {
        this.device.gatt.disconnect()
      }
    } catch (e) {
      console.warn('Error disconnecting BLE device:', e)
    }
  }

  onData(callback) {
    this.onDataCallback = callback
  }

  onError(callback) {
    this.onErrorCallback = callback
  }
}
