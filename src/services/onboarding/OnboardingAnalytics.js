// Onboarding Analytics
// Comprehensive tracking for the onboarding flow

export class OnboardingAnalytics {
  constructor() {
    this.events = []
    this.startTime = Date.now()
  }

  trackEvent(eventType, data) {
    this.events.push({
      type: eventType,
      data: data,
      timestamp: Date.now()
    })
  }

  trackQuestionStart(questionNumber) {
    this.trackEvent('question_start', {
      question: questionNumber,
      relativeTime: Date.now() - this.startTime
    })
  }

  trackQuestionAnswer(questionNumber, answer, timeToAnswer) {
    this.trackEvent('question_answer', {
      question: questionNumber,
      answer: answer,
      timeToAnswer: timeToAnswer
    })
  }

  trackHelperShown(questionNumber, helperType, delay) {
    this.trackEvent('helper_shown', {
      question: questionNumber,
      type: helperType,
      actualDelay: delay
    })
  }

  trackBackPress(fromQuestion, toQuestion) {
    this.trackEvent('back_press', {
      from: fromQuestion,
      to: toQuestion,
      pattern: this.detectBackPattern()
    })
  }

  detectBackPattern() {
    const recentBacks = this.events
      .filter(e => e.type === 'back_press')
      .slice(-3)

    if (recentBacks.length >= 2) return 'hesitant'
    if (recentBacks.length === 1) return 'reconsidering'
    return 'none'
  }

  getSummary() {
    const answers = this.events.filter(e => e.type === 'question_answer')
    const backPresses = this.events.filter(e => e.type === 'back_press')
    const helpersShown = this.events.filter(e => e.type === 'helper_shown')

    return {
      totalTime: Date.now() - this.startTime,
      questionsAnswered: answers.length,
      totalBackPresses: backPresses.length,
      helpersShown: helpersShown.length,
      mostRevisedQuestion: this.getMostRevisedQuestion(),
      averageTimePerQuestion: this.getAverageTimePerQuestion(),
      userConfidence: this.estimateConfidence(),
      completionPattern: this.getCompletionPattern()
    }
  }

  getMostRevisedQuestion() {
    const backPresses = this.events.filter(e => e.type === 'back_press')
    const counts = {}

    backPresses.forEach(bp => {
      const q = bp.data.from
      counts[q] = (counts[q] || 0) + 1
    })

    let max = 0
    let question = null

    for (let [q, count] of Object.entries(counts)) {
      if (count > max) {
        max = count
        question = q
      }
    }

    return { question, revisions: max }
  }

  getAverageTimePerQuestion() {
    const answers = this.events.filter(e => e.type === 'question_answer')
    if (answers.length === 0) return 0

    const totalTime = answers.reduce((sum, a) => sum + a.data.timeToAnswer, 0)
    return totalTime / answers.length
  }

  estimateConfidence() {
    const backPresses = this.events.filter(e => e.type === 'back_press').length
    const avgTime = this.getAverageTimePerQuestion()

    if (backPresses === 0 && avgTime < 5000) return 'very_confident'
    if (backPresses <= 1 && avgTime < 10000) return 'confident'
    if (backPresses <= 3 && avgTime < 20000) return 'thoughtful'
    return 'uncertain'
  }

  getCompletionPattern() {
    const avgTime = this.getAverageTimePerQuestion()
    const backPresses = this.events.filter(e => e.type === 'back_press').length

    if (avgTime < 3000 && backPresses === 0) return 'rapid_decisive'
    if (avgTime < 5000 && backPresses <= 1) return 'confident_quick'
    if (avgTime < 10000 && backPresses <= 2) return 'measured_thoughtful'
    if (avgTime > 10000 || backPresses > 3) return 'deeply_contemplative'
    return 'balanced'
  }

  exportForAnalysis() {
    return {
      summary: this.getSummary(),
      events: this.events,
      metadata: {
        startTime: this.startTime,
        endTime: Date.now(),
        totalDuration: Date.now() - this.startTime
      }
    }
  }

  reset() {
    this.events = []
    this.startTime = Date.now()
  }
}

export default OnboardingAnalytics
