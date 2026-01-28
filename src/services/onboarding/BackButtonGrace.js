// Back Button Grace System
// Provides encouraging messages when users go back to reconsider

const graceMessages = {
  warm: {
    1: "Want to reconsider? Take all the time you need.",
    2: "Second thoughts? That's wisdom speaking.",
    3: "Feeling uncertain? That's perfectly natural.",
    4: "Rethinking? Your intuition is guiding you."
  },
  minimal: {
    1: "Want to reconsider? Take your time.",
    2: "Second thoughts? Reflect freely.",
    3: "Reconsidering? Listen to your intuition.",
    4: "Rethinking? That's wise."
  },
  mystical: {
    1: "The threshold calls you back. Listen to what it whispers.",
    2: "Something draws you to reconsider. Honor that pull.",
    3: "The path reveals itself slowly. Patience.",
    4: "Returning to reassess is itself a sacred act."
  },
  academic: {
    1: "Reconsidering your selection? This supports better outcomes.",
    2: "Reviewing your choice? Iterative refinement is valuable.",
    3: "Second assessment? Self-reflection improves accuracy.",
    4: "Re-evaluating? Considered decision-making is optimal."
  }
}

const encouragementMessages = {
  warm: "You're doing great. There really are no wrong answers here.",
  minimal: "You're doing fine. Any choice works.",
  mystical: "Trust the process. Your uncertainty is part of the journey.",
  academic: "Multiple revisions indicate thoughtful consideration. Proceed when ready."
}

export class BackButtonGrace {
  constructor(personalityKey = 'minimal') {
    this.personalityKey = personalityKey
    this.backPresses = []
  }

  setPersonality(personalityKey) {
    this.personalityKey = personalityKey
  }

  recordBackPress(fromQuestion, timestamp = Date.now()) {
    this.backPresses.push({
      from: fromQuestion,
      time: timestamp
    })
  }

  getGraceMessage(questionNumber) {
    const messages = graceMessages[this.personalityKey] || graceMessages.minimal
    return messages[questionNumber] || "Want to reconsider? Take your time."
  }

  shouldShowEncouragement() {
    // If user has pressed back multiple times, offer encouragement
    return this.backPresses.length >= 2
  }

  getEncouragementMessage() {
    return encouragementMessages[this.personalityKey] || encouragementMessages.minimal
  }

  getBackPressPattern() {
    if (this.backPresses.length === 0) return 'none'
    if (this.backPresses.length === 1) return 'single_revision'
    if (this.backPresses.length >= 3) return 'highly_uncertain'
    return 'multiple_revisions'
  }

  getBackPressCount() {
    return this.backPresses.length
  }

  reset() {
    this.backPresses = []
  }
}

export default BackButtonGrace
