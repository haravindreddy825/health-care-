# AuraMirror — AI-Powered Smart Mirror for Personal Health Monitoring

AuraMirror is a functional, full-stack **AI-Powered Smart Mirror prototype** for personal health and wellness screening. It combines browser-native WebRTC computer vision, physical biomedical sensor acquisition (via Web Serial, Web Bluetooth, and WebSocket hardware bridges), local deterministic health analysis, same-user longitudinal session comparison, live ambient weather telemetry, and hands-free voice control.

---

## 🌟 Key System Features

1. **High-Visibility Mirror HUD & Computer Vision**:
   - Live WebRTC camera preview with targeting reticle and real-time face acquisition.
   - Optical distance estimation ($cm$).
   - Head-tilt spinal alignment and posture analysis.
   - Eye Aspect Ratio (EAR) blink and ocular fatigue analysis.
   - Persistent user face recognition and mathematical profile matching.

2. **Physical Sensor Abstraction & Strict Hardware Policy**:
   - **Web Serial API**: Direct USB serial pairing with Arduino UNO, ESP32, and STM32 microcontrollers (115200 / 9600 baud, JSON & CSV stream formats).
   - **Web Bluetooth (BLE)**: Connects to standard BLE pulse oximeters (`0x180D`) and digital health thermometers (`0x1809`).
   - **WebSocket Hardware Bridge**: Connects to local Python / Raspberry Pi hardware daemons (`ws://localhost:8765`).
   - **Strict Transparency Guarantee**: If hardware sensors are disconnected, they explicitly display `Sensor Not Connected` (`reading: null`) and are **never** penalized in the wellness score.
   - **Dedicated Demo Simulator**: 6 clinical demo presets (Healthy Baseline, Athletic Recovery, Fever & Tachycardia, Posture Slump, etc.) with real-time sliders for classroom presentations, explicitly badged as `DEMO / SIMULATED DATA`.

3. **Deterministic Local Wellness Analysis Engine**:
   - Base 100 deduction model evaluating active telemetry without external API dependencies.
   - Dynamic health status (`Healthy`, `Needs Attention`, `High Risk`) and risk profile (`LOW`, `MODERATE`, `HIGH`).
   - Categorized lifestyle recommendations (Hydration, Posture & Ergonomics, Sleep & Recovery, Activity).
   - Single high-impact priority takeaway action.

4. **Same-User Longitudinal Delta Comparison**:
   - Compares the current scan strictly against previous scans of the **same user profile**.
   - Dynamic delta metrics ($\Delta \text{BPM}, \Delta \text{SpO}_2, \Delta ^\circ\text{C}, \Delta \text{Score}$) and *"What Changed?"* breakdown.
   - Dual persistence: Synchronizes with Supabase PostgreSQL tables (`health_readings`, `health_analysis`, `recommendations`) with local master cache fallback.

5. **Ambient Weather & Hands-Free Voice Control**:
   - Free Open-Meteo ambient climate telemetry with geolocation and weather-aware wellness tips.
   - Web Speech recognition (*"Start health analysis"*, *"Show dashboard"*, *"Show history"*, *"Read my report"*) and speech synthesis feedback.

---

## 🚀 Quick Start Guide

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* A modern browser supporting WebRTC, Web Serial, and Web Speech (Google Chrome or Microsoft Edge recommended)
* Built-in or USB Webcam

### Installation & Launch

1. **Extract or clone the repository**:
   ```bash
   git clone https://github.com/haravindreddy825/health-care-.git
   cd health-care-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Windows One-Click Launch**:
   Alternatively, on Windows you can simply double-click the included `start.bat` file to install dependencies and launch the server automatically.

5. Open your browser at:
   ```text
   http://localhost:5173
   ```

---

## 📁 Project Architecture

```text
├── public/                 # Static assets & icons
├── src/
│   ├── components/
│   │   ├── analysis/       # Wellness score gauge, comparison tables, what-changed card, report modal
│   │   ├── hud/            # High-visibility camera viewport, reticle, distance gauge, observation control
│   │   ├── layout/         # Smart mirror navigation bar, live clock, digital weather pill, footer
│   │   ├── sensors/        # Sensor cards, hardware connection modal, demo simulation drawer
│   │   └── ui/             # Glassmorphism cards, semantic status badges, SVG trend sparklines
│   ├── context/            # SmartMirrorContext state machine & event subscribers
│   ├── lib/                # Supabase client with built-in fallback configuration
│   ├── pages/              # 8 fully functional application pages:
│   │   ├── MirrorHUDPage.jsx         # Live Smart Mirror HUD & observation workflow
│   │   ├── DashboardPage.jsx         # Executive wellness score overview & momentum trends
│   │   ├── SensorsPage.jsx           # Hardware connectivity center (USB, BLE, WebSocket)
│   │   ├── AnalysisPage.jsx          # Scoring transparency & same-user delta tables
│   │   ├── HistoryPage.jsx           # Chronological timeline & historical report viewer
│   │   ├── RecommendationsPage.jsx   # Lifestyle guidance & active triage alerts
│   │   ├── ProfilesPage.jsx          # Multi-user profile manager & identity switcher
│   │   └── SettingsPage.jsx          # Voice commands, database sync, and privacy controls
│   ├── services/
│   │   ├── analysis/       # Local deterministic health scoring engine
│   │   ├── history/        # Same-user comparison engine & session persistence
│   │   ├── sensors/        # Hardware abstraction drivers (Serial, BLE, WebSocket, Demo)
│   │   ├── vision/         # WebRTC camera manager, face/EAR/posture tracker, profile matcher
│   │   ├── voice/          # Web Speech recognition and synthesis service
│   │   └── weather/        # Open-Meteo ambient climate integration
│   ├── App.jsx             # Root layout & page routing
│   ├── index.css           # Dark obsidian theme & glassmorphism styles
│   └── main.jsx            # React root mount
├── supabase/
│   └── migrations/         # PostgreSQL schema & RLS policies for health readings and analyses
├── start.bat               # Windows one-click startup script
├── package.json            # Dependencies & scripts
└── vite.config.js          # Vite build configuration
```

---

## 🔌 Hardware Setup & Telemetry Protocols

### Microcontroller USB Serial Format (115200 baud)
The system accepts both JSON and CSV streams over USB serial:

* **JSON Format**:
  ```json
  {"hr": 74, "spo2": 98, "temp": 36.6, "dist": 65}
  ```
* **CSV Format**:
  ```text
  74,98,36.6,65
  ```
  *(Ordered as: Heart Rate BPM, SpO2 %, Temperature °C, Distance cm)*

---

## 📄 Medical Prototype Disclaimer

*This Smart Mirror is an educational and engineering prototype designed for personal wellness screening and lifestyle observation. Its measurements, optical estimations, and rule-based insights are not medical diagnoses and do not replace professional healthcare advice.*
