/**
 * VoiceControlService.js
 * Hands-free Smart Mirror voice control with Web Speech API
 * (SpeechRecognition + SpeechSynthesis)
 */

export class VoiceControlService {
  constructor() {
    this.recognition = null
    this.isListening = false
    this.isSupported = false
    this.onCommandCallback = null
    this.onStatusCallback = null
    this.lastTranscript = ''

    this.initRecognition()
  }

  initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        this.isSupported = true
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = false
        this.recognition.lang = 'en-US'

        this.recognition.onstart = () => {
          this.isListening = true
          this.notifyStatus('Listening for voice commands...')
        }

        this.recognition.onresult = (event) => {
          const current = event.resultIndex
          const transcript = event.results[current][0].transcript.toLowerCase().trim()
          this.lastTranscript = transcript
          this.handleTranscript(transcript)
        }

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition notice:', event.error)
          if (event.error === 'not-allowed') {
            this.isListening = false
            this.notifyStatus('Microphone permission denied')
          }
        }

        this.recognition.onend = () => {
          if (this.isListening) {
            try {
              this.recognition.start()
            } catch (e) {
              this.isListening = false
              this.notifyStatus('Voice control idle')
            }
          } else {
            this.notifyStatus('Voice control idle')
          }
        }
      }
    }
  }

  startListening() {
    if (!this.isSupported || !this.recognition) {
      this.notifyStatus('Voice recognition not supported in this browser')
      return false
    }

    try {
      this.isListening = true
      this.recognition.start()
      return true
    } catch (e) {
      console.warn('Voice start exception:', e)
      return false
    }
  }

  stopListening() {
    this.isListening = false
    if (this.recognition) {
      try {
        this.recognition.stop()
      } catch (e) {}
    }
    this.notifyStatus('Voice control paused')
  }

  handleTranscript(phrase) {
    console.log('🎙️ Voice command heard:', phrase)
    let handled = false

    if (phrase.includes('start health') || phrase.includes('start analysis') || phrase.includes('start check') || phrase.includes('scan')) {
      this.triggerCommand('START_ANALYSIS')
      this.speak('Starting wellness check. Please look directly at the mirror.')
      handled = true
    } else if (phrase.includes('dashboard') || phrase.includes('home')) {
      this.triggerCommand('NAVIGATE', 'dashboard')
      this.speak('Navigating to dashboard.')
      handled = true
    } else if (phrase.includes('mirror') || phrase.includes('camera') || phrase.includes('live')) {
      this.triggerCommand('NAVIGATE', 'mirror')
      this.speak('Switching to live mirror.')
      handled = true
    } else if (phrase.includes('sensor') || phrase.includes('hardware')) {
      this.triggerCommand('NAVIGATE', 'sensors')
      this.speak('Opening hardware center.')
      handled = true
    } else if (phrase.includes('recommend') || phrase.includes('advice') || phrase.includes('tips')) {
      this.triggerCommand('NAVIGATE', 'recommendations')
      this.speak('Displaying lifestyle recommendations.')
      handled = true
    } else if (phrase.includes('history') || phrase.includes('previous') || phrase.includes('past')) {
      this.triggerCommand('NAVIGATE', 'history')
      this.speak('Loading your wellness history.')
      handled = true
    } else if (phrase.includes('profile') || phrase.includes('user') || phrase.includes('switch')) {
      this.triggerCommand('NAVIGATE', 'profiles')
      this.speak('Opening profile manager.')
      handled = true
    } else if (phrase.includes('enable demo') || phrase.includes('start demo')) {
      this.triggerCommand('TOGGLE_DEMO', true)
      this.speak('Demo simulation mode activated.')
      handled = true
    } else if (phrase.includes('disable demo') || phrase.includes('stop demo')) {
      this.triggerCommand('TOGGLE_DEMO', false)
      this.speak('Demo simulation mode deactivated.')
      handled = true
    } else if (phrase.includes('read report') || phrase.includes('my status') || phrase.includes('tell me my health')) {
      this.triggerCommand('READ_REPORT')
      handled = true
    }

    if (!handled) {
      this.notifyStatus(`Heard: "${phrase}"`)
    }
  }

  speak(text) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel() // cancel pending utterances
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.05
      utterance.pitch = 1.0

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices()
      const preferred = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')))
      if (preferred) utterance.voice = preferred

      window.speechSynthesis.speak(utterance)
    }
  }

  onCommand(callback) {
    this.onCommandCallback = callback
  }

  onStatus(callback) {
    this.onStatusCallback = callback
  }

  triggerCommand(command, payload) {
    if (this.onCommandCallback) {
      this.onCommandCallback(command, payload)
    }
  }

  notifyStatus(status) {
    if (this.onStatusCallback) {
      this.onStatusCallback(status)
    }
  }
}

export const voiceControlService = new VoiceControlService()
