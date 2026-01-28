import { createContext, useContext, useState, useEffect } from 'react'
import { isFeatureEnabled } from '../config/featureFlags'

const OnboardingContext = createContext(null)

const STORAGE_KEY = 'practice-space-onboarding'

export function OnboardingProvider({ children }) {
  const [isComplete, setIsComplete] = useState(null) // null = loading, true/false = known
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState({})
  const [personality, setPersonality] = useState(null)

  // Check if onboarding is complete on mount
  useEffect(() => {
    // If Helper System is disabled, skip onboarding entirely
    if (!isFeatureEnabled('HELPER_SYSTEM_ENABLED')) {
      setIsComplete(true)
      return
    }

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.complete) {
          setIsComplete(true)
          setAnswers(data.answers || {})
          setPersonality(data.personality || null)
        } else {
          setIsComplete(false)
        }
      } catch {
        setIsComplete(false)
      }
    } else {
      setIsComplete(false)
    }
  }, [])

  // Save answer for a question
  function saveAnswer(questionNumber, answer) {
    const newAnswers = { ...answers, [questionNumber]: answer }
    setAnswers(newAnswers)

    // Q1 establishes personality
    if (questionNumber === 1) {
      setPersonality(answer)
    }
  }

  // Move to next question
  function nextQuestion() {
    setCurrentQuestion(prev => prev + 1)
  }

  // Move to previous question
  function previousQuestion() {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  // Go to specific question
  function goToQuestion(questionNumber) {
    setCurrentQuestion(questionNumber)
  }

  // Complete onboarding
  function completeOnboarding() {
    const data = {
      complete: true,
      answers,
      personality,
      completedAt: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setIsComplete(true)
  }

  // Reset onboarding (for testing)
  function resetOnboarding() {
    localStorage.removeItem(STORAGE_KEY)
    setIsComplete(false)
    setCurrentQuestion(1)
    setAnswers({})
    setPersonality(null)
  }

  // Get saved configuration
  function getConfiguration() {
    return {
      personality: answers[1] || null,
      traditionSort: answers[2] || 'alphabetical',
      explorationStyle: answers[3] || 'beginning',
      calendarMode: answers[4] || 'minimal'
    }
  }

  const value = {
    isComplete,
    currentQuestion,
    answers,
    personality,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    completeOnboarding,
    resetOnboarding,
    getConfiguration
  }

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
