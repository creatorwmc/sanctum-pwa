// Onboarding question configurations for Practice Space

export const questions = {
  1: {
    id: 1,
    text: "Select one of these...",
    preamble: {
      text: "Think about your ideal spiritual journey for a moment...",
      fadeInDuration: 3000,
      fadeOutDuration: 2000
    },
    options: [
      { text: "Warm and inviting", value: "warm" },
      { text: "Clean and minimal", value: "minimal" },
      { text: "Mystical", value: "mystical" },
      { text: "Academically rigorous", value: "academic" }
    ],
    helpers: {
      primary: {
        delay: 4000,
        text: "Which path feels best for developing your Sacred Place?",
        adaptedTexts: {
          warm: "Which path feels best for developing your Sacred Place?",
          minimal: "Which path feels best for your Sacred Place?",
          mystical: "Which threshold calls to you as you enter your Sacred Place?",
          academic: "Which visual framework best supports your practice goals?"
        }
      },
      secondary: {
        delay: 2000,
        text: "There's no wrong choice here.",
        adaptedTexts: {
          warm: "There's no wrong choice here. We're building this together!",
          minimal: "There's no wrong choice here.",
          mystical: "There's no wrong choice here. Trust what resonates.",
          academic: "There's no wrong choice here. All options are equally valid."
        }
      }
    }
  },

  2: {
    id: 2,
    text: "When exploring spiritual traditions, which approach resonates with you?",
    options: [
      { text: "Show me the most practiced paths first", value: "population_desc" },
      { text: "Honor the ancient wisdom keepers", value: "age_desc" },
      { text: "Organize by where they emerged", value: "geographic" },
      { text: "Group by what practitioners actually do", value: "practice" },
      { text: "Show me what's most accessible to begin", value: "accessibility" },
      { text: "Help me understand different ways of knowing", value: "epistemology" },
      { text: "Just list them simply - I'll explore", value: "alphabetical" },
      { text: "You choose / I can't decide", value: "default" }
    ],
    helpers: {
      primary: {
        delay: 4000,
        text: "What matters most when viewing different paths?",
        adaptedTexts: {
          warm: "What matters most to you when seeing different paths?",
          minimal: "What matters most when viewing different paths?",
          mystical: "How would you have the great traditions reveal themselves?",
          academic: "Which organizational paradigm aligns with your values?"
        }
      },
      secondary: {
        delay: 2000,
        text: "This just changes the order - all traditions remain available.",
        adaptedTexts: {
          warm: "This just changes the order - all traditions remain available.",
          minimal: "This just changes the order - all traditions remain available.",
          mystical: "This shapes the unfolding - all paths remain open to you.",
          academic: "This parameter affects display order only - all data remains accessible."
        }
      }
    }
  },

  3: {
    id: 3,
    text: "As you begin this journey, what feels most true?",
    options: [
      { text: "I have a specific tradition I follow", value: "specific" },
      { text: "I'm curious about multiple paths", value: "multiple" },
      { text: "I'm just beginning to explore", value: "beginning" },
      { text: "I prefer to build my own synthesis", value: "synthesis" },
      { text: "I'm not sure yet", value: "unsure" }
    ],
    helpers: {
      primary: {
        delay: 4000,
        text: "Where are you in your spiritual journey?",
        adaptedTexts: {
          warm: "Where are you in your spiritual journey right now?",
          minimal: "Where are you in your spiritual journey?",
          mystical: "What stage of the Great Work finds you today?",
          academic: "What best describes your current practice orientation?"
        }
      },
      secondary: {
        delay: 2000,
        text: "Honoring exactly where you are is the first step.",
        adaptedTexts: {
          warm: "Honoring exactly where you are is the first step. You're already home.",
          minimal: "Honoring exactly where you are is the first step.",
          mystical: "Honoring exactly where you are is the first step of the journey.",
          academic: "Honoring exactly where you are is the first step. Self-awareness precedes development."
        }
      }
    }
  },

  4: {
    id: 4,
    text: "How do you want to engage with sacred calendars and observances?",
    options: [
      { text: "Explorer Mode - Multiple traditions' calendars", value: "explorer" },
      { text: "Focused Mode - Just my tradition's calendar", value: "focused" },
      { text: "Minimal Mode - All calendars off, I'll enable what I want", value: "minimal" },
      { text: "Everything Mode - All calendars visible", value: "everything" }
    ],
    helpers: {
      primary: {
        delay: 4000,
        text: "How much structure feels supportive vs. overwhelming?",
        adaptedTexts: {
          warm: "How much structure feels supportive vs. overwhelming right now?",
          minimal: "How much structure feels supportive vs. overwhelming?",
          mystical: "How much framework serves your unfolding practice?",
          academic: "What level of calendar integration matches your current capacity?"
        }
      },
      secondary: {
        delay: 2000,
        text: "You can enable or disable any calendar anytime.",
        adaptedTexts: {
          warm: "You can enable or disable any calendar anytime. Complete flexibility!",
          minimal: "You can enable or disable any calendar anytime.",
          mystical: "You can enable or disable any calendar anytime. Your practice evolves with you.",
          academic: "You can enable or disable any calendar anytime. All settings are reversible."
        }
      }
    }
  }
}

export const totalQuestions = 4
