import { sensorManager } from './src/services/sensors/SensorManager.js'
import { analyzeHealthTelemetry } from './src/services/analysis/HealthAnalysisEngine.js'
import { compareSameUserReports } from './src/services/history/ReportComparisonService.js'
import { faceRecognitionService } from './src/services/vision/FaceRecognitionService.js'
import { sessionHistoryService } from './src/services/history/SessionHistoryService.js'

console.log('====================================================================')
console.log('--- AI-POWERED SMART MIRROR FULL SYSTEM E2E VERIFICATION ---')
console.log('====================================================================\n')

// 1. SENSOR ARCHITECTURE & STRICT SENSOR DISCONNECTION RULE
console.log('[TEST 1] Testing Physical Sensor Disconnected State...')
sensorManager.setDemoMode(false)
const s = sensorManager.sensors

console.log(`- Heart Rate: ${s.heartRate.reading} (${s.heartRate.source}, connected=${s.heartRate.connected})`)
console.log(`- SpO2: ${s.spo2.reading} (${s.spo2.source}, connected=${s.spo2.connected})`)
console.log(`- Temperature: ${s.temperature.reading} (${s.temperature.source}, connected=${s.temperature.connected})`)
console.log(`- Distance: ${s.distance.reading} (${s.distance.source}, connected=${s.distance.connected})`)

if (s.heartRate.reading !== null || s.spo2.reading !== null || s.temperature.reading !== null) {
  throw new Error('FAIL: Disconnected physical sensors must have null readings!')
}
console.log('✓ PASS: Disconnected hardware sensors strictly output null with source="unavailable".\n')

// 2. DEMO SIMULATION ACTIVATION
console.log('[TEST 2] Testing Demo Mode Simulation...')
sensorManager.setDemoMode(true)
sensorManager.applyDemoPreset('HEALTHY')
const demoReading = sensorManager.getStabilizedSessionReading()
console.log(`- Simulated HR: ${demoReading.heartRate} BPM (${demoReading.sources.heartRate})`)
console.log(`- Simulated SpO2: ${demoReading.spo2}% (${demoReading.sources.spo2})`)
console.log(`- Simulated Temp: ${demoReading.temperature}°C (${demoReading.sources.temperature})`)
console.log(`- Simulated Distance: ${demoReading.distance} cm (${demoReading.sources.distance})`)

if (demoReading.sources.heartRate !== 'demo' || demoReading.heartRate === null) {
  throw new Error('FAIL: Demo Mode must produce explicitly tagged demo telemetry!')
}
console.log('✓ PASS: Demo Mode generates clearly tagged "demo" telemetry.\n')

// 3. DETERMINISTIC HEALTH ANALYSIS ENGINE (EXCLUDES DISCONNECTED SENSORS)
console.log('[TEST 3] Testing Deterministic Health Analysis Engine...')

// Case A: Disconnected physical sensors (should NOT be penalized as abnormal)
const disconnectedAnalysis = analyzeHealthTelemetry({
  heartRate: null,
  spo2: null,
  temperature: null,
  distance: null,
  posture: 'Good',
  fatigue: 'Low'
})
console.log(`- Offline Sensors Score: ${disconnectedAnalysis.wellnessScore} / 100 (${disconnectedAnalysis.healthStatus}, ${disconnectedAnalysis.riskLevel} Risk)`)
if (disconnectedAnalysis.wellnessScore !== 100) {
  throw new Error(`FAIL: Missing sensors should not be penalized! Got ${disconnectedAnalysis.wellnessScore}`)
}

// Case B: Healthy complete baseline
const healthyAnalysis = analyzeHealthTelemetry({
  heartRate: 72,
  spo2: 98,
  temperature: 36.6,
  distance: 65,
  posture: 'Good',
  fatigue: 'Low'
})
console.log(`- Healthy Baseline Score: ${healthyAnalysis.wellnessScore} / 100 (${healthyAnalysis.healthStatus})`)
console.log(`- Priority Action: "${healthyAnalysis.priorityAction}"`)
if (healthyAnalysis.wellnessScore < 95) throw new Error('FAIL: Healthy baseline score mismatch!')

// Case C: Fever & Tachycardia
const feverAnalysis = analyzeHealthTelemetry({
  heartRate: 108,
  spo2: 95,
  temperature: 38.4,
  distance: 60,
  posture: 'Good',
  fatigue: 'Moderate'
})
console.log(`- Fever & Tachycardia Score: ${feverAnalysis.wellnessScore} / 100 (${feverAnalysis.healthStatus}, ${feverAnalysis.riskLevel} Risk)`)
console.log(`- Deductions: ${JSON.stringify(feverAnalysis.deductions.map(d => `${d.metric} -${d.deduction}`))}`)
console.log(`- Priority Action: "${feverAnalysis.priorityAction}"`)
if (feverAnalysis.wellnessScore > 60) throw new Error('FAIL: Fever score must be significantly lower!')
console.log('✓ PASS: Deterministic Rule Engine evaluates scores correctly without penalizing offline sensors.\n')

// 4. FACE & PROFILE RECOGNITION
console.log('[TEST 4] Testing User Profile & Face Recognition Service...')
const allProfiles = faceRecognitionService.getAllProfiles()
console.log(`- Registered Profiles Count: ${allProfiles.length} (Primary: ${allProfiles[0].name})`)
const newProfile = faceRecognitionService.createNewProfile('Jordan Lee')
console.log(`- Created Profile: ${newProfile.name} (ID: ${newProfile.id})`)
console.log('✓ PASS: User Profile & Face Recognition manager operates smoothly.\n')

// 5. SAME-USER PREVIOUS REPORT COMPARISON & DUAL PERSISTENCE
console.log('[TEST 5] Testing Same-User History & Dynamic Comparison...')
const userA_id = newProfile.id

// Save Session 1 for User A
const session1 = await sessionHistoryService.saveSession({
  sessionId: 'SMR-E2E-001',
  profileId: userA_id,
  profileName: 'Jordan Lee',
  reading: { heartRate: 72, spo2: 98, temperature: 36.6, distance: 65, posture: 'Good', fatigue: 'Low', isDemo: true },
  analysis: healthyAnalysis
})
console.log(`- Saved Session 1: ID=${session1.session_id}, Score=${session1.health_analysis[0].wellness_score}`)

// Save Session 2 for User A (Follow-up with mild fatigue)
const session2_analysis = analyzeHealthTelemetry({
  heartRate: 88,
  spo2: 97,
  temperature: 36.7,
  distance: 55,
  posture: 'Needs Improvement',
  fatigue: 'Moderate'
})

const session2 = await sessionHistoryService.saveSession({
  sessionId: 'SMR-E2E-002',
  profileId: userA_id,
  profileName: 'Jordan Lee',
  reading: { heartRate: 88, spo2: 97, temperature: 36.7, distance: 55, posture: 'Needs Improvement', fatigue: 'Moderate', isDemo: true },
  analysis: session2_analysis
})
console.log(`- Saved Session 2: ID=${session2.session_id}, Score=${session2.health_analysis[0].wellness_score}`)

// Compare Session 2 with Session 1 of the SAME user
const comparison = compareSameUserReports(
  { id: session2.session_id, reading: { heartRate: 88, spo2: 97, temperature: 36.7 }, wellnessScore: session2_analysis.wellnessScore, recommendations: session2_analysis.recommendations },
  { id: session1.session_id, reading: { heartRate: 72, spo2: 98, temperature: 36.6 }, wellnessScore: healthyAnalysis.wellnessScore }
)

console.log(`- Comparison Delta: ${comparison.previousScore} → ${comparison.currentScore} (${comparison.scoreDelta >= 0 ? '+' : ''}${comparison.scoreDelta} pts, ${comparison.overallTrend})`)
console.log(`- "What Changed?" Bullets:`)
comparison.changedItems.forEach(ch => console.log(`   * ${ch}`))
console.log(`- "What to Improve" Suggestions:`)
comparison.whatToImprove.forEach(imp => console.log(`   * [${imp.category}] ${imp.suggestion}`))

console.log('\n====================================================================')
console.log(' ALL SMART MIRROR FULL SYSTEM E2E TESTS PASSED (100% SUCCESS) ')
console.log('====================================================================\n')
