/**
 * Vision Detection & Camera Service
 * Handles robust live webcam capture, face presence tracking, and throttled optical analysis.
 * 
 * CAMERA RACE CONDITION FIXES:
 * 1. Mutual exclusion lock prevents concurrent getUserMedia / play() calls.
 * 2. Stops previous stream tracks completely before assigning a new stream.
 * 3. Waits for 'loadedmetadata' event before calling video.play().
 * 4. Gracefully handles AbortError / interrupted play requests.
 * 5. Throttles detection loop to ~10-12 FPS to prevent CPU thrashing.
 */

export class VisionService {
  constructor() {
    this.stream = null
    this.videoElement = null
    this.canvasElement = null
    this.animFrameId = null
    this.isInitializing = false
    this.hasNativeFaceDetector = typeof window !== 'undefined' && 'FaceDetector' in window
    this.faceDetector = this.hasNativeFaceDetector ? new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 }) : null
    this.onDetectionCallback = null
    this.lastProcessedTimestamp = 0
    this.lastDetectedState = null
  }

  /**
   * Request webcam stream with race-condition guards
   */
  async startCamera(videoElement) {
    if (!videoElement) {
      return { success: false, error: 'Video element not available' }
    }

    // Mutex lock to prevent overlapping initialization calls
    if (this.isInitializing) {
      return { success: true }
    }
    this.isInitializing = true
    this.videoElement = videoElement

    try {
      // Clean up previous stream if exists
      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop())
        this.stream = null
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.isInitializing = false
        return {
          success: false,
          error: 'Camera access is not supported in this browser environment.'
        }
      }

      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      this.stream = stream

      if (this.videoElement) {
        this.videoElement.srcObject = stream

        // Wait for video metadata before attempting to play
        await new Promise((resolve) => {
          if (this.videoElement.readyState >= 1) {
            resolve()
          } else {
            const onLoaded = () => {
              this.videoElement.removeEventListener('loadedmetadata', onLoaded)
              resolve()
            }
            this.videoElement.addEventListener('loadedmetadata', onLoaded, { once: true })
            // Fallback timeout in case event is missed
            setTimeout(resolve, 800)
          }
        })

        // Safely play video
        try {
          await this.videoElement.play()
        } catch (playErr) {
          if (playErr.name !== 'AbortError') {
            console.warn('Video play notice:', playErr.message)
          }
        }
      }

      this.isInitializing = false
      return { success: true }
    } catch (err) {
      this.isInitializing = false
      console.warn('Camera access error:', err)
      return {
        success: false,
        error: err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. Please allow camera access in your browser.'
          : err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'
          ? 'No camera device found on this system.'
          : 'Camera access is currently unavailable. Please verify device permissions.'
      }
    }
  }

  /**
   * Stop webcam stream and release all hardware tracks
   */
  stopCamera() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId)
      this.animFrameId = null
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        try {
          track.stop()
        } catch (e) {}
      })
      this.stream = null
    }
    if (this.videoElement) {
      try {
        this.videoElement.pause()
        this.videoElement.srcObject = null
      } catch (e) {}
    }
    this.isInitializing = false
  }

  /**
   * Run throttled detection loop (~10-12 FPS) to keep UI ultra smooth
   */
  startDetectionLoop(callback) {
    this.onDetectionCallback = callback
    const THROTTLE_MS = 90 // ~11 FPS

    const detect = async (now) => {
      if (!this.videoElement || this.videoElement.paused || this.videoElement.ended) {
        this.animFrameId = requestAnimationFrame(detect)
        return
      }

      // Throttle analysis to reduce CPU load
      if (now - this.lastProcessedTimestamp >= THROTTLE_MS) {
        this.lastProcessedTimestamp = now

        let faceDetected = false
        let boundingBox = null

        if (this.faceDetector && this.videoElement.readyState >= 2) {
          try {
            const faces = await this.faceDetector.detect(this.videoElement)
            if (faces && faces.length > 0) {
              faceDetected = true
              boundingBox = faces[0].boundingBox
            }
          } catch (e) {
            faceDetected = this.fallbackPixelAnalysis(this.videoElement)
          }
        } else {
          faceDetected = this.fallbackPixelAnalysis(this.videoElement)
        }

        // Notify callback if state changed or for heartbeat
        if (this.onDetectionCallback) {
          this.onDetectionCallback({
            faceDetected,
            boundingBox,
            timestamp: Date.now()
          })
        }
      }

      this.animFrameId = requestAnimationFrame(detect)
    }

    this.animFrameId = requestAnimationFrame(detect)
  }

  /**
   * Lightweight canvas-based frame analysis for optical presence
   */
  fallbackPixelAnalysis(video) {
    if (!video || video.videoWidth === 0) return true
    if (!this.canvasElement) {
      this.canvasElement = document.createElement('canvas')
      this.canvasElement.width = 64
      this.canvasElement.height = 48
    }

    const ctx = this.canvasElement.getContext('2d', { willReadFrequently: true })
    if (!ctx) return true

    ctx.drawImage(video, 0, 0, 64, 48)
    const imgData = ctx.getImageData(0, 0, 64, 48).data

    let skinLikePixels = 0
    const totalPixels = 64 * 48

    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i]
      const g = imgData[i + 1]
      const b = imgData[i + 2]
      if (r > 60 && g > 40 && b > 20 && r > g && r > b && (r - g) > 15) {
        skinLikePixels++
      }
    }

    return (skinLikePixels / totalPixels) > 0.04
  }
}

export const visionService = new VisionService()
