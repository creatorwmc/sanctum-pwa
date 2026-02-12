import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStreakSettings, saveStreakSettings } from '../utils/streakSettings'
import './Settings.css'
import './LayoutSettings.css'

const LAYOUT_STORAGE_KEY = 'sanctum-layout-settings'

// Default layout configuration
const DEFAULT_LAYOUT = {
  showStreaks: true,
  showBonusPoints: true,
  showStoredPractices: true,
  showTodayProgress: true,
  showTotalSessions: true,
  showRecentJournal: true,
  showQuickAccess: true,
  quickActions: ['timer', 'daily', 'journal']
}

// Available quick actions
const AVAILABLE_QUICK_ACTIONS = [
  { id: 'timer', label: 'Timer', icon: '◷', description: 'Start a timed practice session' },
  { id: 'daily', label: 'Daily Log', icon: '☀', description: 'Log your daily practices' },
  { id: 'journal', label: 'Journal', icon: '✎', description: 'Write a journal entry' },
  { id: 'calendar', label: 'Calendar', icon: '📅', description: 'View your practice calendar' },
  { id: 'library', label: 'Library', icon: '📚', description: 'Browse your library' },
  { id: 'tools', label: 'Tools', icon: '🔮', description: 'Access esoteric tools' }
]

// Get layout settings from localStorage
export function getLayoutSettings() {
  try {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY)
    if (saved) {
      return { ...DEFAULT_LAYOUT, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('Error loading layout settings:', e)
  }
  return DEFAULT_LAYOUT
}

// Save layout settings to localStorage
export function saveLayoutSettings(settings) {
  localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(settings))
  window.dispatchEvent(new CustomEvent('layout-changed', { detail: settings }))
}

function LayoutSettings() {
  const [settings, setSettings] = useState(getLayoutSettings)
  const [streakEnabled, setStreakEnabled] = useState(getStreakSettings().enabled === true)

  // Update settings when streak changes externally
  useEffect(() => {
    function handleStreakChange(e) {
      setStreakEnabled(e.detail.enabled)
    }
    window.addEventListener('streak-settings-changed', handleStreakChange)
    return () => window.removeEventListener('streak-settings-changed', handleStreakChange)
  }, [])

  function updateSetting(key, value) {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    saveLayoutSettings(newSettings)
  }

  function toggleQuickAction(actionId) {
    const currentActions = settings.quickActions || []
    let newActions

    if (currentActions.includes(actionId)) {
      // Remove action (but keep at least 1)
      if (currentActions.length > 1) {
        newActions = currentActions.filter(id => id !== actionId)
      } else {
        return // Don't remove the last action
      }
    } else {
      // Add action (max 4)
      if (currentActions.length < 4) {
        newActions = [...currentActions, actionId]
      } else {
        return // Already at max
      }
    }

    updateSetting('quickActions', newActions)
  }

  function handleStreakToggle() {
    const newValue = !streakEnabled
    setStreakEnabled(newValue)
    saveStreakSettings({ enabled: newValue })
    updateSetting('showStreaks', newValue)
  }

  return (
    <div className="settings-page">
      <div className="settings-back-header">
        <Link to="/settings" className="settings-back-link">
          <span>←</span>
          <span>Settings</span>
        </Link>
        <h1 className="settings-page-title">Home Screen Layout</h1>
      </div>

      <p className="layout-intro">
        Customize what appears on your dashboard. Toggle sections on or off to create your ideal practice space.
      </p>

      <section className="settings-section">
        <h2 className="settings-section-title">Quick Actions</h2>
        <p className="settings-section-hint">Choose 1-4 actions for quick access on your home screen</p>
        <div className="quick-actions-grid">
          {AVAILABLE_QUICK_ACTIONS.map(action => {
            const isSelected = settings.quickActions?.includes(action.id)
            return (
              <button
                key={action.id}
                className={`quick-action-option ${isSelected ? 'quick-action-option--selected' : ''}`}
                onClick={() => toggleQuickAction(action.id)}
              >
                <span className="quick-action-option-icon">{action.icon}</span>
                <span className="quick-action-option-label">{action.label}</span>
                {isSelected && <span className="quick-action-check">✓</span>}
              </button>
            )
          })}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Dashboard Sections</h2>
        <div className="settings-list">
          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">🔥</span>
              <div>
                <span className="settings-item-label">Practice Streaks</span>
                <span className="settings-item-desc">Show current and best streak</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={streakEnabled && settings.showStreaks}
                onChange={handleStreakToggle}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>

          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">⭐</span>
              <div>
                <span className="settings-item-label">Bonus Points</span>
                <span className="settings-item-desc">Show earned bonus points</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showBonusPoints}
                onChange={() => updateSetting('showBonusPoints', !settings.showBonusPoints)}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>

          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">🏦</span>
              <div>
                <span className="settings-item-label">Stored Practices</span>
                <span className="settings-item-desc">Show banked practice energy</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showStoredPractices}
                onChange={() => updateSetting('showStoredPractices', !settings.showStoredPractices)}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>

          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">📊</span>
              <div>
                <span className="settings-item-label">Today's Progress</span>
                <span className="settings-item-desc">Show practices completed today</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showTodayProgress}
                onChange={() => updateSetting('showTodayProgress', !settings.showTodayProgress)}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>

          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">🧘</span>
              <div>
                <span className="settings-item-label">Total Sessions</span>
                <span className="settings-item-desc">Show lifetime session count</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showTotalSessions}
                onChange={() => updateSetting('showTotalSessions', !settings.showTotalSessions)}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>

          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">✎</span>
              <div>
                <span className="settings-item-label">Recent Journal</span>
                <span className="settings-item-desc">Show latest journal entries</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showRecentJournal}
                onChange={() => updateSetting('showRecentJournal', !settings.showRecentJournal)}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>

          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">🔗</span>
              <div>
                <span className="settings-item-label">Quick Access Links</span>
                <span className="settings-item-desc">Show tradition/library quick links</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.showQuickAccess}
                onChange={() => updateSetting('showQuickAccess', !settings.showQuickAccess)}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
        </div>
      </section>

      <p className="layout-note">
        Changes are saved automatically and will appear on your home screen.
      </p>
    </div>
  )
}

export default LayoutSettings
