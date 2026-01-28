// User Pace Tracker
// Tracks response times and adapts helper timing accordingly

export class UserPaceTracker {
  constructor() {
    this.responses = []
    this.baseDelay = 4000 // 4 seconds
    this.paceModifier = 1.0 // neutral start
  }

  recordResponse(questionNumber, timeToAnswer) {
    this.responses.push({
      question: questionNumber,
      time: timeToAnswer,
      timestamp: Date.now()
    })

    this.updatePaceModifier()
  }

  updatePaceModifier() {
    if (this.responses.length === 0) return

    const avgTime = this.responses.reduce((sum, r) => sum + r.time, 0) / this.responses.length

    // Fast responders (< 3 seconds average)
    if (avgTime < 3000) {
      this.paceModifier = 0.75 // Show helpers sooner
    }
    // Thoughtful responders (> 8 seconds average)
    else if (avgTime > 8000) {
      this.paceModifier = 1.5 // Wait longer before helpers
    }
    // Standard pace
    else {
      this.paceModifier = 1.0
    }
  }

  getAdaptedDelay(baseDelay) {
    return Math.round(baseDelay * this.paceModifier)
  }

  getUserPattern() {
    if (this.paceModifier < 0.9) return 'decisive'
    if (this.paceModifier > 1.2) return 'contemplative'
    return 'balanced'
  }

  getInsight() {
    const pattern = this.getUserPattern()
    const insights = {
      decisive: 'Quick decision-maker - trusts first instincts',
      contemplative: 'Thoughtful processor - values reflection',
      balanced: 'Measured approach - weighs options carefully'
    }
    return insights[pattern]
  }

  getAverageResponseTime() {
    if (this.responses.length === 0) return 0
    return this.responses.reduce((sum, r) => sum + r.time, 0) / this.responses.length
  }

  reset() {
    this.responses = []
    this.paceModifier = 1.0
  }
}

export default UserPaceTracker
