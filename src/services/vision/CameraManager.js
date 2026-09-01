/**
 * CameraManager.js
 * Manages browser WebRTC webcam stream lifecycle, permissions, and frame extraction.
 */

export class CameraManager {
  constructor() {
    this.stream = null
    this.videoElement = null
    this.isStreaming = false
    this.permissionState = 'prompt' // 'prompt' | 'granted' | 'denied'
    this.error = null
    this.listeners = new Set()
  }

  async startCamera(videoElement) {
    this.videoElement = videoElement
    this.error = null

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.error = 'Webcam access is not supported by your browser.'
      this.permissionState = 'denied'
      this.notifyListeners()
      return { success: false, error: this.error }
    }

    try {
      // If stream already running, attach directly
      if (this.stream && this.stream.active) {
        if (this.videoElement && this.videoElement.srcObject !== this.stream) {
          this.videoElement.srcObject = this.stream
          await this.videoElement.play().catch(() => {})
        }
        this.isStreaming = true
        this.permissionState = 'granted'
        this.notifyListeners()
        return { success: true, stream: this.stream }
      }

      // Request 720p or fallback video stream
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        },
        audio: false
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.permissionState = 'granted'
      this.isStreaming = true

      if (this.videoElement) {
        this.videoElement.srcObject = this.stream
        this.videoElement.setAttribute('playsinline', 'true')
        await this.videoElement.play().catch(() => {})
      }

      this.notifyListeners()
      return { success: true, stream: this.stream }
    } catch (err) {
      console.warn('CameraManager access error:', err)
      this.isStreaming = false
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.permissionState = 'denied'
        this.error = 'Camera permission was denied. Please allow camera access in browser settings.'
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        this.error = 'No camera device found on this system.'
      } else {
        this.error = `Webcam initialization failed: ${err.message || 'Unknown error'}`
      }

      this.notifyListeners()
      return { success: false, error: this.error }
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null
    }
    this.isStreaming = false
    this.notifyListeners()
  }

  captureFrame(targetCanvas) {
    if (!this.videoElement || !this.isStreaming || this.videoElement.readyState < 2) {
      return null
    }

    const canvas = targetCanvas || document.createElement('canvas')
    const width = this.videoElement.videoWidth || 640
    const height = this.videoElement.videoHeight || 480
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    // Mirror image horizontally to match smart mirror behavior
    ctx.translate(width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(this.videoElement, 0, 0, width, height)

    return { canvas, ctx, width, height }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    listener({
      isStreaming: this.isStreaming,
      permissionState: this.permissionState,
      error: this.error
    })
    return () => this.listeners.delete(listener)
  }

  notifyListeners() {
    const payload = {
      isStreaming: this.isStreaming,
      permissionState: this.permissionState,
      error: this.error
    }
    this.listeners.forEach(cb => {
      try { cb(payload) } catch (e) {}
    })
  }
}

export const cameraManager = new CameraManager()
