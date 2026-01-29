import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { OnboardingProvider, useOnboarding } from './contexts/OnboardingContext'
import Layout from './components/Layout'
import AuthModal from './components/AuthModal'
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

function SplashScreen({ isQuick, showAuthButtons, onSignUpClick, onSignInClick, onSkip }) {
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
        @keyframes fadeInAuthButtons {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
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
        .splash-auth-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-top: 1rem;
          opacity: 0;
          animation: fadeInAuthButtons 0.8s ease-out forwards;
          animation-delay: ${isQuick ? '0.4s' : '4.5s'};
        }
        .splash-signup-btn {
          background: linear-gradient(135deg, #d4af37 0%, #c9a227 100%);
          color: #1a1a2e;
          border: none;
          padding: 0.875rem 2.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
          min-width: 200px;
        }
        .splash-signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }
        .splash-signup-btn:active {
          transform: translateY(0);
        }
        .splash-signin-btn {
          background: transparent;
          color: #e8e8e8;
          border: 1px solid rgba(232, 232, 232, 0.3);
          padding: 0.75rem 2.5rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          min-width: 200px;
        }
        .splash-signin-btn:hover {
          border-color: rgba(232, 232, 232, 0.5);
          background: rgba(255, 255, 255, 0.05);
        }
        .splash-skip-link {
          background: none;
          border: none;
          color: rgba(232, 232, 232, 0.5);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          margin-top: 0.5rem;
          transition: color 0.2s;
        }
        .splash-skip-link:hover {
          color: rgba(232, 232, 232, 0.8);
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
        {showAuthButtons && (
          <div className="splash-auth-buttons">
            <button className="splash-signup-btn" onClick={onSignUpClick}>
              Create Account
            </button>
            <button className="splash-signin-btn" onClick={onSignInClick}>
              Sign In
            </button>
            <button className="splash-skip-link" onClick={onSkip}>
              Skip for now
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function AppContent() {
  const { isComplete } = useOnboarding()
  const { isAuthenticated } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [isInstalledApp] = useState(() => isPWA())
  const navigate = useNavigate()
  const location = useLocation()
  const [hasRedirected, setHasRedirected] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('signin')

  // Show splash screen - auto-dismiss only for authenticated users
  useEffect(() => {
    // Only auto-dismiss if user is authenticated
    if (isAuthenticated) {
      const splashDuration = isInstalledApp ? 1000 : 5000
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, splashDuration)
      return () => clearTimeout(timer)
    }
    // For non-authenticated users, splash stays until they take action
  }, [isInstalledApp, isAuthenticated])

  // Dismiss splash when user successfully authenticates
  useEffect(() => {
    if (isAuthenticated && showSplash) {
      setShowSplash(false)
    }
  }, [isAuthenticated, showSplash])

  // Always navigate to home on app startup (after splash)
  useEffect(() => {
    if (!showSplash && isComplete && !hasRedirected && location.pathname !== '/') {
      navigate('/', { replace: true })
      setHasRedirected(true)
    } else if (!showSplash && isComplete && !hasRedirected) {
      setHasRedirected(true)
    }
  }, [showSplash, isComplete, hasRedirected, location.pathname, navigate])

  // Auth button handlers
  function handleSignUpClick() {
    setAuthModalMode('signup')
    setAuthModalOpen(true)
  }

  function handleSignInClick() {
    setAuthModalMode('signin')
    setAuthModalOpen(true)
  }

  function handleSkipAuth() {
    setShowSplash(false)
  }

  function handleAuthModalClose() {
    setAuthModalOpen(false)
  }

  // Show splash screen while loading or during minimum display time
  if (isComplete === null || showSplash) {
    return (
      <>
        <SplashScreen
          isQuick={isInstalledApp}
          showAuthButtons={!isAuthenticated}
          onSignUpClick={handleSignUpClick}
          onSignInClick={handleSignInClick}
          onSkip={handleSkipAuth}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={handleAuthModalClose}
          initialMode={authModalMode}
        />
      </>
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
