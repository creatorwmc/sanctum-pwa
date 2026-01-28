// Hesitation Analyzer
// Tracks which questions cause the most pause and provides insights

export class HesitationAnalyzer {
  constructor() {
    this.hesitations = {}
  }

  recordHesitation(questionNumber, duration) {
    if (!this.hesitations[questionNumber]) {
      this.hesitations[questionNumber] = []
    }
    this.hesitations[questionNumber].push(duration)
  }

  getMostDifficultQuestion() {
    let maxAvg = 0
    let mostDifficult = null

    for (let [q, times] of Object.entries(this.hesitations)) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      if (avg > maxAvg) {
        maxAvg = avg
        mostDifficult = q
      }
    }

    return { question: mostDifficult, avgTime: maxAvg }
  }

  getQuestionInsights() {
    const insights = {
      1: 'Visual choices set the tone - people naturally pause here',
      2: 'Organization reveals values - worth reflecting on',
      3: 'Naming your stage requires honest self-assessment',
      4: 'Calendar complexity is real - good to think through'
    }

    const difficult = this.getMostDifficultQuestion()
    return {
      mostDifficult: difficult.question,
      avgHesitation: difficult.avgTime,
      insight: insights[difficult.question] || 'Thoughtfulness is wisdom'
    }
  }

  getAverageHesitationForQuestion(questionNumber) {
    const times = this.hesitations[questionNumber]
    if (!times || times.length === 0) return 0
    return times.reduce((a, b) => a + b, 0) / times.length
  }

  reset() {
    this.hesitations = {}
  }
}

export default HesitationAnalyzer
