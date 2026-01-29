import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AVAILABLE_TRADITIONS, getTraditionPreset, hasSubgroups, getSubgroups, getSubgroup } from '../data/traditions'
import './TraditionSettings.css'

const STORAGE_KEY = 'sanctum-tradition-settings'

// Apply levels for tradition settings
export const APPLY_LEVELS = {
  identity: {
    id: 'identity',
    label: 'Identity Only',
    shortLabel: 'Identity',
    description: 'Just identifies your tradition - no app changes'
  },
  branding: {
    id: 'branding',
    label: 'Labels & Branding',
    shortLabel: 'Branding',
    description: 'Updates terminology and labels throughout the app'
  },
  full: {
    id: 'full',
    label: 'Full Environment',
    shortLabel: 'Full',
    description: 'Updates calendars, daily practices, journal prompts, library, and resources'
  }
}

// Get current tradition settings from localStorage
export function getTraditionSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      // Migrate old settings that used 'enabled' boolean
      if (parsed.enabled !== undefined && !parsed.applyLevel) {
        parsed.applyLevel = parsed.enabled ? 'full' : null
        delete parsed.enabled
      }
      return parsed
    }
  } catch (e) {
    console.error('Error loading tradition settings:', e)
  }
  return {
    applyLevel: null, // null, 'identity', 'branding', or 'full'
    traditionId: null,
    subgroupId: null,
    customName: ''
  }
}

// Save tradition settings to localStorage
export function saveTraditionSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  // Dispatch event so other components can react
  window.dispatchEvent(new CustomEvent('tradition-changed', { detail: settings }))
}

// Get the active tradition preset (or null if not using full preset)
export function getActiveTraditionPreset() {
  const settings = getTraditionSettings()
  if (settings.applyLevel !== 'full' || !settings.traditionId) {
    return null
  }
  return getTraditionPreset(settings.traditionId)
}

// Check if branding should be applied
export function shouldApplyBranding() {
  const settings = getTraditionSettings()
  return settings.applyLevel === 'branding' || settings.applyLevel === 'full'
}

// Check if full environment should be applied
export function shouldApplyFullEnvironment() {
  const settings = getTraditionSettings()
  return settings.applyLevel === 'full'
}

function TraditionSettings() {
  const [settings, setSettings] = useState(getTraditionSettings)
  const [showTraditionList, setShowTraditionList] = useState(false)
  const [showSubgroups, setShowSubgroups] = useState(null) // traditionId of expanded subgroups
  const [customTradition, setCustomTradition] = useState(settings.customName || '')

  const selectedTradition = AVAILABLE_TRADITIONS.find(t => t.id === settings.traditionId)
  const selectedSubgroup = settings.subgroupId ? getSubgroup(settings.traditionId, settings.subgroupId) : null
  const hasPreset = selectedSubgroup?.hasPreset || selectedTradition?.hasPreset

  function handleApplyLevelChange(level) {
    const newSettings = {
      ...settings,
      applyLevel: level
    }
    setSettings(newSettings)
    saveTraditionSettings(newSettings)
  }

  function handleSelectTradition(traditionId) {
    // If this tradition has subgroups, show them instead of selecting
    if (hasSubgroups(traditionId)) {
      setShowSubgroups(showSubgroups === traditionId ? null : traditionId)
      return
    }

    // Check if this tradition has a preset
    const tradition = AVAILABLE_TRADITIONS.find(t => t.id === traditionId)
    const traditionHasPreset = tradition?.hasPreset

    const newSettings = {
      ...settings,
      traditionId,
      subgroupId: null,
      // Default to 'full' if has preset, otherwise 'identity'
      applyLevel: settings.applyLevel || (traditionHasPreset ? 'full' : 'identity'),
      customName: traditionId === 'custom' ? customTradition : ''
    }
    setSettings(newSettings)
    saveTraditionSettings(newSettings)
    setShowTraditionList(false)
    setShowSubgroups(null)
  }

  function handleSelectSubgroup(traditionId, subgroupId) {
    // Check if this subgroup has a preset
    const subgroup = getSubgroup(traditionId, subgroupId)
    const subgroupHasPreset = subgroup?.hasPreset

    const newSettings = {
      ...settings,
      traditionId,
      subgroupId,
      // Default to 'full' if has preset, otherwise 'identity'
      applyLevel: settings.applyLevel || (subgroupHasPreset ? 'full' : 'identity'),
      customName: ''
    }
    setSettings(newSettings)
    saveTraditionSettings(newSettings)
    setShowTraditionList(false)
    setShowSubgroups(null)
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
      applyLevel: null,
      traditionId: null,
      subgroupId: null,
      customName: ''
    }
    setSettings(newSettings)
    saveTraditionSettings(newSettings)
    setCustomTradition('')
    setShowSubgroups(null)
  }

  return (
    <div className="tradition-settings">
      {/* Current Selection Display */}
      {settings.traditionId ? (
        <div className="tradition-current">
          <div className="tradition-current-info">
            <span className="tradition-icon">{selectedSubgroup?.icon || selectedTradition?.icon || '✨'}</span>
            <div className="tradition-details">
              <span className="tradition-name">
                {settings.traditionId === 'custom' && settings.customName
                  ? settings.customName
                  : selectedSubgroup
                    ? `${selectedTradition?.name}: ${selectedSubgroup.name}`
                    : selectedTradition?.name || 'Unknown'}
              </span>
              <span className="tradition-status">
                {settings.applyLevel ? APPLY_LEVELS[settings.applyLevel]?.label : 'Not applied'}
              </span>
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

      {/* Apply Level Selector - shows when tradition is selected */}
      {settings.traditionId && (
        <div className="apply-level-section">
          <label className="apply-level-label">How should this tradition affect your app?</label>
          <div className="apply-level-options">
            {Object.values(APPLY_LEVELS).map(level => (
              <button
                key={level.id}
                className={`apply-level-option ${settings.applyLevel === level.id ? 'apply-level-option--selected' : ''} ${level.id === 'full' && !hasPreset ? 'apply-level-option--coming-soon' : ''}`}
                onClick={() => handleApplyLevelChange(level.id)}
              >
                <span className="apply-level-option-label">
                  {level.id === 'full' && !hasPreset ? 'Coming Soon' : level.shortLabel}
                </span>
              </button>
            ))}
          </div>
          <p className="apply-level-description">
            {settings.applyLevel === 'full' && !hasPreset ? (
              'Full environment will include: tradition-specific calendars, curated daily practices, custom journal prompts, themed library content, and tailored resources'
            ) : settings.applyLevel ? (
              APPLY_LEVELS[settings.applyLevel]?.description
            ) : (
              'Select how your tradition should be applied'
            )}
          </p>
        </div>
      )}

      {/* Tradition Guide Link (if preset available) */}
      {settings.applyLevel && hasPreset && (
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
              <div key={tradition.id} className="tradition-option-wrapper">
                <button
                  className={`tradition-option ${settings.traditionId === tradition.id && !settings.subgroupId ? 'tradition-option--selected' : ''} ${tradition.hasPreset ? 'tradition-option--has-preset' : ''} ${hasSubgroups(tradition.id) ? 'tradition-option--has-subgroups' : ''} ${showSubgroups === tradition.id ? 'tradition-option--expanded' : ''}`}
                  onClick={() => handleSelectTradition(tradition.id)}
                  style={{ '--tradition-color': tradition.color }}
                >
                  <span className="tradition-option-icon">{tradition.icon}</span>
                  <span className="tradition-option-name">{tradition.name}</span>
                  {tradition.hasPreset && (
                    <span className="tradition-option-badge">Full Preset</span>
                  )}
                  {hasSubgroups(tradition.id) && (
                    <span className="tradition-option-expand">{showSubgroups === tradition.id ? '▼' : '▶'}</span>
                  )}
                </button>

                {/* Subgroups */}
                {showSubgroups === tradition.id && (
                  <div className="tradition-subgroups">
                    {getSubgroups(tradition.id).map(subgroup => (
                      <button
                        key={subgroup.id}
                        className={`tradition-subgroup ${settings.traditionId === tradition.id && settings.subgroupId === subgroup.id ? 'tradition-subgroup--selected' : ''} ${subgroup.hasPreset ? 'tradition-subgroup--has-preset' : ''}`}
                        onClick={() => handleSelectSubgroup(tradition.id, subgroup.id)}
                        style={{ '--tradition-color': subgroup.color }}
                      >
                        <span className="tradition-subgroup-icon">{subgroup.icon}</span>
                        <span className="tradition-subgroup-name">{subgroup.name}</span>
                        {subgroup.hasPreset && (
                          <span className="tradition-subgroup-badge">Preset</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

      {/* Info about what levels do */}
      <div className="tradition-info">
        <p>
          <strong>Apply Levels Explained</strong>
        </p>
        <ul>
          <li><strong>Identity Only:</strong> Simply identifies your path - no app changes</li>
          <li><strong>Labels & Branding:</strong> Updates terminology throughout the app to match your tradition</li>
          <li><strong>Full Environment:</strong> Updates calendars, daily practices, journal prompts, library, and resources (requires a preset)</li>
        </ul>
        <p className="tradition-info-note">
          You can always access all features regardless of settings
        </p>
      </div>
    </div>
  )
}

export default TraditionSettings
