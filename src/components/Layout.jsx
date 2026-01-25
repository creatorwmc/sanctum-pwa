import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import StoneIcon from './StoneIcon'
import FeedbackModal from './FeedbackModal'
import './Layout.css'

const ALL_NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '⌂', id: 'home' },
  { path: '/timer', label: 'Timer', icon: '◷', id: 'timer' },
  { path: '/daily', label: 'Daily', icon: '☀', id: 'daily' },
  { path: '/journal', label: 'Journal', icon: '✎', id: 'journal' },
  { path: '/library', label: 'Library', icon: '▤', id: 'library' },
  { path: '/links', label: 'Links', icon: '⛓', id: 'links' },
  { path: '/calendar', label: 'Calendar', icon: '▦', id: 'calendar' }
]

const DEFAULT_VISIBLE = ['home', 'timer', 'daily', 'journal', 'library', 'links', 'calendar']

// Default labels for nav items
const DEFAULT_LABELS = {
  home: 'Home',
  timer: 'Timer',
  daily: 'Daily',
  journal: 'Journal',
  library: 'Library',
  links: 'Links',
  calendar: 'Calendar'
}

function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [visibleNavItems, setVisibleNavItems] = useState(DEFAULT_VISIBLE)
  const [customLabels, setCustomLabels] = useState(DEFAULT_LABELS)
  const [editingLabels, setEditingLabels] = useState(false)

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

  // Get current page title
  const currentPage = ALL_NAV_ITEMS.find(item => item.path === location.pathname)
  const pageTitle = currentPage ? getLabel(currentPage.id) : (location.pathname === '/settings' ? 'Settings' : 'Sanctum')

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
                    : 'Toggle which items appear in the bottom menu'}
                </p>
                <div className="nav-toggles">
                  {ALL_NAV_ITEMS.map(item => (
                    <label key={item.id} className="nav-toggle">
                      <input
                        type="checkbox"
                        checked={visibleNavItems.includes(item.id)}
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
                      setFeedbackOpen(true)
                    }}
                  >
                    <span><StoneIcon size={18} glow={false} /></span>
                    <span>Whisper to the Oracle</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  )
}

export default Layout
