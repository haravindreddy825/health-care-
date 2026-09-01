import React from 'react'
import { SmartMirrorProvider, useSmartMirror } from './context/SmartMirrorContext'
import { SmartMirrorNavbar } from './components/layout/SmartMirrorNavbar'
import { GlobalFooter } from './components/layout/GlobalFooter'

// Pages
import { MirrorHUDPage } from './pages/MirrorHUDPage'
import { DashboardPage } from './pages/DashboardPage'
import { SensorsPage } from './pages/SensorsPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { HistoryPage } from './pages/HistoryPage'
import { RecommendationsPage } from './pages/RecommendationsPage'
import { ProfilesPage } from './pages/ProfilesPage'
import { SettingsPage } from './pages/SettingsPage'

import { Sparkles } from 'lucide-react'

function AppContent() {
  const { activeTab, toast } = useSmartMirror()

  const renderActivePage = () => {
    switch (activeTab) {
      case 'mirror':
        return <MirrorHUDPage />
      case 'dashboard':
        return <DashboardPage />
      case 'sensors':
        return <SensorsPage />
      case 'analysis':
        return <AnalysisPage />
      case 'history':
        return <HistoryPage />
      case 'recommendations':
        return <RecommendationsPage />
      case 'profiles':
        return <ProfilesPage />
      case 'settings':
        return <SettingsPage />
      default:
        return <MirrorHUDPage />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed top-20 right-5 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all animate-fadeIn bg-slate-900/95 border-cyan-500/50 text-cyan-300 font-mono text-xs shadow-cyan-500/20">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Top Global Navigation Bar */}
      <SmartMirrorNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 pt-2">
        {renderActivePage()}
      </main>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  )
}

export function App() {
  return (
    <SmartMirrorProvider>
      <AppContent />
    </SmartMirrorProvider>
  )
}

export default App
