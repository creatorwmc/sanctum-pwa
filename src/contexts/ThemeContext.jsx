import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

// Color definitions for generating themes
const COLORS = {
  gray: { name: 'Gray', hue: 0, sat: 0 },
  red: { name: 'Red', hue: 0, sat: 70 },
  orange: { name: 'Orange', hue: 25, sat: 75 },
  yellow: { name: 'Yellow', hue: 45, sat: 80 },
  green: { name: 'Green', hue: 140, sat: 50 },
  blue: { name: 'Blue', hue: 215, sat: 70 },
  purple: { name: 'Purple', hue: 270, sat: 60 }
}

// Generate theme CSS for a color at a brightness level
function generateTheme(colorKey, brightness) {
  const color = COLORS[colorKey]
  const { hue, sat } = color

  if (brightness === 'dark') {
    // Dark themes - deep, rich backgrounds
    const bgLightness = colorKey === 'gray' ? 8 : 6
    return {
      '--theme-bg-primary': `hsl(${hue}, ${sat * 0.3}%, ${bgLightness}%)`,
      '--theme-bg-secondary': `hsl(${hue}, ${sat * 0.35}%, ${bgLightness + 4}%)`,
      '--theme-bg-card': `hsl(${hue}, ${sat * 0.4}%, ${bgLightness + 8}%)`,
      '--theme-border': `hsl(${hue}, ${sat * 0.4}%, ${bgLightness + 15}%)`,
      '--theme-border-warm': `hsl(${hue}, ${sat * 0.5}%, ${bgLightness + 20}%)`,
      '--theme-text-primary': `hsl(${hue}, ${sat * 0.15}%, 90%)`,
      '--theme-text-secondary': `hsl(${hue}, ${sat * 0.25}%, 72%)`,
      '--theme-text-muted': `hsl(${hue}, ${sat * 0.2}%, 50%)`,
      '--theme-accent': `hsl(${hue}, ${sat}%, 60%)`,
      '--theme-bg-gradient': `radial-gradient(ellipse at center, hsla(${hue}, ${sat}%, 50%, 0.08) 0%, transparent 70%)`
    }
  } else if (brightness === 'medium') {
    // Medium themes - balanced, comfortable mid-tones
    const bgLightness = colorKey === 'gray' ? 35 : 30
    return {
      '--theme-bg-primary': `hsl(${hue}, ${sat * 0.35}%, ${bgLightness}%)`,
      '--theme-bg-secondary': `hsl(${hue}, ${sat * 0.4}%, ${bgLightness + 5}%)`,
      '--theme-bg-card': `hsl(${hue}, ${sat * 0.45}%, ${bgLightness + 10}%)`,
      '--theme-border': `hsl(${hue}, ${sat * 0.4}%, ${bgLightness + 18}%)`,
      '--theme-border-warm': `hsl(${hue}, ${sat * 0.5}%, ${bgLightness + 22}%)`,
      '--theme-text-primary': `hsl(${hue}, ${sat * 0.1}%, 95%)`,
      '--theme-text-secondary': `hsl(${hue}, ${sat * 0.2}%, 80%)`,
      '--theme-text-muted': `hsl(${hue}, ${sat * 0.25}%, 65%)`,
      '--theme-accent': `hsl(${hue}, ${sat}%, 70%)`,
      '--theme-bg-gradient': `radial-gradient(ellipse at center, hsla(${hue}, ${sat}%, 60%, 0.1) 0%, transparent 70%)`
    }
  } else {
    // Light themes - bright, airy backgrounds
    const bgLightness = colorKey === 'gray' ? 94 : 95
    const satMult = colorKey === 'yellow' ? 0.6 : 0.5 // Yellow needs less saturation in light mode
    return {
      '--theme-bg-primary': `hsl(${hue}, ${sat * satMult}%, ${bgLightness}%)`,
      '--theme-bg-secondary': `hsl(${hue}, ${sat * satMult * 1.1}%, ${bgLightness - 3}%)`,
      '--theme-bg-card': `hsl(${hue}, ${sat * satMult * 0.8}%, ${bgLightness + 2}%)`,
      '--theme-border': `hsl(${hue}, ${sat * satMult}%, ${bgLightness - 15}%)`,
      '--theme-border-warm': `hsl(${hue}, ${sat * satMult * 1.2}%, ${bgLightness - 20}%)`,
      '--theme-text-primary': `hsl(${hue}, ${sat * 0.4}%, 15%)`,
      '--theme-text-secondary': `hsl(${hue}, ${sat * 0.35}%, 35%)`,
      '--theme-text-muted': `hsl(${hue}, ${sat * 0.3}%, 50%)`,
      '--theme-accent': `hsl(${hue}, ${sat}%, 45%)`,
      '--theme-bg-gradient': `linear-gradient(180deg, hsl(${hue}, ${sat * satMult}%, ${bgLightness}%) 0%, hsl(${hue}, ${sat * satMult * 1.2}%, ${bgLightness - 8}%) 100%)`
    }
  }
}

// Generate preview color for theme selector
function getPreviewColor(colorKey, brightness) {
  const color = COLORS[colorKey]
  const { hue, sat } = color

  if (brightness === 'dark') {
    return `hsl(${hue}, ${sat * 0.3}%, 8%)`
  } else if (brightness === 'medium') {
    return `hsl(${hue}, ${sat * 0.35}%, 32%)`
  } else {
    return `hsl(${hue}, ${sat * 0.5}%, 92%)`
  }
}

// Build all themes
export const BACKGROUND_THEMES = {}
export const THEME_GROUPS = {
  dark: { name: 'Dark', themes: [] },
  medium: { name: 'Medium', themes: [] },
  light: { name: 'Light', themes: [] }
}

const BRIGHTNESS_NAMES = {
  dark: 'Dark',
  medium: 'Medium',
  light: 'Light'
}

Object.entries(COLORS).forEach(([colorKey, colorDef]) => {
  ['dark', 'medium', 'light'].forEach(brightness => {
    const id = `${brightness}-${colorKey}`
    const name = `${BRIGHTNESS_NAMES[brightness]} ${colorDef.name}`

    BACKGROUND_THEMES[id] = {
      id,
      name,
      colorKey,
      brightness,
      preview: getPreviewColor(colorKey, brightness),
      css: generateTheme(colorKey, brightness)
    }

    THEME_GROUPS[brightness].themes.push(id)
  })
})

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
        const parsed = JSON.parse(saved)
        // Migrate old theme IDs to new format
        const migrated = {}
        Object.entries(parsed).forEach(([page, themeId]) => {
          if (BACKGROUND_THEMES[themeId]) {
            migrated[page] = themeId
          } else {
            // Map old theme IDs to new ones
            const migrations = {
              'dark': 'dark-green',
              'blue': 'dark-blue',
              'red': 'dark-red',
              'green': 'dark-green',
              'orange': 'dark-orange',
              'purple': 'dark-purple',
              'yellow': 'light-yellow',
              'lightBlue': 'light-blue',
              'lightGreen': 'light-green',
              'lightPurple': 'light-purple'
            }
            migrated[page] = migrations[themeId] || 'dark-gray'
          }
        })
        return migrated
      }
    } catch (e) {
      console.error('Error loading theme settings:', e)
    }
    // Default: dark gray theme globally
    return {
      global: 'dark-gray'
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
    return themeSettings.global || 'dark-gray'
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
