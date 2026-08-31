# AI-Powered Smart Mirror for Personal Health Monitoring

An advanced, login-free, privacy-preserving Smart Mirror web application designed for non-invasive personal health and wellness observation.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            AI-POWERED SMART MIRROR ARCHITECTURE                             │
├───────────────────────────────┬───────────────────────────────┬─────────────────────────────┤
│ 1. Health Data Acquisition    │ 2. AI-Based Health Analysis   │ 3. Monitoring & Recomms     │
├───────────────────────────────┼───────────────────────────────┼─────────────────────────────┤
│ • Face Image (Camera Matrix)  │ • Face & Alertness (OpenCV)   │ • Health Status & Scoring   │
│ • Heart Rate (MAX30102 PPG)   │ • Posture Vector (MediaPipe)  │ • Expert System Decision    │
│ • Temperature (IR Sensor)     │ • Fatigue Level (EAR Index)   │ • Dashboard & Report HUD    │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────┘
```

---

## ✨ Key Features

1. **High-Visibility Smart Mirror HUD**: Live webcam viewport with centered face reticle, corner guides, and observation countdown & progress bar positioned below the camera feed.
2. **Deterministic Clinical Rule Engine**: Single local source of truth calculating Authoritative Wellness Score ($0\text{--}100$), Health Status (`Healthy`, `Needs Attention`, `High Risk`), and categorical deductions without external AI APIs.
3. **Login-Free Device Continuity**: Anonymous device profile (`smart_mirror_profile_id`) stored locally for returning-user history without biometric face recognition.
4. **Current vs. Previous Multi-Session Comparison**: Dynamic delta calculation, historical timeline, and auto-generated *"What Changed?"* breakdown.
5. **Targeted Improvement Guidance**: Practical lifestyle recommendations triggered strictly from non-optimal readings.
6. **Smart Wellness Insights**: Longitudinal pattern detection and restorative suggestions derived from real stored sessions.
7. **Dual-Layer Persistence**: Guaranteed zero data loss with synchronized Supabase database storage and local master cache.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build
```bash
npm run build
```

---

## 🛡️ Privacy & Safety Statement

* **Privacy**: 100% on-device optical processing. No face images, embeddings, or biometric templates are stored or transmitted.
* **Disclaimer**: This Smart Mirror is an educational prototype and personal wellness-monitoring system. Its measurements and rule-based insights are not medical diagnoses and do not replace professional healthcare advice.
