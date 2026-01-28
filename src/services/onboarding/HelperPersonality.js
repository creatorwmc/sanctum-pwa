// Helper Personality System
// Adapts text and styling based on user's visual personality choice

const personalityStyles = {
  warm: {
    key: 'warm',
    useEmojis: true,
    tone: 'supportive',
    pronouns: 'we/us',
    emphasis: 'safety',
    colorScheme: 'warm_pastels',
    fontWeight: 'regular'
  },
  minimal: {
    key: 'minimal',
    useEmojis: false,
    tone: 'clear',
    pronouns: 'you',
    emphasis: 'simplicity',
    colorScheme: 'monochrome',
    fontWeight: 'light'
  },
  mystical: {
    key: 'mystical',
    useEmojis: false,
    tone: 'poetic',
    pronouns: 'you/the path',
    emphasis: 'mystery',
    colorScheme: 'deep_purples',
    fontWeight: 'regular'
  },
  academic: {
    key: 'academic',
    useEmojis: false,
    tone: 'informative',
    pronouns: 'you',
    emphasis: 'understanding',
    colorScheme: 'professional_blues',
    fontWeight: 'medium'
  }
}

// Emoji mappings for warm personality
const contextEmojis = {
  encouragement: ['✨', '💫', '🌟', '💚', '🌱'],
  question: ['🤔', '💭', '✨'],
  success: ['🎉', '💚', '🌟'],
  reassurance: ['💙', '🌸', '✨', '💫']
}

export class HelperPersonality {
  constructor(personalityKey) {
    this.key = personalityKey || 'minimal'
    this.style = personalityStyles[this.key] || personalityStyles.minimal
  }

  // Get the personality style object
  getStyle() {
    return this.style
  }

  // Get adapted helper text for current personality
  getHelperText(helperConfig, type = 'primary') {
    const adaptedTexts = helperConfig.adaptedTexts

    // Use personality-specific text if available
    if (adaptedTexts && adaptedTexts[this.key]) {
      let text = adaptedTexts[this.key]

      // Add emoji for warm personality
      if (this.style.useEmojis && type === 'primary') {
        text = this.addContextualEmoji(text, 'question')
      } else if (this.style.useEmojis && type === 'secondary') {
        text = this.addContextualEmoji(text, 'reassurance')
      }

      return text
    }

    // Fallback to base text
    return helperConfig.text || ''
  }

  // Add contextual emoji to text (for warm personality)
  addContextualEmoji(text, context) {
    if (!this.style.useEmojis) return text

    const emojis = contextEmojis[context] || contextEmojis.encouragement
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]

    // Add emoji at end if not already present
    if (!/[\u{1F300}-\u{1F9FF}]/u.test(text.slice(-2))) {
      return `${text} ${emoji}`
    }

    return text
  }

  // Adapt generic text based on personality
  adaptText(baseText, options = {}) {
    let adapted = baseText

    // Apply pronoun preferences for warm personality
    if (this.style.pronouns === 'we/us' && options.adaptPronouns !== false) {
      adapted = adapted.replace(/\byou are\b/gi, 'we are')
      adapted = adapted.replace(/\byou're\b/gi, "we're")
      adapted = adapted.replace(/\byour\b/gi, 'our')
    }

    // Add emoji if appropriate
    if (this.style.useEmojis && options.addEmoji) {
      adapted = this.addContextualEmoji(adapted, options.emojiContext || 'encouragement')
    }

    return adapted
  }
}

export default HelperPersonality
