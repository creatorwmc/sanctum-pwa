import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingProvider, useOnboarding } from './contexts/OnboardingContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Timer from './pages/Timer'
import Library from './pages/Library'
import Links from './pages/Links'
import Resources from './pages/Resources'
import DailyLog from './pages/DailyLog'
import Calendar from './pages/Calendar'
import Journal from './pages/Journal'
import Settings from './pages/Settings'
import Guide from './pages/Guide'
import EsotericTools from './pages/EsotericTools'
import Play from './pages/Play'
import PracticeHistory from './pages/PracticeHistory'
import Onboarding from './pages/Onboarding'
import DruidGuide from './pages/DruidGuide'
import PracticeManager from './pages/PracticeManager'

function AppContent() {
  const { isComplete } = useOnboarding()

  // Still loading onboarding state
  if (isComplete === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d1210'
      }}>
        <div style={{ color: '#68d391', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    )
  }

  // Show onboarding if not complete
  if (!isComplete) {
    return <Onboarding />
  }

  // Show main app
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/library" element={<Library />} />
        <Route path="/links" element={<Links />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/daily" element={<DailyLog />} />
        <Route path="/practice-history" element={<PracticeHistory />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/guide/druid" element={<DruidGuide />} />
        <Route path="/practices" element={<PracticeManager />} />
        <Route path="/tools" element={<EsotericTools />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <OnboardingProvider>
          <AppContent />
        </OnboardingProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
