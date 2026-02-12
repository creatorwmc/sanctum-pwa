import { createContext, useContext, useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore, isFirebaseConfigured } from '../config/firebase'
import { useAuth } from './AuthContext'

const OnboardingContext = createContext(null)

const STORAGE_KEY = 'practice-space-onboarding'

export function OnboardingProvider({ children }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [isComplete, setIsComplete] = useState(true) // Default to true (skip onboarding) until we know
  const [showOnboarding, setShowOnboarding] = useState(false) // Controls whether to show onboarding UI

  // TEMPORARILY DISABLED: Onboarding questions need adjustment before deployment
  const ONBOARDING_DISABLED = true
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState({})
  const [personality, setPersonality] = useState(null)

  // Check onboarding status when user changes
  useEffect(() => {
    async function checkOnboardingStatus() {
      // TEMPORARILY DISABLED: Skip onboarding entirely
      if (ONBOARDING_DISABLED) {
        setIsComplete(true)
        setShowOnboarding(false)
        return
      }

      // Wait for auth to finish loading
      if (authLoading) {
        return
      }

      if (!isAuthenticated || !user) {
        // Not logged in - don't show onboarding, use local settings if available
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          try {
            const data = JSON.parse(saved)
            setAnswers(data.answers || {})
            setPersonality(data.personality || null)
          } catch {
            // Ignore errors
          }
        }
        setIsComplete(true)
        setShowOnboarding(false)
        return
      }

      // User is logged in - check Firestore for onboarding status
      if (isFirebaseConfigured() && firestore) {
        try {
          const onboardingDoc = doc(firestore, 'users', user.uid, 'settings', 'onboarding')
          const snapshot = await getDoc(onboardingDoc)

          if (snapshot.exists()) {
            const data = snapshot.data()
            setAnswers(data.answers || {})
            setPersonality(data.personality || null)
            setIsComplete(true)
            setShowOnboarding(false)

            // Also save to localStorage for offline access
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
              complete: true,
              answers: data.answers,
              personality: data.personality
            }))
          } else {
            // No onboarding data in Firestore - check localStorage as fallback
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
              try {
                const data = JSON.parse(saved)
                if (data.complete) {
                  setAnswers(data.answers || {})
                  setPersonality(data.personality || null)
                  setIsComplete(true)
                  setShowOnboarding(false)
                  return
                }
              } catch {
                // Ignore parse errors
              }
            }
            // No saved data anywhere - user needs to complete onboarding
            setIsComplete(false)
            setShowOnboarding(true)
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error)
          // Fall back to localStorage
          const saved = localStorage.getItem(STORAGE_KEY)
          if (saved) {
            try {
              const data = JSON.parse(saved)
              setAnswers(data.answers || {})
              setPersonality(data.personality || null)
              setIsComplete(data.complete || false)
              setShowOnboarding(!data.complete)
            } catch {
              setIsComplete(false)
              setShowOnboarding(true)
            }
          } else {
            setIsComplete(false)
            setShowOnboarding(true)
          }
        }
      } else {
        // Firebase not configured - use localStorage only
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          try {
            const data = JSON.parse(saved)
            setAnswers(data.answers || {})
            setPersonality(data.personality || null)
            setIsComplete(data.complete || false)
            setShowOnboarding(!data.complete)
          } catch {
            setIsComplete(false)
            setShowOnboarding(true)
          }
        } else {
          setIsComplete(false)
          setShowOnboarding(true)
        }
      }
    }

    checkOnboardingStatus()
  }, [authLoading, isAuthenticated, user])

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
  async function completeOnboarding() {
    const data = {
      complete: true,
      answers,
      personality,
      completedAt: new Date().toISOString()
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

    // Save to Firestore if user is logged in
    if (user && isFirebaseConfigured() && firestore) {
      try {
        const onboardingDoc = doc(firestore, 'users', user.uid, 'settings', 'onboarding')
        await setDoc(onboardingDoc, {
          answers,
          personality,
          completedAt: new Date().toISOString()
        })
      } catch (error) {
        console.error('Error saving onboarding to Firestore:', error)
      }
    }

    setIsComplete(true)
    setShowOnboarding(false)
  }

  // Reset onboarding (for re-doing setup)
  async function resetOnboarding() {
    localStorage.removeItem(STORAGE_KEY)
    setIsComplete(false)
    setShowOnboarding(true)
    setCurrentQuestion(1)
    setAnswers({})
    setPersonality(null)

    // Also clear from Firestore if user is logged in
    if (user && isFirebaseConfigured() && firestore) {
      try {
        const onboardingDoc = doc(firestore, 'users', user.uid, 'settings', 'onboarding')
        await setDoc(onboardingDoc, { reset: true, resetAt: new Date().toISOString() })
      } catch (error) {
        console.error('Error resetting onboarding in Firestore:', error)
      }
    }
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
    showOnboarding,
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
