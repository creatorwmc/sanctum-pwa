import { useState, useEffect } from 'react'
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
import AdminWhispers from './pages/AdminWhispers'

// Check if running as installed PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true ||
         document.referrer.includes('android-app://')
}

function SplashScreen({ isQuick }) {
  return (
    <>
      <style>{`
        @keyframes fadeInLogo {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInTitle {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInSubtitle {
          0% { opacity: 0; }
          100% { opacity: 0.9; }
        }
        @keyframes quickFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .splash-logo {
          width: 120px;
          height: 120px;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);
        }
        .splash-logo--animated {
          opacity: 0;
          animation: fadeInLogo 1.2s ease-out 0.5s forwards;
        }
        .splash-logo--quick {
          animation: quickFadeIn 0.3s ease-out forwards;
        }
        .splash-title {
          color: #e8e8e8;
          font-size: 1.75rem;
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          letter-spacing: 0.02em;
        }
        .splash-title--animated {
          opacity: 0;
          animation: fadeInTitle 1s ease-out 2s forwards;
        }
        .splash-title--quick {
          animation: quickFadeIn 0.3s ease-out 0.1s forwards;
        }
        .splash-subtitle {
          color: #d4af37;
          font-size: 1rem;
          margin: 0;
          font-style: italic;
        }
        .splash-subtitle--animated {
          opacity: 0;
          animation: fadeInSubtitle 1s ease-out 3.2s forwards;
        }
        .splash-subtitle--quick {
          animation: quickFadeIn 0.3s ease-out 0.2s forwards;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a4e 0%, #2d1b4e 100%)',
        gap: '1.5rem'
      }}>
        <img
          src="/pwa-192x192.png"
          alt="Practice Space"
          className={`splash-logo ${isQuick ? 'splash-logo--quick' : 'splash-logo--animated'}`}
        />
        <div style={{ textAlign: 'center' }}>
          <h1 className={`splash-title ${isQuick ? 'splash-title--quick' : 'splash-title--animated'}`}>
            Practice Space
          </h1>
          <p className={`splash-subtitle ${isQuick ? 'splash-subtitle--quick' : 'splash-subtitle--animated'}`}>
            Your Sacred Place
          </p>
        </div>
      </div>
    </>
  )
}

function AppContent() {
  const { isComplete } = useOnboarding()
  const [showSplash, setShowSplash] = useState(true)
  const [isInstalledApp] = useState(() => isPWA())

  // Show splash screen - 1 second for PWA, 5 seconds for web
  useEffect(() => {
    const splashDuration = isInstalledApp ? 1000 : 5000
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, splashDuration)
    return () => clearTimeout(timer)
  }, [isInstalledApp])

  // Show splash screen while loading or during minimum display time
  if (isComplete === null || showSplash) {
    return <SplashScreen isQuick={isInstalledApp} />
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
        <Route path="/admin/whispers" element={<AdminWhispers />} />
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
