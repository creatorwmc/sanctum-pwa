// Druid-specific practices for the Daily Log
// These replace/augment the default practices when Druid tradition is active

export const DRUID_PRACTICES = [
  {
    id: 'sphere-protection',
    label: 'Sphere of Protection',
    icon: '🔮',
    description: 'Daily opening/closing ritual invoking the four directions',
    examples: [
      'Morning Sphere of Protection',
      'Evening closing with gratitude',
      'Abbreviated daily protection'
    ]
  },
  {
    id: 'discursive-meditation',
    label: 'Discursive Meditation',
    icon: '🧘',
    description: 'JMG method: settle, read, reflect, record',
    examples: [
      'Meditation on the Three Rays',
      'Contemplation of Awen',
      'Reflection on nature\'s cycles'
    ]
  },
  {
    id: 'nature-observation',
    label: 'Nature Observation',
    icon: '🌿',
    description: 'Mindful observation of the natural world',
    examples: [
      'Tree sitting meditation',
      'Wildlife observation',
      'Weather and sky watching'
    ]
  },
  {
    id: 'elemental-work',
    label: 'Elemental Work',
    icon: '🜁',
    description: 'Working with Earth, Air, Fire, or Water',
    examples: [
      'Earth: grounding, stones, gardening',
      'Air: breathwork, incense, study',
      'Fire: candle meditation, willpower',
      'Water: bath rituals, emotional flow'
    ]
  },
  {
    id: 'sacred-reading',
    label: 'Sacred Reading',
    icon: '📖',
    description: 'Study of Druid texts and Celtic mythology',
    examples: [
      'JMG Druidry Handbook',
      'Celtic mythology',
      'Bardic poetry'
    ]
  },
  {
    id: 'grove-journal',
    label: 'Grove Journal',
    icon: '✎',
    description: 'Documenting insights, dreams, and reflections',
    examples: [
      'Daily observations',
      'Dream recording',
      'Meditation insights'
    ]
  },
  {
    id: 'ogham-work',
    label: 'Ogham Work',
    icon: '᚛',
    description: 'Tree alphabet study and divination',
    examples: [
      'Daily Ogham draw',
      'Tree month meditation',
      'Ogham letter study'
    ]
  },
  {
    id: 'grove-keeping',
    label: 'Grove Keeping',
    icon: '🌲',
    description: 'Tending sacred outdoor spaces',
    examples: [
      'Outdoor altar tending',
      'Tree communion',
      'Land healing work'
    ]
  },
  {
    id: 'ancestor-work',
    label: 'Ancestor Work',
    icon: '🕯',
    description: 'Honoring and connecting with ancestors',
    examples: [
      'Ancestor altar maintenance',
      'Ancestor meditation',
      'Genealogy research'
    ]
  },
  {
    id: 'bardic-arts',
    label: 'Bardic Arts',
    icon: '🎵',
    description: 'Poetry, music, and storytelling',
    examples: [
      'Poetry composition',
      'Celtic music',
      'Myth retelling'
    ]
  },
  {
    id: 'awen-chanting',
    label: 'Awen Chanting',
    icon: '/|\\',
    description: 'Invocation of divine inspiration',
    examples: [
      'Three-fold Awen chant',
      'Awen breathing meditation',
      'Pre-ritual invocation'
    ]
  },
  {
    id: 'seasonal-ceremony',
    label: 'Seasonal Ceremony',
    icon: '☀',
    description: 'Holy day and seasonal observances',
    examples: [
      'Solstice/Equinox ritual',
      'Fire festival celebration',
      'Moon ceremony'
    ]
  }
]

// Mapping from default practices to Druid equivalents
export const PRACTICE_MAPPING = {
  'bath': 'elemental-work',        // Ritual Bath -> Elemental Work (Water)
  'meditation': 'discursive-meditation',
  'vessel': 'grove-keeping',       // Vessel Work -> Grove Keeping (body as grove)
  'breathwork': 'elemental-work',  // Breathwork -> Elemental Work (Air)
  'study': 'sacred-reading',
  'journaling': 'grove-journal',
  'union': 'ancestor-work',        // Sacred Union -> Ancestor Work (different focus)
  'tending': 'grove-keeping',
  'tarot': 'ogham-work',
  'ceremony': 'seasonal-ceremony'
}

// Get the Druid equivalent label for a default practice
export function getDruidLabel(defaultPracticeId) {
  const druidId = PRACTICE_MAPPING[defaultPracticeId]
  if (druidId) {
    const druidPractice = DRUID_PRACTICES.find(p => p.id === druidId)
    return druidPractice?.label || null
  }
  return null
}

export default DRUID_PRACTICES
