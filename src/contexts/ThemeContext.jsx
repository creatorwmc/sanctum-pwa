import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

// Available background themes
export const BACKGROUND_THEMES = {
  dark: {
    id: 'dark',
    name: 'Dark Forest',
    preview: '#0d1210',
    css: {
      '--theme-bg-primary': '#0d1210',
      '--theme-bg-secondary': '#141c18',
      '--theme-bg-card': '#1a241f',
      '--theme-border': '#2d3a32',
      '--theme-border-warm': '#3d3428',
      '--theme-text-primary': '#e8e0d4',
      '--theme-text-secondary': '#b8a992',
      '--theme-text-muted': '#7a6f5f',
      '--theme-accent': '#d4a259',
      '--theme-bg-gradient': 'radial-gradient(ellipse at center, rgba(212, 162, 89, 0.08) 0%, transparent 70%)'
    }
  },
  yellow: {
    id: 'yellow',
    name: 'Golden Sun',
    preview: '#fff8dc',
    css: {
      '--theme-bg-primary': '#fff8dc',
      '--theme-bg-secondary': '#fff5d6',
      '--theme-bg-card': '#fff9e6',
      '--theme-border': '#e6d9a8',
      '--theme-border-warm': '#d9c878',
      '--theme-text-primary': '#2d2510',
      '--theme-text-secondary': '#5c4a20',
      '--theme-text-muted': '#8a7540',
      '--theme-accent': '#d4850a',
      '--theme-bg-gradient': 'linear-gradient(180deg, #fff8dc 0%, #ffefb8 50%, #ffe680 100%)'
    }
  },
  blue: {
    id: 'blue',
    name: 'Ocean Deep',
    preview: '#0a1628',
    css: {
      '--theme-bg-primary': '#0a1628',
      '--theme-bg-secondary': '#0f1f36',
      '--theme-bg-card': '#152744',
      '--theme-border': '#1e3a5f',
      '--theme-border-warm': '#2a4a72',
      '--theme-text-primary': '#e0e8f0',
      '--theme-text-secondary': '#a0b8d0',
      '--theme-text-muted': '#607890',
      '--theme-accent': '#4a9eff',
      '--theme-bg-gradient': 'radial-gradient(ellipse at center, rgba(74, 158, 255, 0.1) 0%, transparent 70%)'
    }
  },
  red: {
    id: 'red',
    name: 'Ember Glow',
    preview: '#1a0a0a',
    css: {
      '--theme-bg-primary': '#1a0a0a',
      '--theme-bg-secondary': '#261010',
      '--theme-bg-card': '#321818',
      '--theme-border': '#4a2020',
      '--theme-border-warm': '#5c2828',
      '--theme-text-primary': '#f0e0e0',
      '--theme-text-secondary': '#d0a8a8',
      '--theme-text-muted': '#906060',
      '--theme-accent': '#ff6b6b',
      '--theme-bg-gradient': 'radial-gradient(ellipse at center, rgba(255, 107, 107, 0.1) 0%, transparent 70%)'
    }
  },
  green: {
    id: 'green',
    name: 'Forest Grove',
    preview: '#0a1a0f',
    css: {
      '--theme-bg-primary': '#0a1a0f',
      '--theme-bg-secondary': '#102618',
      '--theme-bg-card': '#183220',
      '--theme-border': '#204a2d',
      '--theme-border-warm': '#2d5c3a',
      '--theme-text-primary': '#e0f0e5',
      '--theme-text-secondary': '#a8d0b0',
      '--theme-text-muted': '#609070',
      '--theme-accent': '#5cb85c',
      '--theme-bg-gradient': 'radial-gradient(ellipse at center, rgba(92, 184, 92, 0.1) 0%, transparent 70%)'
    }
  },
  orange: {
    id: 'orange',
    name: 'Sunset Fire',
    preview: '#1a0f08',
    css: {
      '--theme-bg-primary': '#1a0f08',
      '--theme-bg-secondary': '#26180e',
      '--theme-bg-card': '#322014',
      '--theme-border': '#4a3018',
      '--theme-border-warm': '#5c3c20',
      '--theme-text-primary': '#f0e8e0',
      '--theme-text-secondary': '#d0b898',
      '--theme-text-muted': '#907050',
      '--theme-accent': '#ff8c42',
      '--theme-bg-gradient': 'radial-gradient(ellipse at center, rgba(255, 140, 66, 0.1) 0%, transparent 70%)'
    }
  },
  purple: {
    id: 'purple',
    name: 'Mystic Violet',
    preview: '#120a1a',
    css: {
      '--theme-bg-primary': '#120a1a',
      '--theme-bg-secondary': '#1a1026',
      '--theme-bg-card': '#221832',
      '--theme-border': '#32204a',
      '--theme-border-warm': '#42285c',
      '--theme-text-primary': '#f0e0f8',
      '--theme-text-secondary': '#c8a8e0',
      '--theme-text-muted': '#8060a0',
      '--theme-accent': '#a855f7',
      '--theme-bg-gradient': 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)'
    }
  },
  lightBlue: {
    id: 'lightBlue',
    name: 'Sky Blue',
    preview: '#e6f3ff',
    css: {
      '--theme-bg-primary': '#e6f3ff',
      '--theme-bg-secondary': '#d6ebff',
      '--theme-bg-card': '#f0f8ff',
      '--theme-border': '#a8d0f0',
      '--theme-border-warm': '#80b8e0',
      '--theme-text-primary': '#102030',
      '--theme-text-secondary': '#305080',
      '--theme-text-muted': '#5080b0',
      '--theme-accent': '#0066cc',
      '--theme-bg-gradient': 'linear-gradient(180deg, #e6f3ff 0%, #cce6ff 50%, #b3d9ff 100%)'
    }
  },
  lightGreen: {
    id: 'lightGreen',
    name: 'Sage Meadow',
    preview: '#e8f5e8',
    css: {
      '--theme-bg-primary': '#e8f5e8',
      '--theme-bg-secondary': '#d8efd8',
      '--theme-bg-card': '#f0faf0',
      '--theme-border': '#a8d8a8',
      '--theme-border-warm': '#80c080',
      '--theme-text-primary': '#102010',
      '--theme-text-secondary': '#305030',
      '--theme-text-muted': '#508050',
      '--theme-accent': '#2e8b2e',
      '--theme-bg-gradient': 'linear-gradient(180deg, #e8f5e8 0%, #d0f0d0 50%, #b8e8b8 100%)'
    }
  },
  lightPurple: {
    id: 'lightPurple',
    name: 'Lavender Dreams',
    preview: '#f3e8ff',
    css: {
      '--theme-bg-primary': '#f3e8ff',
      '--theme-bg-secondary': '#ead6ff',
      '--theme-bg-card': '#f8f0ff',
      '--theme-border': '#d0a8f0',
      '--theme-border-warm': '#b880e0',
      '--theme-text-primary': '#201030',
      '--theme-text-secondary': '#503080',
      '--theme-text-muted': '#8050b0',
      '--theme-accent': '#8b2ecc',
      '--theme-bg-gradient': 'linear-gradient(180deg, #f3e8ff 0%, #e6d6ff 50%, #d9c4ff 100%)'
    }
  }
}

// Page IDs for per-page theming
export const PAGES = [
  { id: 'global', name: 'All Pages (Default)' },
  { id: 'home', name: 'Home' },
  { id: 'timer', name: 'Timer' },
  { id: 'daily', name: 'Daily' },
  { id: 'journal', name: 'Journal' },
  { id: 'library', name: 'Library' },
  { id: 'resources', name: 'Resources' },
  { id: 'links', name: 'Links' },
  { id: 'calendar', name: 'Calendar' },
  { id: 'settings', name: 'Settings' },
  { id: 'tools', name: 'Esoteric Tools' },
  { id: 'play', name: 'Play' }
]

const STORAGE_KEY = 'sanctum-theme-settings'

export function ThemeProvider({ children }) {
  const [themeSettings, setThemeSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Error loading theme settings:', e)
    }
    // Default: dark theme globally
    return {
      global: 'dark'
    }
  })

  // Save to localStorage when settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themeSettings))
  }, [themeSettings])

  function getThemeForPage(pageId) {
    // Check if page has specific theme, otherwise use global
    if (themeSettings[pageId]) {
      return themeSettings[pageId]
    }
    return themeSettings.global || 'dark'
  }

  function setThemeForPage(pageId, themeId) {
    setThemeSettings(prev => ({
      ...prev,
      [pageId]: themeId
    }))
  }

  function clearPageTheme(pageId) {
    if (pageId === 'global') return // Can't clear global
    setThemeSettings(prev => {
      const next = { ...prev }
      delete next[pageId]
      return next
    })
  }

  function applyTheme(themeId) {
    const theme = BACKGROUND_THEMES[themeId]
    if (!theme) return

    const root = document.documentElement
    Object.entries(theme.css).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }

  return (
    <ThemeContext.Provider value={{
      themeSettings,
      getThemeForPage,
      setThemeForPage,
      clearPageTheme,
      applyTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
