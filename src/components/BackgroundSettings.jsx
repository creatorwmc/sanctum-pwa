import { useState } from 'react'
import { useTheme, BACKGROUND_THEMES, PAGES } from '../contexts/ThemeContext'
import './BackgroundSettings.css'

function BackgroundSettings() {
  const { themeSettings, setThemeForPage, clearPageTheme } = useTheme()
  const [selectedPage, setSelectedPage] = useState('global')

  const currentTheme = themeSettings[selectedPage] || (selectedPage === 'global' ? 'dark' : null)
  const isUsingGlobal = selectedPage !== 'global' && !themeSettings[selectedPage]

  function handleThemeSelect(themeId) {
    setThemeForPage(selectedPage, themeId)
  }

  function handleUseGlobal() {
    clearPageTheme(selectedPage)
  }

  return (
    <div className="background-settings">
      <div className="page-selector">
        <label className="page-selector-label">Customize background for:</label>
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="input page-select"
        >
          {PAGES.map(page => (
            <option key={page.id} value={page.id}>
              {page.name}
              {page.id !== 'global' && themeSettings[page.id] && ' *'}
            </option>
          ))}
        </select>
      </div>

      {selectedPage !== 'global' && (
        <div className="global-toggle">
          <label className="global-toggle-label">
            <input
              type="checkbox"
              checked={isUsingGlobal}
              onChange={(e) => {
                if (e.target.checked) {
                  handleUseGlobal()
                } else {
                  // Set to current global theme
                  setThemeForPage(selectedPage, themeSettings.global || 'dark')
                }
              }}
            />
            <span>Use global theme for this page</span>
          </label>
        </div>
      )}

      <div className={`theme-grid ${isUsingGlobal && selectedPage !== 'global' ? 'theme-grid--disabled' : ''}`}>
        {Object.values(BACKGROUND_THEMES).map(theme => (
          <button
            key={theme.id}
            className={`theme-option ${currentTheme === theme.id ? 'theme-option--active' : ''}`}
            onClick={() => handleThemeSelect(theme.id)}
            disabled={isUsingGlobal && selectedPage !== 'global'}
          >
            <div
              className="theme-preview"
              style={{ background: theme.preview }}
            />
            <span className="theme-name">{theme.name}</span>
            {currentTheme === theme.id && <span className="theme-check">✓</span>}
          </button>
        ))}
      </div>

      {Object.keys(themeSettings).filter(k => k !== 'global').length > 0 && (
        <div className="custom-pages-note">
          <span className="note-icon">*</span>
          <span>Pages with custom backgrounds: {
            Object.keys(themeSettings)
              .filter(k => k !== 'global')
              .map(k => PAGES.find(p => p.id === k)?.name || k)
              .join(', ')
          }</span>
        </div>
      )}
    </div>
  )
}

export default BackgroundSettings
