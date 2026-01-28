// Druid Tradition Preset
// Based on John Michael Greer's Work & Traditional Druidry

export const DRUID_PRESET = {
  id: 'druid',
  name: 'Druidry',
  description: 'Traditional Druidry based on John Michael Greer\'s teachings',
  icon: '🌳',
  color: '#228b22',

  // ============ PRACTICES ============
  practices: [
    {
      id: 'sphere-protection',
      label: 'Sphere of Protection',
      icon: '🔮',
      description: 'Daily opening/closing ritual invoking the four directions and sacred center',
      examples: [
        'Morning Sphere of Protection (full ritual)',
        'Evening closing with gratitude',
        'Abbreviated daily protection'
      ],
      category: 'ritual',
      frequency: 'daily',
      duration: '10-15 min'
    },
    {
      id: 'discursive-meditation',
      label: 'Discursive Meditation',
      icon: '🧘',
      description: 'JMG method: settle, read, reflect, record - letting thoughts flow naturally',
      examples: [
        'Meditation on the Three Rays',
        'Contemplation of Awen',
        'Reflection on nature\'s cycles'
      ],
      category: 'meditation',
      frequency: 'daily',
      duration: '15-20 min'
    },
    {
      id: 'elemental-work',
      label: 'Elemental Work',
      icon: '🜁',
      description: 'Weekly focus rotating through Earth, Air, Fire, and Water',
      examples: [
        'Earth: grounding, stones, gardening',
        'Air: breathwork, incense, study',
        'Fire: candle meditation, willpower',
        'Water: bath rituals, emotional flow'
      ],
      category: 'elemental',
      frequency: 'weekly',
      duration: 'varies'
    },
    {
      id: 'nature-observation',
      label: 'Nature Observation',
      icon: '🌿',
      description: 'Mindful observation of the natural world as spiritual practice',
      examples: [
        'Tree sitting meditation',
        'Wildlife observation',
        'Weather and sky watching',
        'Seasonal changes noting'
      ],
      category: 'nature',
      frequency: 'daily',
      duration: '5-30 min'
    },
    {
      id: 'ogham-study',
      label: 'Ogham Study',
      icon: '᚛',
      description: 'Study of the Ogham tree alphabet and its wisdom',
      examples: [
        'Learning Ogham letters',
        'Tree month meditation',
        'Ogham divination',
        'Tree lore research'
      ],
      category: 'study',
      frequency: 'weekly',
      duration: '15-30 min'
    },
    {
      id: 'sacred-reading',
      label: 'Sacred Reading',
      icon: '📖',
      description: 'Study of Druid texts, Celtic mythology, and JMG works',
      examples: [
        'The Druidry Handbook',
        'Celtic mythology',
        'Nature philosophy',
        'Bardic poetry'
      ],
      category: 'study',
      frequency: 'daily',
      duration: '15-30 min'
    },
    {
      id: 'awen-chanting',
      label: 'Awen Chanting',
      icon: '/|\\',
      description: 'Invocation of divine inspiration through the sacred Awen chant',
      examples: [
        'Three-fold Awen chant',
        'Awen breathing meditation',
        'Pre-ritual Awen invocation'
      ],
      category: 'devotion',
      frequency: 'daily',
      duration: '3-5 min'
    },
    {
      id: 'grove-work',
      label: 'Grove Work',
      icon: '🌲',
      description: 'Practice in sacred outdoor spaces, creating and tending groves',
      examples: [
        'Finding your grove',
        'Outdoor altar tending',
        'Tree communion',
        'Land healing work'
      ],
      category: 'nature',
      frequency: 'weekly',
      duration: '30-60 min'
    },
    {
      id: 'ancestor-work',
      label: 'Ancestor Work',
      icon: '🕯',
      description: 'Honoring and communicating with ancestors',
      examples: [
        'Ancestor altar maintenance',
        'Genealogy research',
        'Ancestor meditation',
        'Offerings to the dead'
      ],
      category: 'devotion',
      frequency: 'weekly',
      duration: '15-30 min'
    },
    {
      id: 'bardic-arts',
      label: 'Bardic Arts',
      icon: '🎵',
      description: 'Creative expression through poetry, music, and storytelling',
      examples: [
        'Poetry composition',
        'Learning Celtic music',
        'Myth retelling',
        'Journaling as bardic practice'
      ],
      category: 'creative',
      frequency: 'weekly',
      duration: 'varies'
    },
    {
      id: 'divination',
      label: 'Divination',
      icon: '🎴',
      description: 'Seeking guidance through Ogham, Tarot, or other methods',
      examples: [
        'Daily Ogham draw',
        'Seasonal divination',
        'Holy day scrying',
        'Dream interpretation'
      ],
      category: 'divination',
      frequency: 'daily',
      duration: '5-15 min'
    },
    {
      id: 'seasonal-ceremony',
      label: 'Seasonal Ceremony',
      icon: '☀',
      description: 'Observance of the eight holy days on the Wheel of the Year',
      examples: [
        'Solstice vigil',
        'Equinox balance ritual',
        'Fire festival celebration',
        'Harvest thanksgiving'
      ],
      category: 'ceremony',
      frequency: 'seasonal',
      duration: '30-120 min'
    }
  ],

  // ============ WHEEL OF THE YEAR - HOLY DAYS ============
  holyDays: {
    solarFestivals: [
      {
        id: 'alban-arthan',
        name: 'Alban Arthan',
        meaning: 'Light of Arthur',
        alternateNames: ['Winter Solstice', 'Midwinter'],
        approximateDate: 'December 21',
        type: 'solar',
        themes: ['Hope in darkness', 'The turning point', 'Inner light', 'Rebirth of the Sun'],
        practices: [
          'Light candles at dawn',
          'Vigil through longest night',
          'Honor the returning light',
          'Holly and ivy rituals'
        ],
        description: 'The winter solstice marks the rebirth of the sun. After the longest night, light begins its return. This is a time of hope and inner illumination.',
        journalPrompts: [
          'What light do I carry through the darkness?',
          'What is being reborn in me?',
          'How can I honor the returning light?'
        ]
      },
      {
        id: 'alban-eilir',
        name: 'Alban Eilir',
        meaning: 'Light of the Earth',
        alternateNames: ['Spring Equinox', 'Ostara'],
        approximateDate: 'March 20',
        type: 'solar',
        themes: ['Balance and renewal', 'New growth', 'Planting seeds', 'Equilibrium'],
        practices: [
          'Plant something (literal or metaphorical)',
          'Clean and clear sacred space',
          'Dawn meditation',
          'Egg rituals',
          'Nature walks'
        ],
        description: 'The spring equinox brings balance between day and night. The earth awakens, and new growth emerges. Time for new beginnings.',
        journalPrompts: [
          'What seeds am I planting?',
          'Where do I need more balance?',
          'What is emerging in my life?'
        ]
      },
      {
        id: 'alban-hefin',
        name: 'Alban Hefin',
        meaning: 'Light of the Shore',
        alternateNames: ['Summer Solstice', 'Midsummer'],
        approximateDate: 'June 21',
        type: 'solar',
        themes: ['Peak of solar power', 'Abundance', 'Full expression', 'Celebration'],
        practices: [
          'All-day outdoor practice',
          'Solar meditation',
          'Gratitude ceremonies',
          'Oak and mistletoe rites',
          'Stone circle gatherings'
        ],
        description: 'The summer solstice is the peak of the sun\'s power. A time of abundance, celebration, and honoring the fullness of life.',
        journalPrompts: [
          'What has come to fullness in my life?',
          'How do I express my full power?',
          'What am I celebrating?'
        ]
      },
      {
        id: 'alban-elfed',
        name: 'Alban Elfed',
        meaning: 'Light of the Water',
        alternateNames: ['Autumn Equinox', 'Mabon'],
        approximateDate: 'September 22',
        type: 'solar',
        themes: ['Harvest and balance', 'Gratitude', 'Reaping what was sown', 'Preparation'],
        practices: [
          'Harvest ritual',
          'Thanksgiving offerings',
          'Preservation work',
          'Balance meditation',
          'Preparing for the dark half'
        ],
        description: 'The autumn equinox brings the second balance point. Time to harvest what we\'ve cultivated and prepare for the coming darkness.',
        journalPrompts: [
          'What am I harvesting?',
          'What am I grateful for?',
          'What needs to be released before winter?'
        ]
      }
    ],
    fireFestivals: [
      {
        id: 'samhain',
        name: 'Samhain',
        meaning: 'Summer\'s End',
        alternateNames: ['Samhuinn', 'Ancestor Night'],
        approximateDate: 'November 1',
        type: 'fire',
        themes: ['Death and endings', 'Honoring the dead', 'The veil thins', 'Divination'],
        practices: [
          'Ancestor altar',
          'Silent supper (dumb supper)',
          'Scrying and divination',
          'Final harvest',
          'Communion with the Otherworld'
        ],
        description: 'The Druidic new year when the veil between worlds is thinnest. A time to honor ancestors and embrace endings.',
        journalPrompts: [
          'Who are my ancestors and what do they teach me?',
          'What is dying or ending in my life?',
          'What messages come from the Otherworld?'
        ]
      },
      {
        id: 'imbolc',
        name: 'Imbolc',
        meaning: 'In the Belly',
        alternateNames: ['Oimelc', 'Brigantia'],
        approximateDate: 'February 1',
        type: 'fire',
        themes: ['First stirrings of spring', 'Purification', 'Inspiration', 'Brigid\'s fire'],
        practices: [
          'Candle lighting for Brigid',
          'Poetry and creativity',
          'Spring cleaning (physical and spiritual)',
          'Hearthfire rituals',
          'Blessing of seeds'
        ],
        description: 'The first stirrings of spring within the belly of the earth. Sacred to Brigid, goddess of healing, poetry, and smithcraft.',
        journalPrompts: [
          'What is stirring within me?',
          'How can I honor Brigid\'s fire?',
          'What needs purification?'
        ]
      },
      {
        id: 'beltane',
        name: 'Beltane',
        meaning: 'Bright Fire',
        alternateNames: ['Beltaine', 'May Day'],
        approximateDate: 'May 1',
        type: 'fire',
        themes: ['Fertility and life force', 'Vitality', 'Passion', 'Joy'],
        practices: [
          'May Day celebration',
          'Flower crowns and garlands',
          'Bonfire rituals',
          'Sacred marriage rites',
          'Dancing and celebration'
        ],
        description: 'The great fire festival celebrating fertility, passion, and the life force. The boundary between summer and winter opens.',
        journalPrompts: [
          'What brings me passion and joy?',
          'How do I honor the life force?',
          'What sacred unions am I cultivating?'
        ]
      },
      {
        id: 'lughnasadh',
        name: 'Lughnasadh',
        meaning: 'Lugh\'s Assembly',
        alternateNames: ['Lammas', 'First Harvest'],
        approximateDate: 'August 1',
        type: 'fire',
        themes: ['First harvest', 'Grain festival', 'Sacrifice', 'Skill mastery'],
        practices: [
          'Bread baking and offering',
          'Games and competitions',
          'First fruits gratitude',
          'Honoring skills and crafts',
          'Athletic activities'
        ],
        description: 'Festival of Lugh the Many-Skilled, celebrating the first harvest. A time for games, competition, and honoring mastery.',
        journalPrompts: [
          'What skills am I mastering?',
          'What first fruits am I harvesting?',
          'What do I offer in sacrifice?'
        ]
      }
    ]
  },

  // ============ RITUALS & CEREMONIES ============
  rituals: {
    sphereOfProtection: {
      name: 'The Sphere of Protection',
      description: 'Daily opening ritual from JMG\'s Druidry',
      timing: 'Morning (opening) and Evening (closing)',
      steps: [
        {
          direction: 'East',
          text: 'I stand in the center of the sphere of light.\nMay the light of the East illuminate my mind.',
          element: 'Air',
          quality: 'Wisdom'
        },
        {
          direction: 'South',
          text: 'May the light of the South warm my heart.',
          element: 'Fire',
          quality: 'Love'
        },
        {
          direction: 'West',
          text: 'May the light of the West cleanse my spirit.',
          element: 'Water',
          quality: 'Purification'
        },
        {
          direction: 'North',
          text: 'May the light of the North strengthen my body.',
          element: 'Earth',
          quality: 'Strength'
        },
        {
          direction: 'Above',
          text: 'May the light above guide my path.',
          quality: 'Divine guidance'
        },
        {
          direction: 'Below',
          text: 'May the light below ground my steps.',
          quality: 'Earthly connection'
        },
        {
          direction: 'Center',
          text: 'I stand in the center of the sphere of light,\nIn the presence of the gods and goddesses,\nIn the presence of the spirits of nature,\nIn the presence of my ancestors.\nMay I walk in balance this day.',
          quality: 'Sacred center'
        }
      ],
      closing: 'Same ritual, but give thanks for the day\'s protection'
    },
    discursiveMeditation: {
      name: 'Discursive Meditation (JMG Method)',
      description: 'The core meditation practice of Revival Druidry',
      duration: '15-20 minutes',
      steps: [
        {
          name: 'Settle',
          duration: '2 minutes',
          instruction: 'Breathing, posture, stillness'
        },
        {
          name: 'Read',
          duration: '1 minute',
          instruction: 'Short passage from spiritual text'
        },
        {
          name: 'Reflect',
          duration: '10-15 minutes',
          instruction: 'Let mind explore the topic:\n- What does it mean?\n- How does it apply to my life?\n- What insights arise?\n(Let thoughts flow naturally)'
        },
        {
          name: 'Record',
          duration: '2 minutes',
          instruction: 'Journal key insights'
        }
      ],
      suggestedTopics: [
        'The Secret of the Temple',
        'Three rays of light (wisdom, love, power)',
        'Awen (divine inspiration)',
        'The relationship between humanity and nature',
        'Cycles and patterns in life',
        'Balance of elements'
      ]
    },
    basicCeremony: {
      name: 'Basic Druid Ceremony Format',
      sections: {
        opening: [
          'Sphere of Protection',
          'Statement of purpose',
          'Invocation of Awen: "Awen, Awen, Awen" (chant 3x)'
        ],
        working: [
          'Seasonal focus (reading, meditation, offering)',
          'Personal intention or request',
          'Divination (optional - Ogham staves, etc.)'
        ],
        closing: [
          'Gratitude to spirits/gods/ancestors',
          'Grounding (place hands on earth)',
          '"The ritual is ended, may peace go with all beings."'
        ]
      }
    },
    holyDayCeremony: {
      name: 'Holy Day Ceremony Structure',
      sections: {
        preparation: [
          'Clean space',
          'Prepare altar (season-appropriate items)',
          'Gather offerings (bread, mead, herbs)'
        ],
        opening: 'As in basic ceremony',
        seasonalWork: [
          'Read about holy day meaning',
          'Reflect on season in your life',
          'Make offerings',
          'Speak intentions or gratitude'
        ],
        divination: [
          'Ask: "What does this season ask of me?"',
          'Draw Ogham or use other method'
        ],
        feast: [
          'Share food/drink',
          'Toast to gods, ancestors, nature spirits',
          'Celebrate'
        ],
        closing: 'As in basic ceremony'
      }
    }
  },

  // ============ ELEMENTAL WORK ============
  elementalWork: {
    description: 'Weekly focus rotating through the four elements',
    schedule: [
      {
        element: 'Earth',
        practices: [
          'Ground barefoot daily',
          'Work with stones/crystals',
          'Garden or tend plants',
          'Body awareness practices'
        ],
        journalPrompt: 'What grounds me?'
      },
      {
        element: 'Air',
        practices: [
          'Breathwork emphasis',
          'Incense work',
          'Study and learning focus',
          'Mental clarity practices'
        ],
        journalPrompt: 'What thoughts need clearing?'
      },
      {
        element: 'Fire',
        practices: [
          'Candle meditation',
          'Energy work',
          'Passionate creation/action',
          'Willpower exercises'
        ],
        journalPrompt: 'What needs my will?'
      },
      {
        element: 'Water',
        practices: [
          'Bath/water rituals',
          'Emotional processing',
          'Flow and adaptation',
          'Dream work'
        ],
        journalPrompt: 'What flows through me?'
      }
    ]
  },

  // ============ OGHAM TREE CALENDAR ============
  oghamCalendar: [
    {
      letter: 'Beth',
      tree: 'Birch',
      symbol: 'ᚁ',
      period: 'Dec 24 - Jan 20',
      themes: ['New beginnings', 'Purification', 'Fresh starts'],
      practices: ['Cleansing rituals', 'Setting intentions', 'Birch bark work']
    },
    {
      letter: 'Luis',
      tree: 'Rowan',
      symbol: 'ᚂ',
      period: 'Jan 21 - Feb 17',
      themes: ['Protection', 'Vision', 'Quickening life'],
      practices: ['Protection magic', 'Divination', 'Visionary work']
    },
    {
      letter: 'Nion',
      tree: 'Ash',
      symbol: 'ᚃ',
      period: 'Feb 18 - Mar 17',
      themes: ['Interconnection', 'World tree', 'Inner/outer worlds'],
      practices: ['Meditation on connections', 'Journeying', 'Staff work']
    },
    {
      letter: 'Fearn',
      tree: 'Alder',
      symbol: 'ᚄ',
      period: 'Mar 18 - Apr 14',
      themes: ['Foundation', 'Courage', 'Oracular powers'],
      practices: ['Building foundations', 'Courage work', 'Water magic']
    },
    {
      letter: 'Saille',
      tree: 'Willow',
      symbol: 'ᚅ',
      period: 'Apr 15 - May 12',
      themes: ['Intuition', 'Emotion', 'Lunar mysteries'],
      practices: ['Moon work', 'Emotional healing', 'Dream magic']
    },
    {
      letter: 'Huath',
      tree: 'Hawthorn',
      symbol: 'ᚆ',
      period: 'May 13 - Jun 9',
      themes: ['Cleansing', 'Fertility', 'Faery contact'],
      practices: ['May rituals', 'Heart opening', 'Otherworld work']
    },
    {
      letter: 'Duir',
      tree: 'Oak',
      symbol: 'ᚇ',
      period: 'Jun 10 - Jul 7',
      themes: ['Strength', 'Endurance', 'Doorways'],
      practices: ['Strength building', 'Doorway rituals', 'Midsummer rites']
    },
    {
      letter: 'Tinne',
      tree: 'Holly',
      symbol: 'ᚈ',
      period: 'Jul 8 - Aug 4',
      themes: ['Balance of dark/light', 'Challenge', 'Warrior spirit'],
      practices: ['Challenge work', 'Balance rituals', 'Protection']
    },
    {
      letter: 'Coll',
      tree: 'Hazel',
      symbol: 'ᚉ',
      period: 'Aug 5 - Sep 1',
      themes: ['Wisdom', 'Creativity', 'Inspiration'],
      practices: ['Wisdom seeking', 'Creative work', 'Poetry']
    },
    {
      letter: 'Quert',
      tree: 'Apple',
      symbol: 'ᚊ',
      period: 'Sep 2 - Sep 29',
      themes: ['Choice', 'Beauty', 'Avalon'],
      practices: ['Decision work', 'Beauty rituals', 'Otherworld journeys']
    },
    {
      letter: 'Muin',
      tree: 'Vine',
      symbol: 'ᚋ',
      period: 'Sep 30 - Oct 27',
      themes: ['Joy', 'Exhilaration', 'Prophecy'],
      practices: ['Celebration', 'Ecstatic practice', 'Harvest rites']
    },
    {
      letter: 'Gort',
      tree: 'Ivy',
      symbol: 'ᚌ',
      period: 'Oct 28 - Nov 24',
      themes: ['Spiral path', 'Persistence', 'Resurrection'],
      practices: ['Spiral meditation', 'Ancestor work', 'Death/rebirth rituals']
    },
    {
      letter: 'Ngetal',
      tree: 'Reed',
      symbol: 'ᚍ',
      period: 'Nov 25 - Dec 22',
      themes: ['Direction', 'Purpose', 'Action'],
      practices: ['Finding direction', 'Arrow magic', 'Purpose work']
    }
  ],

  // ============ JOURNALING PROMPTS ============
  journalingPrompts: {
    daily: [
      'What did I observe in nature today?',
      'How am I in balance or imbalance?',
      'What wisdom did the day offer?',
      'How did I honor the sacred?',
      'What element was most present today?'
    ],
    weekly: [
      'What patterns am I noticing?',
      'How am I relating to the current season?',
      'What is my relationship with the element of the week?',
      'What practices are serving me? What needs adjustment?',
      'How has my Sphere of Protection practice been?'
    ],
    monthly: [
      'How am I experiencing this season in my life?',
      'What is being born/dying/transforming in me now?',
      'How can I better align with natural cycles?',
      'What does the current tree month teach me?',
      'What insights arose in discursive meditation this month?'
    ],
    quarterly: [
      'What have I learned this quarter?',
      'What am I releasing?',
      'What am I calling in?',
      'How have I grown in relationship with nature/spirit/self?',
      'What does the approaching holy day ask of me?'
    ]
  },

  // ============ STUDY CURRICULUM ============
  studyCurriculum: {
    foundationTexts: [
      {
        title: 'The Druidry Handbook',
        author: 'John Michael Greer',
        focus: 'Core practices',
        order: 1
      },
      {
        title: 'The Druid Magic Handbook',
        author: 'John Michael Greer',
        focus: 'Ritual and magic',
        order: 2
      },
      {
        title: 'The Celtic Golden Dawn',
        author: 'John Michael Greer',
        focus: 'Ceremonial work',
        order: 3
      },
      {
        title: 'Circles of Power',
        author: 'John Michael Greer',
        focus: 'Ritual creation',
        order: 4
      },
      {
        title: 'Paths of Wisdom',
        author: 'John Michael Greer',
        focus: 'Kabbalistic Druidry',
        order: 5
      },
      {
        title: 'Mystery Teachings from the Living Earth',
        author: 'John Michael Greer',
        focus: 'Natural magic',
        order: 6
      }
    ],
    progressionPath: [
      {
        period: 'Months 1-3',
        focus: 'Sphere of Protection + Discursive Meditation daily',
        goals: ['Establish daily practice', 'Learn the Sphere by heart', 'Begin journal']
      },
      {
        period: 'Months 4-6',
        focus: 'Add elemental work',
        goals: ['Weekly elemental focus', 'Deepen meditation', 'Study first JMG text']
      },
      {
        period: 'Months 7-9',
        focus: 'Add lunar observations',
        goals: ['New/Full moon practices', 'Nature observation', 'Begin Ogham study']
      },
      {
        period: 'Months 10-12',
        focus: 'Add tree calendar',
        goals: ['Monthly tree focus', 'Holy day observations', 'Divination practice']
      },
      {
        period: 'Year 2+',
        focus: 'Deepen with specific JMG texts',
        goals: ['Advanced ritual work', 'Personal ceremony creation', 'Teaching others']
      }
    ]
  },

  // ============ THREE RAYS OF LIGHT (Core Philosophy) ============
  philosophy: {
    threeRays: [
      {
        name: 'Wisdom',
        description: 'Clear seeing, knowledge, truth',
        direction: 'Right ray',
        practices: ['Study', 'Discursive meditation', 'Observation']
      },
      {
        name: 'Love',
        description: 'Compassion, connection, care',
        direction: 'Left ray',
        practices: ['Service', 'Relationship work', 'Heart opening']
      },
      {
        name: 'Power',
        description: 'Will, action, manifestation',
        direction: 'Center ray',
        practices: ['Ritual', 'Intention setting', 'Magical work']
      }
    ],
    sacredCenter: {
      description: 'The balance point between extremes',
      principles: [
        'Neither/nor and both/and',
        'Middle way (similar to Buddhism)',
        'Dynamic equilibrium'
      ]
    },
    relationshipWithNature: {
      description: 'Not domination or worship, but partnership',
      principles: [
        'Nature as teacher and mirror',
        'Cycles teach wisdom',
        'Human place in the web of life'
      ]
    },
    mysteries: {
      description: 'Some things learned through practice, not study',
      principles: [
        'Direct experience > theoretical knowledge',
        'Gnosis through doing',
        'The path reveals itself to the walker'
      ]
    }
  },

  // ============ CORRESPONDENCES FOR APP TERMINOLOGY ============
  correspondences: {
    'Ritual Bath': 'Purification Bath / Elemental Cleansing',
    'Meditation': 'Discursive Meditation',
    'Vessel Work': 'Body as Grove (physical practice)',
    'Breathwork': 'Elemental Air Work',
    'Study/Reading': 'Sacred Reading / Druid Study',
    'Integration Journaling': 'Grove Journal / Bardic Record',
    'Sacred Union': 'Sacred Marriage / Partnership Rites',
    'Tending': 'Land Tending / Grove Keeping',
    'Tarot/Divination': 'Ogham / Divination',
    'Ceremonial Work': 'Druid Ceremony / Seasonal Rites'
  },

  // ============ CALENDAR INTEGRATION ============
  enabledCalendars: ['druidic', 'moon', 'moonSign'],

  // ============ SUGGESTED SOUNDS ============
  defaultSounds: {
    meditation: 'singing_bowl',
    ceremony: 'chimes',
    interval: 'bell'
  }
}

export default DRUID_PRESET
