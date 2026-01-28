import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AVAILABLE_TRADITIONS, getTraditionPreset } from '../data/traditions'
import './TraditionSettings.css'

const STORAGE_KEY = 'sanctum-tradition-settings'

// Get current tradition settings from localStorage
export function getTraditionSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading tradition settings:', e)
  }
  return {
    enabled: false,
    traditionId: null,
    customName: ''
  }
}

// Save tradition settings to localStorage
export function saveTraditionSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  // Dispatch event so other components can react
  window.dispatchEvent(new CustomEvent('tradition-changed', { detail: settings }))
}

// Get the active tradition preset (or null if disabled)
export function getActiveTraditionPreset() {
  const settings = getTraditionSettings()
  if (!settings.enabled || !settings.traditionId) {
    return null
  }
  return getTraditionPreset(settings.traditionId)
}

function TraditionSettings() {
  const [settings, setSettings] = useState(getTraditionSettings)
  const [showTraditionList, setShowTraditionList] = useState(false)
  const [customTradition, setCustomTradition] = useState(settings.customName || '')

  const selectedTradition = AVAILABLE_TRADITIONS.find(t => t.id === settings.traditionId)
  const hasPreset = selectedTradition?.hasPreset

  function handleToggleEnabled() {
    const newSettings = {
      ...settings,
      enabled: !settings.enabled
    }
    setSettings(newSettings)
    saveTraditionSettings(newSettings)
  }

  function handleSelectTradition(traditionId) {
    const newSettings = {
      ...settings,
      traditionId,
      enabled: true,
      customName: traditionId === 'custom' ? customTradition : ''
    }
    setSettings(newSettings)
    saveTraditionSettings(newSettings)
    setShowTraditionList(false)
  }

  function handleCustomNameChange(e) {
    const name = e.target.value
    setCustomTradition(name)
    if (settings.traditionId === 'custom') {
      const newSettings = { ...settings, customName: name }
      setSettings(newSettings)
      saveTraditionSettings(newSettings)
    }
  }

  function handleClearTradition() {
    const newSettings = {
      enabled: false,
      traditionId: null,
      customName: ''
    }
    setSettings(newSettings)
    saveTraditionSettings(newSettings)
    setCustomTradition('')
  }

  return (
    <div className="tradition-settings">
      {/* Current Selection Display */}
      {settings.traditionId ? (
        <div className="tradition-current">
          <div className="tradition-current-info">
            <span className="tradition-icon">{selectedTradition?.icon || '✨'}</span>
            <div className="tradition-details">
              <span className="tradition-name">
                {settings.traditionId === 'custom' && settings.customName
                  ? settings.customName
                  : selectedTradition?.name || 'Unknown'}
              </span>
              <span className="tradition-status">
                {settings.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>
          <div className="tradition-current-actions">
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={handleToggleEnabled}
              />
              <span className="toggle-slider"></span>
            </div>
          </div>
        </div>
      ) : (
        <div className="tradition-empty">
          <p>No tradition selected</p>
          <p className="tradition-empty-hint">
            Choose a spiritual tradition to customize your practice experience
          </p>
        </div>
      )}

      {/* Tradition Guide Link (if preset available) */}
      {settings.enabled && hasPreset && (
        <Link to={`/guide/${settings.traditionId}`} className="tradition-guide-link">
          <span className="guide-icon">📖</span>
          <span>View {selectedTradition?.name} Practice Guide</span>
          <span className="guide-arrow">→</span>
        </Link>
      )}

      {/* Select/Change Button */}
      <button
        className="tradition-select-btn"
        onClick={() => setShowTraditionList(!showTraditionList)}
      >
        {settings.traditionId ? 'Change Tradition' : 'Select Tradition'}
      </button>

      {/* Clear Button */}
      {settings.traditionId && (
        <button
          className="tradition-clear-btn"
          onClick={handleClearTradition}
        >
          Reset to Default
        </button>
      )}

      {/* Tradition Selection List */}
      {showTraditionList && (
        <div className="tradition-list">
          <h4>Choose Your Tradition</h4>
          <div className="tradition-grid">
            {AVAILABLE_TRADITIONS.map(tradition => (
              <button
                key={tradition.id}
                className={`tradition-option ${settings.traditionId === tradition.id ? 'tradition-option--selected' : ''} ${tradition.hasPreset ? 'tradition-option--has-preset' : ''}`}
                onClick={() => handleSelectTradition(tradition.id)}
                style={{ '--tradition-color': tradition.color }}
              >
                <span className="tradition-option-icon">{tradition.icon}</span>
                <span className="tradition-option-name">{tradition.name}</span>
                {tradition.hasPreset && (
                  <span className="tradition-option-badge">Full Preset</span>
                )}
              </button>
            ))}
          </div>

          {/* Custom Name Input */}
          {settings.traditionId === 'custom' && (
            <div className="custom-tradition-input">
              <label>Your Tradition Name:</label>
              <input
                type="text"
                value={customTradition}
                onChange={handleCustomNameChange}
                placeholder="Enter your tradition..."
                className="input"
              />
            </div>
          )}

          <button
            className="tradition-list-close"
            onClick={() => setShowTraditionList(false)}
          >
            Close
          </button>
        </div>
      )}

      {/* Info about what presets do */}
      <div className="tradition-info">
        <p>
          <strong>What does this do?</strong>
        </p>
        <ul>
          <li>Traditions with "Full Preset" include custom practices, calendar integration, journaling prompts, and a practice guide</li>
          <li>Other traditions will customize calendar defaults and can be expanded in future updates</li>
          <li>You can always access all features regardless of tradition selected</li>
        </ul>
      </div>
    </div>
  )
}

export default TraditionSettings
