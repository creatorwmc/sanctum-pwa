// Traditions Index
// Central registry for all spiritual tradition presets

import { DRUID_PRESET } from './druid'

// Registry of all available tradition presets
export const TRADITION_PRESETS = {
  druid: DRUID_PRESET,
  // Future traditions will be added here:
  // buddhist: BUDDHIST_PRESET,
  // christian: CHRISTIAN_PRESET,
  // jewish: JEWISH_PRESET,
  // wiccan: WICCAN_PRESET,
  // etc.
}

// List of all available traditions for selection
export const AVAILABLE_TRADITIONS = [
  {
    id: 'druid',
    name: 'Druidry',
    description: 'Traditional Druidry based on John Michael Greer\'s teachings',
    icon: '🌳',
    color: '#228b22',
    hasPreset: true
  },
  {
    id: 'wiccan',
    name: 'Wicca / Paganism',
    description: 'Modern Wiccan and Neopagan traditions',
    icon: '⛤',
    color: '#7b68ee',
    hasPreset: false
  },
  {
    id: 'buddhist',
    name: 'Buddhism',
    description: 'Buddhist meditation and mindfulness traditions',
    icon: '☸',
    color: '#ff9500',
    hasPreset: false
  },
  {
    id: 'christian',
    name: 'Christianity',
    description: 'Christian contemplative and mystical traditions',
    icon: '✝',
    color: '#c9a227',
    hasPreset: false
  },
  {
    id: 'jewish',
    name: 'Judaism',
    description: 'Jewish spiritual practice and Kabbalah',
    icon: '✡',
    color: '#4a90d9',
    hasPreset: false
  },
  {
    id: 'hindu',
    name: 'Hinduism',
    description: 'Hindu spiritual practices and yoga traditions',
    icon: '🕉',
    color: '#ff6b35',
    hasPreset: false
  },
  {
    id: 'islamic',
    name: 'Islam',
    description: 'Islamic spiritual practice and Sufism',
    icon: '☪',
    color: '#2d8b5a',
    hasPreset: false
  },
  {
    id: 'taoist',
    name: 'Taoism',
    description: 'Taoist philosophy and practices',
    icon: '☯',
    color: '#5c6bc0',
    hasPreset: false
  },
  {
    id: 'bota',
    name: 'BOTA / Western Mystery',
    description: 'Builders of the Adytum and Western esoteric traditions',
    icon: '🔺',
    color: '#9c27b0',
    hasPreset: false
  },
  {
    id: 'kabbalah',
    name: 'Kabbalah',
    description: 'Jewish mysticism and Tree of Life work',
    icon: '🌲',
    color: '#3f51b5',
    hasPreset: false
  },
  {
    id: 'alchemy',
    name: 'Alchemy',
    description: 'Hermetic and alchemical traditions',
    icon: '⚗',
    color: '#ffc107',
    hasPreset: false
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    description: 'Secular philosophical and Stoic practices',
    icon: '📚',
    color: '#607d8b',
    hasPreset: false
  },
  {
    id: 'jedi',
    name: 'Jediism',
    description: 'Jedi-inspired spiritual practice',
    icon: '⚔',
    color: '#00bcd4',
    hasPreset: false
  },
  {
    id: 'shinto',
    name: 'Shinto',
    description: 'Japanese indigenous spiritual tradition',
    icon: '⛩',
    color: '#e91e63',
    hasPreset: false
  },
  {
    id: 'indigenous',
    name: 'Indigenous / Earth-Based',
    description: 'Various indigenous and earth-based traditions',
    icon: '🌍',
    color: '#8d6e63',
    hasPreset: false
  },
  {
    id: 'unsure',
    name: 'Exploring / Unsure',
    description: 'Still exploring or combining multiple traditions',
    icon: '🔍',
    color: '#9e9e9e',
    hasPreset: false
  },
  {
    id: 'none',
    name: 'Secular / None',
    description: 'Non-religious or secular spiritual practice',
    icon: '🌟',
    color: '#757575',
    hasPreset: false
  },
  {
    id: 'custom',
    name: 'Custom / Other',
    description: 'Define your own tradition',
    icon: '✨',
    color: '#795548',
    hasPreset: false
  }
]

// Get a tradition preset by ID
export function getTraditionPreset(traditionId) {
  return TRADITION_PRESETS[traditionId] || null
}

// Get tradition info by ID
export function getTraditionInfo(traditionId) {
  return AVAILABLE_TRADITIONS.find(t => t.id === traditionId) || null
}

// Get practices for a tradition (returns default if no preset exists)
export function getTraditionPractices(traditionId) {
  const preset = TRADITION_PRESETS[traditionId]
  if (preset?.practices) {
    return preset.practices
  }
  // Return default practices if no preset
  return null
}

// Get enabled calendars for a tradition
export function getTraditionCalendars(traditionId) {
  const preset = TRADITION_PRESETS[traditionId]
  if (preset?.enabledCalendars) {
    return preset.enabledCalendars
  }
  // Default calendars
  return ['moon']
}

// Get journaling prompts for a tradition
export function getTraditionJournalingPrompts(traditionId, frequency = 'daily') {
  const preset = TRADITION_PRESETS[traditionId]
  if (preset?.journalingPrompts?.[frequency]) {
    return preset.journalingPrompts[frequency]
  }
  // Default prompts
  return [
    'What did I practice today?',
    'What insights arose?',
    'What am I grateful for?'
  ]
}

// Get terminology mapping for a tradition
export function getTraditionTerminology(traditionId) {
  const preset = TRADITION_PRESETS[traditionId]
  return preset?.correspondences || {}
}

// Translate a term using tradition-specific terminology
export function translateTerm(term, traditionId) {
  const correspondences = getTraditionTerminology(traditionId)
  return correspondences[term] || term
}

// Get all correspondences (for "show other traditions" feature)
export function getAllCorrespondences(term) {
  const result = []
  for (const [tradId, preset] of Object.entries(TRADITION_PRESETS)) {
    if (preset.correspondences?.[term]) {
      result.push({
        tradition: preset.name,
        term: preset.correspondences[term],
        icon: preset.icon
      })
    }
  }
  return result
}

export default TRADITION_PRESETS
