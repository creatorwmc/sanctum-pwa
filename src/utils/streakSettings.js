// Streak Settings Utility
// Manages user preferences for streak tracking display

const STORAGE_KEY = 'sanctum-streak-settings'

/**
 * Get streak settings from localStorage
 * @returns {{ enabled: boolean | null, askedAt: string | null }}
 *   - enabled: true = show streaks, false = hide streaks, null = not yet decided
 *   - askedAt: ISO timestamp of when user was asked
 */
export function getStreakSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading streak settings:', e)
  }
  return { enabled: null, askedAt: null }
}

/**
 * Save streak settings to localStorage
 * @param {{ enabled: boolean | null }} settings
 */
export function saveStreakSettings(settings) {
  const data = {
    ...settings,
    updatedAt: new Date().toISOString()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

  // Dispatch event so other components can react
  window.dispatchEvent(new CustomEvent('streak-settings-changed', { detail: data }))
}

/**
 * Check if streaks are enabled
 * @returns {boolean} true if enabled, false if disabled or not yet decided (default hidden)
 */
export function isStreakEnabled() {
  const settings = getStreakSettings()
  return settings.enabled === true
}

/**
 * Check if user has been asked about streak preference
 * @returns {boolean}
 */
export function hasBeenAskedAboutStreaks() {
  const settings = getStreakSettings()
  return settings.enabled !== null
}

/**
 * Mark that user has been asked (deferred decision)
 */
export function markAskedLater() {
  const current = getStreakSettings()
  saveStreakSettings({
    ...current,
    askedAt: new Date().toISOString()
  })
}
