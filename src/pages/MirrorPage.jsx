import React from 'react'
import { SmartMirrorFrame } from '../components/SmartMirrorFrame'
import { PreparingReportScreen } from '../components/PreparingReportScreen'
import { SmartMirrorReport } from '../components/SmartMirrorReport'

export function MirrorPage({
  mirrorState,
  videoRef,
  isReturningUser,
  gettingReadyCountdown,
  countdownSeconds,
  observationDurationSetting,
  isCameraActive,
  cameraError,
  onStartCamera,
  onStartWellnessCheck,
  onSkipCountdown,
  livePosture,
  liveFatigue,
  demoHeartRate,
  demoTemperature,
  onPreparationComplete,
  reportData,
  aiInsights,
  isAiLoading,
  currentProfile,
  sessionId,
  isDemoMode,
  onReturnToCamera,
  onStartNewCheck,
  saveStatus,
  historyList,
  trendData
}) {
  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* 1. Camera & Observation View */}
      {(mirrorState === 'IDLE' ||
        mirrorState === 'PERSON_DETECTED' ||
        mirrorState === 'COUNTDOWN' ||
        mirrorState === 'OBSERVING') && (
        <SmartMirrorFrame
          videoRef={videoRef}
          mirrorState={mirrorState}
          isReturningUser={isReturningUser}
          gettingReadyCountdown={gettingReadyCountdown}
          countdownSeconds={countdownSeconds}
          totalObservationSeconds={observationDurationSetting}
          isCameraActive={isCameraActive}
          cameraError={cameraError}
          onStartCamera={onStartCamera}
          onStartWellnessCheck={onStartWellnessCheck}
          onSkipCountdown={onSkipCountdown}
          livePosture={livePosture}
          liveFatigue={liveFatigue}
          liveHeartRate={demoHeartRate}
          liveTemperature={demoTemperature}
        />
      )}

      {/* 2. Preparing Report Animation */}
      {mirrorState === 'PREPARING_REPORT' && (
        <PreparingReportScreen onComplete={onPreparationComplete} />
      )}

      {/* 3. Comprehensive Report View */}
      {mirrorState === 'REPORT_READY' && reportData && (
        <SmartMirrorReport
          reportData={reportData}
          aiInsights={aiInsights}
          isAiLoading={isAiLoading}
          profileId={currentProfile}
          sessionId={sessionId}
          isDemoMode={isDemoMode}
          observationDuration={observationDurationSetting === 120 ? '2 minutes' : '10 seconds (Fast Demo)'}
          onReturnToCamera={onReturnToCamera}
          onStartNewCheck={onStartNewCheck}
          saveStatus={saveStatus}
          historyList={historyList}
          trendData={trendData}
        />
      )}
    </div>
  )
}
