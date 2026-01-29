import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import StoneIcon from './StoneIcon'
import AstragalusIcon from './AstragalusIcon'
import FeedbackModal from './FeedbackModal'
import RateModal from './RateModal'
import PuzzleGame from './PuzzleGame'
import AuthModal from './AuthModal'
import ReinstallPrompt, { shouldShowReinstallPrompt } from './ReinstallPrompt'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
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
  const { user, isAuthenticated, firebaseAvailable } = useAuth()
  const { getThemeForPage, applyTheme } = useTheme()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [rateOpen, setRateOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [visibleNavItems, setVisibleNavItems] = useState(DEFAULT_VISIBLE)
  const [customLabels, setCustomLabels] = useState(DEFAULT_LABELS)
  const [editingLabels, setEditingLabels] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
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

  // Get label for an item (custom or default)
  function getLabel(id) {
    return customLabels[id] || DEFAULT_LABELS[id]
  }

  // Reset all labels to defaults
  function resetLabels() {
    setCustomLabels(DEFAULT_LABELS)
    localStorage.removeItem('sanctum-nav-labels')
  }

  // Share the app
  async function handleShareApp() {
    const shareData = {
      title: 'Practice Space',
      text: 'Your sacred place for spiritual practice tracking',
      url: 'https://sanctum-pwa-app.netlify.app'
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        // User didn't cancel, try clipboard fallback
        try {
          await navigator.clipboard.writeText(shareData.url)
          alert('Link copied to clipboard!')
        } catch {
          alert('Share link: ' + shareData.url)
        }
      }
    }
  }

  // Delete all data and uninstall
  async function handleDeleteAllData() {
    try {
      // Clear IndexedDB
      const databases = await indexedDB.databases()
      for (const db of databases) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name)
        }
      }

      // Clear localStorage
      localStorage.clear()

      // Clear sessionStorage
      sessionStorage.clear()

      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      }

      // Clear caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName)
        }
      }

      // Show success and instructions
      alert('All data has been deleted.\n\nTo complete uninstall:\n• iOS: Long-press the app icon → Remove App\n• Android: Long-press → Uninstall\n• Desktop: Click the install icon in address bar → Uninstall')

      // Redirect to home and reload
      window.location.href = '/'
      window.location.reload()
    } catch (error) {
      console.error('Error deleting data:', error)
      alert('Error deleting some data. Please try again.')
    }
  }

  // Get current page title
  const currentPage = ALL_NAV_ITEMS.find(item => item.path === location.pathname)
  const pageTitle = currentPage ? getLabel(currentPage.id) : (location.pathname === '/settings' ? 'Settings' : 'Practice Space')

  // Filter nav items based on preferences
  const navItems = ALL_NAV_ITEMS.filter(item => visibleNavItems.includes(item.id))

  return (
    <div className="layout">
      <header className="header">
        <h1 className="header-title">{pageTitle}</h1>
        <button
          className="header-settings-btn"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
        >
          ⚙
        </button>
      </header>

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
        <button
          className="nav-item nav-settings-btn"
          onClick={() => setSettingsOpen(true)}
        >
          <span className="nav-icon">⚙</span>
          <span className="nav-label">Settings</span>
        </button>
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

      {/* Settings drawer */}
      {settingsOpen && (
        <div className="settings-drawer-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="settings-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="settings-drawer-header">
              <h2>Settings</h2>
              <button
                className="settings-drawer-close"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="settings-drawer-content">
              <section className="settings-drawer-section">
                <h3>Account</h3>
                {isAuthenticated ? (
                  <div className="account-summary">
                    <div className="account-summary-avatar">
                      {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="account-summary-info">
                      {user?.displayName && <span className="account-summary-name">{user.displayName}</span>}
                      <span className="account-summary-email">{user?.email}</span>
                    </div>
                    <button
                      className="account-manage-btn"
                      onClick={() => {
                        setSettingsOpen(false)
                        navigate('/settings')
                      }}
                    >
                      Manage
                    </button>
                  </div>
                ) : (
                  <div className="account-signin-prompt">
                    <p>Sign in to sync your practice across devices</p>
                    {firebaseAvailable ? (
                      <button
                        className="btn btn-primary account-signin-btn-small"
                        onClick={() => {
                          setSettingsOpen(false)
                          setAuthModalOpen(true)
                        }}
                      >
                        Sign In
                      </button>
                    ) : (
                      <p className="account-not-configured-small">Cloud sync not configured</p>
                    )}
                  </div>
                )}
              </section>

              <section className="settings-drawer-section">
                <h3>Support Practice Space</h3>
                <div className="support-buttons">
                  <button
                    className="support-btn"
                    onClick={() => {
                      setSettingsOpen(false)
                      setRateOpen(true)
                    }}
                  >
                    <span className="support-btn-icon">★</span>
                    <span>Rate</span>
                  </button>
                  <button
                    className="support-btn"
                    onClick={handleShareApp}
                  >
                    <span className="support-btn-icon">↗</span>
                    <span>Share</span>
                  </button>
                </div>
              </section>

              <section className="settings-drawer-section">
                <div className="settings-section-header">
                  <h3>Navigation</h3>
                  <div className="settings-section-actions">
                    {editingLabels && (
                      <button
                        className="reset-labels-btn"
                        onClick={resetLabels}
                      >
                        Reset
                      </button>
                    )}
                    <button
                      className="edit-labels-btn"
                      onClick={() => setEditingLabels(!editingLabels)}
                    >
                      {editingLabels ? 'Done' : 'Edit Names'}
                    </button>
                  </div>
                </div>
                <p className="settings-drawer-hint">
                  {editingLabels
                    ? 'Tap a name to customize it'
                    : 'Uncheck to hide from menu'}
                </p>
                <div className="nav-toggles">
                  {ALL_NAV_ITEMS.filter(item => visibleNavItems.includes(item.id)).map(item => (
                    <label key={item.id} className="nav-toggle">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleNavItem(item.id)}
                        disabled={item.id === 'home' || editingLabels}
                      />
                      <span className="nav-toggle-icon">{item.icon}</span>
                      {editingLabels ? (
                        <input
                          type="text"
                          className="nav-label-input"
                          value={getLabel(item.id)}
                          onChange={(e) => updateLabel(item.id, e.target.value)}
                          placeholder={DEFAULT_LABELS[item.id]}
                          maxLength={12}
                        />
                      ) : (
                        <span className="nav-toggle-label">{getLabel(item.id)}</span>
                      )}
                      {item.id === 'home' && !editingLabels && <span className="nav-toggle-required">Required</span>}
                    </label>
                  ))}
                </div>
              </section>

              {/* Hidden Pages - show navigation for pages not in bottom nav */}
              {ALL_NAV_ITEMS.filter(item => !visibleNavItems.includes(item.id)).length > 0 && (
                <section className="settings-drawer-section">
                  <h3>Hidden Pages</h3>
                  <p className="settings-drawer-hint">Check to restore to menu, or tap to visit</p>
                  <div className="nav-toggles">
                    {ALL_NAV_ITEMS.filter(item => !visibleNavItems.includes(item.id)).map(item => (
                      <label key={item.id} className="nav-toggle nav-toggle--hidden">
                        <input
                          type="checkbox"
                          checked={false}
                          onChange={() => toggleNavItem(item.id)}
                        />
                        <span className="nav-toggle-icon">{item.icon}</span>
                        <span className="nav-toggle-label">{getLabel(item.id)}</span>
                        <button
                          className="nav-toggle-visit"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSettingsOpen(false)
                            navigate(item.path)
                          }}
                        >
                          Go
                        </button>
                      </label>
                    ))}
                  </div>
                </section>
              )}

              <section className="settings-drawer-section">
                <h3>More Options</h3>
                <div className="settings-drawer-links">
                  <button
                    className="settings-drawer-link"
                    onClick={() => {
                      setSettingsOpen(false)
                      navigate('/settings')
                    }}
                  >
                    <span>📦</span>
                    <span>Data & Backup</span>
                  </button>
                  <button
                    className="settings-drawer-link"
                    onClick={() => {
                      setSettingsOpen(false)
                      navigate('/practice-history')
                    }}
                  >
                    <span>📊</span>
                    <span>Practice History</span>
                  </button>
                  <button
                    className="settings-drawer-link"
                    onClick={() => {
                      setSettingsOpen(false)
                      setFeedbackOpen(true)
                    }}
                  >
                    <span><StoneIcon size={18} glow={false} /></span>
                    <span>Whisper to the Oracle</span>
                  </button>
                  <button
                    className="settings-drawer-link"
                    onClick={() => {
                      setSettingsOpen(false)
                      navigate('/tools')
                    }}
                  >
                    <span>✡</span>
                    <span>Esoteric Tools</span>
                  </button>
                  <button
                    className="settings-drawer-link"
                    onClick={() => {
                      setSettingsOpen(false)
                      navigate('/play')
                    }}
                  >
                    <span><AstragalusIcon size={18} /></span>
                    <span>Play</span>
                  </button>
                </div>
              </section>

              <section className="settings-drawer-section settings-drawer-danger">
                <h3>Danger Zone</h3>
                {!showDeleteConfirm ? (
                  <button
                    className="settings-drawer-link settings-drawer-link--danger"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <span>🗑</span>
                    <span>Delete All Data & Uninstall</span>
                  </button>
                ) : (
                  <div className="delete-confirm">
                    <p className="delete-confirm-text">
                      This will permanently delete all your data including journal entries, meditation sessions, and practice logs. This cannot be undone.
                    </p>
                    <div className="delete-confirm-buttons">
                      <button
                        className="btn btn-danger"
                        onClick={handleDeleteAllData}
                      >
                        Yes, Delete Everything
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <div className="settings-drawer-version">
                v{versionInfo.version}
              </div>
            </div>
          </div>
        </div>
      )}

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <RateModal isOpen={rateOpen} onClose={() => setRateOpen(false)} />
      <PuzzleGame isOpen={puzzleOpen} onClose={() => setPuzzleOpen(false)} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ReinstallPrompt isOpen={reinstallPromptOpen} onClose={() => setReinstallPromptOpen(false)} />
    </div>
  )
}

export default Layout
