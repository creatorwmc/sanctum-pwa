// Default practices that ship with the app
// Users can add, edit, or remove these

export const DEFAULT_PRACTICES = [
  {
    id: 'bath',
    label: 'Ritual Bath',
    icon: '💧',
    description: 'Alchemical work, color therapy, integration',
    examples: ['Salt bath with intention setting', 'Color therapy soak', 'Cold plunge'],
    isDefault: true,
    order: 0
  },
  {
    id: 'meditation',
    label: 'Meditation',
    icon: '🧘',
    description: 'Sitting, walking, visualization work',
    examples: ['Silent sitting (10-30 min)', 'Guided visualization', 'Walking meditation'],
    isDefault: true,
    order: 1
  },
  {
    id: 'vessel',
    label: 'Vessel Work',
    icon: '⚱',
    description: 'Physical practices that fortify the body',
    examples: ['Five Tibetan Rites', 'Yoga or stretching', 'Qigong or tai chi'],
    isDefault: true,
    order: 2
  },
  {
    id: 'breathwork',
    label: 'Breathwork',
    icon: '🌬',
    description: 'Pranayama, conscious breathing',
    examples: ['Box breathing', 'Wim Hof rounds', 'Alternate nostril breathing'],
    isDefault: true,
    order: 3
  },
  {
    id: 'study',
    label: 'Study/Reading',
    icon: '📖',
    description: 'Library work, spiritual texts, philosophy',
    examples: ['Sacred texts', 'Esoteric traditions', 'Spiritual teachings'],
    isDefault: true,
    order: 4
  },
  {
    id: 'journaling',
    label: 'Integration Journaling',
    icon: '✎',
    description: 'Documenting insights, stumbles, breakthroughs',
    examples: ['Morning pages', 'Dream journaling', 'Reflecting on synchronicities'],
    isDefault: true,
    order: 5
  },
  {
    id: 'union',
    label: 'Sacred Union',
    icon: 'shatkona',
    description: 'Care for relationship, from gestures to intimacy',
    examples: ['Quality time', 'Acts of service', 'Tantric practices'],
    isDefault: true,
    order: 6
  },
  {
    id: 'tending',
    label: 'Tending',
    icon: '🌱',
    description: 'Embodied service to others',
    examples: ['Gardening', 'Preparing food', 'Caring for animals'],
    isDefault: true,
    order: 7
  },
  {
    id: 'tarot',
    label: 'Tarot/Divination',
    icon: '🎴',
    description: 'Guidance, symbol work',
    examples: ['Daily card pull', 'Three-card spread', 'I Ching consultation'],
    isDefault: true,
    order: 8
  },
  {
    id: 'ceremony',
    label: 'Ceremonial Work',
    icon: '🕯',
    description: 'Rituals, moon ceremonies, magical operations',
    examples: ['Moon ritual', 'Candle magic', 'Altar work'],
    isDefault: true,
    order: 9
  }
]
