import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import StoneIcon from './StoneIcon'
import HomeIcon from './HomeIcon'
import AstragalusIcon from './AstragalusIcon'
import FeedbackModal from './FeedbackModal'
import RateModal from './RateModal'
import PuzzleGame from './PuzzleGame'
import AuthModal from './AuthModal'
import ReinstallPrompt, { shouldShowReinstallPrompt } from './ReinstallPrompt'
import SecurityAnswerBanner from './SecurityAnswerBanner'
import DataPrivacyBanner from './DataPrivacyBanner'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { getTraditionSettings, shouldApplyBranding } from './TraditionSettings'
import { translateTerm } from '../data/traditions'
import versionInfo from '../version.json'
import './Layout.css'

const ALL_NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '⌂', id: 'home' },
  { path: '/timer', label: 'Timer', icon: '◷', id: 'timer' },
  { path: '/daily', label: 'Daily', icon: '☀', id: 'daily' },
  { path: '/journal', label: 'Journal', icon: '✎', id: 'journal' },
  { path: '/library', label: 'Library', icon: '▤', id: 'library' },
  { path: '/resources', label: 'Resources', icon: '☁', id: 'resources' },
  { path: '/links', label: 'Links', icon: '⛓', id: 'links' },
  { path: '/calendar', label: 'Calendar', icon: '▦', id: 'calendar' }
]

const DEFAULT_VISIBLE = ['home', 'timer', 'daily', 'journal', 'library', 'resources', 'calendar']

// Default labels for nav items
const DEFAULT_LABELS = {
  home: 'Home',
  timer: 'Timer',
  daily: 'Daily',
  journal: 'Journal',
  library: 'Library',
  resources: 'Resources',
  links: 'Links',
  calendar: 'Calendar'
}

// Map routes to page IDs for theming
const ROUTE_TO_PAGE = {
  '/': 'home',
  '/timer': 'timer',
  '/daily': 'daily',
  '/practice-history': 'daily',
  '/journal': 'journal',
  '/library': 'library',
  '/resources': 'resources',
  '/links': 'links',
  '/calendar': 'calendar',
  '/settings': 'settings',
  '/guide': 'settings',
  '/tools': 'tools',
  '/play': 'play'
}

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { getThemeForPage, applyTheme } = useTheme()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [rateOpen, setRateOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [visibleNavItems, setVisibleNavItems] = useState(DEFAULT_VISIBLE)
  const [customLabels, setCustomLabels] = useState(DEFAULT_LABELS)
  const [puzzleOpen, setPuzzleOpen] = useState(false)
  const [reinstallPromptOpen, setReinstallPromptOpen] = useState(false)

  // Check if we should show reinstall prompt on mount
  useEffect(() => {
    if (shouldShowReinstallPrompt()) {
      // Small delay to let the app load first
      const timer = setTimeout(() => {
        setReinstallPromptOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  // Apply theme based on current route
  useEffect(() => {
    const pageId = ROUTE_TO_PAGE[location.pathname] || 'home'
    const themeId = getThemeForPage(pageId)
    applyTheme(themeId)
  }, [location.pathname, getThemeForPage, applyTheme])

  // Load nav preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sanctum-nav-items')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVisibleNavItems(parsed)
        }
      } catch (e) {
        console.error('Error loading nav preferences:', e)
      }
    }

    // Load custom labels
    const savedLabels = localStorage.getItem('sanctum-nav-labels')
    if (savedLabels) {
      try {
        const parsed = JSON.parse(savedLabels)
        setCustomLabels({ ...DEFAULT_LABELS, ...parsed })
      } catch (e) {
        console.error('Error loading nav labels:', e)
      }
    }
  }, [])

  // Save nav preferences
  function saveNavPreferences(items) {
    setVisibleNavItems(items)
    localStorage.setItem('sanctum-nav-items', JSON.stringify(items))
  }

  function toggleNavItem(id) {
    const newItems = visibleNavItems.includes(id)
      ? visibleNavItems.filter(i => i !== id)
      : [...visibleNavItems, id]

    // Ensure at least Home is always visible
    if (newItems.length === 0 || !newItems.includes('home')) {
      newItems.unshift('home')
    }

    saveNavPreferences(newItems)
  }

  // Update a custom label
  function updateLabel(id, newLabel) {
    const updated = { ...customLabels, [id]: newLabel || DEFAULT_LABELS[id] }
    setCustomLabels(updated)
    localStorage.setItem('sanctum-nav-labels', JSON.stringify(updated))
  }

  // Get label for an item (custom, tradition-specific, or default)
  function getLabel(id) {
    // Check for custom label first
    if (customLabels[id] && customLabels[id] !== DEFAULT_LABELS[id]) {
      return customLabels[id]
    }

    // Check for tradition-specific terminology
    if (shouldApplyBranding()) {
      const settings = getTraditionSettings()
      if (settings.traditionId) {
        const defaultLabel = DEFAULT_LABELS[id]
        const translatedLabel = translateTerm(defaultLabel, settings.traditionId)
        if (translatedLabel !== defaultLabel) {
          return translatedLabel
        }
      }
    }

    return customLabels[id] || DEFAULT_LABELS[id]
  }

  // Reset all labels to defaults
  function resetLabels() {
    setCustomLabels(DEFAULT_LABELS)
    localStorage.removeItem('sanctum-nav-labels')
  }

  // Get current page title
  const currentPage = ALL_NAV_ITEMS.find(item => item.path === location.pathname)
  const pageTitle = currentPage ? getLabel(currentPage.id) : (location.pathname === '/settings' ? 'Settings' : 'Practice Space')

  // Filter nav items based on preferences
  const navItems = ALL_NAV_ITEMS.filter(item => visibleNavItems.includes(item.id))

  return (
    <div className="layout">
      <header className="header">
        <button
          className="header-home-btn"
          onClick={() => navigate('/')}
          aria-label="Home"
        >
          <HomeIcon size={28} />
        </button>
        <h1 className="header-title">{pageTitle}</h1>
        <button
          className="header-settings-btn"
          onClick={() => navigate('/settings')}
          aria-label="Settings"
        >
          ⚙
        </button>
      </header>

      {isAuthenticated && <SecurityAnswerBanner />}
      <DataPrivacyBanner />

      <main className="main-content">
        {children}
      </main>

      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item--active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{getLabel(item.id)}</span>
          </NavLink>
        ))}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item--active' : ''}`
          }
        >
          <span className="nav-icon">⚙</span>
          <span className="nav-label">Settings</span>
        </NavLink>
      </nav>

      {/* Floating stone button - desktop only */}
      <button
        className="raven-button"
        onClick={() => setFeedbackOpen(true)}
        aria-label="Whisper to the Oracle"
        title="Whisper to the Oracle"
      >
        <StoneIcon size={24} />
      </button>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <RateModal isOpen={rateOpen} onClose={() => setRateOpen(false)} />
      <PuzzleGame isOpen={puzzleOpen} onClose={() => setPuzzleOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ReinstallPrompt isOpen={reinstallPromptOpen} onClose={() => setReinstallPromptOpen(false)} />
    </div>
  )
}

export default Layout
