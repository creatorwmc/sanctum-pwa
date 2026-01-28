import { useState, useEffect, useRef, useMemo } from 'react'
import { useOnboarding } from '../contexts/OnboardingContext'
import { questions, totalQuestions } from '../data/onboardingQuestions'
import {
  HelperPersonality,
  UserPaceTracker,
  HesitationAnalyzer,
  OnboardingAnalytics,
  BackButtonGrace
} from '../services/onboarding'
import HelperPrompt from '../components/Onboarding/HelperPrompt'
import GraceMessage from '../components/Onboarding/GraceMessage'
import './Onboarding.css'

function Onboarding() {
  const {
    currentQuestion,
    answers,
    personality,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    completeOnboarding
  } = useOnboarding()

  // Preamble state
  const [showPreamble, setShowPreamble] = useState(false)
  const [preambleFading, setPreambleFading] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)

  // Helper state
  const [showPrimaryHelper, setShowPrimaryHelper] = useState(false)
  const [showSecondaryHelper, setShowSecondaryHelper] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(null)

  // Grace message state
  const [graceMessage, setGraceMessage] = useState(null)
  const [graceType, setGraceType] = useState('info')
  const [showGrace, setShowGrace] = useState(false)

  // Completion state
  const [showCompletion, setShowCompletion] = useState(false)

  // Timer refs
  const primaryTimerRef = useRef(null)
  const secondaryTimerRef = useRef(null)

  // Service instances (persist across renders)
  const paceTrackerRef = useRef(new UserPaceTracker())
  const hesitationAnalyzerRef = useRef(new HesitationAnalyzer())
  const analyticsRef = useRef(new OnboardingAnalytics())
  const graceSystemRef = useRef(new BackButtonGrace())

  const question = questions[currentQuestion]

  // Create personality helper (memoized based on personality)
  const helperPersonality = useMemo(() => {
    const hp = new HelperPersonality(personality)
    // Update grace system personality when it changes
    graceSystemRef.current.setPersonality(personality || 'minimal')
    return hp
  }, [personality])

  // Get adapted delays based on user pace
  const getAdaptedDelay = (baseDelay) => {
    return paceTrackerRef.current.getAdaptedDelay(baseDelay)
  }

  // Get helper texts
  const primaryHelperText = useMemo(() => {
    if (!question.helpers?.primary) return ''
    return helperPersonality.getHelperText(question.helpers.primary, 'primary')
  }, [question, helperPersonality])

  const secondaryHelperText = useMemo(() => {
    if (!question.helpers?.secondary) return ''
    return helperPersonality.getHelperText(question.helpers.secondary, 'secondary')
  }, [question, helperPersonality])

  // Clear all helper timers
  function clearHelperTimers() {
    if (primaryTimerRef.current) {
      clearTimeout(primaryTimerRef.current)
      primaryTimerRef.current = null
    }
    if (secondaryTimerRef.current) {
      clearTimeout(secondaryTimerRef.current)
      secondaryTimerRef.current = null
    }
  }

  // Set up helper timers when question is shown
  function setupHelperTimers() {
    clearHelperTimers()
    setShowPrimaryHelper(false)
    setShowSecondaryHelper(false)

    const basePrimaryDelay = question.helpers?.primary?.delay || 4000
    const baseSecondaryDelay = question.helpers?.secondary?.delay || 2000

    // Apply adaptive timing
    const primaryDelay = getAdaptedDelay(basePrimaryDelay)
    const secondaryDelay = getAdaptedDelay(baseSecondaryDelay)

    // Primary helper timer
    primaryTimerRef.current = setTimeout(() => {
      setShowPrimaryHelper(true)
      analyticsRef.current.trackHelperShown(currentQuestion, 'primary', primaryDelay)
    }, primaryDelay)

    // Secondary helper timer (after primary)
    secondaryTimerRef.current = setTimeout(() => {
      setShowSecondaryHelper(true)
      analyticsRef.current.trackHelperShown(currentQuestion, 'secondary', primaryDelay + secondaryDelay)
    }, primaryDelay + secondaryDelay)
  }

  // Handle preamble animation for Q1
  useEffect(() => {
    // Reset helper state on question change
    setShowPrimaryHelper(false)
    setShowSecondaryHelper(false)
    clearHelperTimers()

    // Track question start
    analyticsRef.current.trackQuestionStart(currentQuestion)

    if (currentQuestion === 1 && question.preamble) {
      // Reset state
      setShowPreamble(false)
      setPreambleFading(false)
      setShowQuestion(false)

      // Start preamble fade in
      const fadeInTimer = setTimeout(() => {
        setShowPreamble(true)
      }, 500)

      // Start preamble fade out
      const fadeOutTimer = setTimeout(() => {
        setPreambleFading(true)
      }, question.preamble.fadeInDuration + 500)

      // Show question and start helper timers
      const showQuestionTimer = setTimeout(() => {
        setShowPreamble(false)
        setPreambleFading(false)
        setShowQuestion(true)
        setQuestionStartTime(Date.now())
        setupHelperTimers()
      }, question.preamble.fadeInDuration + question.preamble.fadeOutDuration + 500)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(showQuestionTimer)
        clearHelperTimers()
      }
    } else {
      // Non-Q1 questions show immediately
      setShowPreamble(false)
      setPreambleFading(false)
      setShowQuestion(true)
      setQuestionStartTime(Date.now())
      setupHelperTimers()

      return () => {
        clearHelperTimers()
      }
    }
  }, [currentQuestion])

  // Restore selected option when returning to a question
  useEffect(() => {
    setSelectedOption(answers[currentQuestion] || null)
  }, [currentQuestion, answers])

  function handleOptionSelect(value) {
    setSelectedOption(value)
    // Clear helper timers when user makes a selection
    clearHelperTimers()
  }

  function handleContinue() {
    if (!selectedOption) return

    // Calculate response time
    const responseTime = Date.now() - questionStartTime

    // Track in all systems
    analyticsRef.current.trackQuestionAnswer(currentQuestion, selectedOption, responseTime)
    paceTrackerRef.current.recordResponse(currentQuestion, responseTime)
    hesitationAnalyzerRef.current.recordHesitation(currentQuestion, responseTime)

    // Clear helpers before transitioning
    setShowPrimaryHelper(false)
    setShowSecondaryHelper(false)
    clearHelperTimers()

    saveAnswer(currentQuestion, selectedOption)

    if (currentQuestion < totalQuestions) {
      nextQuestion()
    } else {
      handleComplete()
    }
  }

  function handleBack() {
    if (currentQuestion > 1) {
      // Track back press
      analyticsRef.current.trackBackPress(currentQuestion, currentQuestion - 1)
      graceSystemRef.current.recordBackPress(currentQuestion)

      // Show grace message
      const graceMsg = graceSystemRef.current.getGraceMessage(currentQuestion)
      setGraceMessage(graceMsg)
      setGraceType('info')
      setShowGrace(true)

      // Show encouragement if needed (after a delay)
      if (graceSystemRef.current.shouldShowEncouragement()) {
        setTimeout(() => {
          const encouragement = graceSystemRef.current.getEncouragementMessage()
          setGraceMessage(encouragement)
          setGraceType('encouragement')
          setShowGrace(true)
        }, 3500)
      }

      // Clear helpers before going back
      setShowPrimaryHelper(false)
      setShowSecondaryHelper(false)
      clearHelperTimers()
      previousQuestion()
    }
  }

  function handleComplete() {
    // Get analytics summary
    const summary = analyticsRef.current.getSummary()
    const paceInsight = paceTrackerRef.current.getInsight()
    const hesitationInsight = hesitationAnalyzerRef.current.getQuestionInsights()

    // Store analytics
    const analyticsData = {
      ...analyticsRef.current.exportForAnalysis(),
      pacePattern: paceTrackerRef.current.getUserPattern(),
      paceInsight,
      hesitationInsight
    }
    localStorage.setItem('practice-space-onboarding-analytics', JSON.stringify(analyticsData))

    // Show completion ceremony
    setShowCompletion(true)

    // Complete after short delay
    setTimeout(() => {
      completeOnboarding()
    }, 2500)
  }

  function handleGraceHide() {
    setShowGrace(false)
  }

  // Get personality-specific styling class
  function getPersonalityClass() {
    if (!personality) return ''
    return `personality-${personality}`
  }

  // Get completion message based on personality
  function getCompletionMessage() {
    const messages = {
      warm: "Welcome home! Your Sacred Place is ready.",
      minimal: "Setup complete. Your Practice Space is ready.",
      mystical: "The threshold is crossed. Your Sacred Place awaits.",
      academic: "Configuration complete. Your Practice Space has been initialized."
    }
    return messages[personality] || messages.minimal
  }

  return (
    <div className={`onboarding-page ${getPersonalityClass()}`}>
      {/* Grace messages */}
      <div className="grace-container">
        <GraceMessage
          message={graceMessage}
          type={graceType}
          show={showGrace}
          duration={4000}
          onHide={handleGraceHide}
        />
      </div>

      {/* Preamble for Q1 */}
      {currentQuestion === 1 && (showPreamble || preambleFading) && (
        <div className={`preamble ${showPreamble && !preambleFading ? 'fade-in' : ''} ${preambleFading ? 'fade-out' : ''}`}>
          <p className="preamble-text">{question.preamble.text}</p>
        </div>
      )}

      {/* Completion ceremony */}
      {showCompletion && (
        <div className="completion-ceremony fade-in">
          <div className="completion-icon">✦</div>
          <h2 className="completion-message">{getCompletionMessage()}</h2>
        </div>
      )}

      {/* Question content */}
      {showQuestion && !showCompletion && (
        <div className="onboarding-content fade-in">
          {/* Progress indicator */}
          <div className="progress-indicator">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <div
                key={i}
                className={`progress-dot ${i + 1 === currentQuestion ? 'active' : ''} ${i + 1 < currentQuestion ? 'completed' : ''}`}
              />
            ))}
          </div>

          {/* Question */}
          <h1 className="onboarding-question">{question.text}</h1>

          {/* Options */}
          <div className="onboarding-options">
            {question.options.map((option) => (
              <button
                key={option.value}
                className={`onboarding-option ${selectedOption === option.value ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option.value)}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* Helper prompts */}
          <div className="helper-container">
            <HelperPrompt
              text={primaryHelperText}
              type="primary"
              show={showPrimaryHelper}
              personality={personality}
            />
            <HelperPrompt
              text={secondaryHelperText}
              type="secondary"
              show={showSecondaryHelper}
              personality={personality}
            />
          </div>

          {/* Navigation */}
          <div className="onboarding-nav">
            {currentQuestion > 1 && (
              <button className="nav-btn nav-btn-back" onClick={handleBack}>
                Back
              </button>
            )}
            <button
              className="nav-btn nav-btn-continue"
              onClick={handleContinue}
              disabled={!selectedOption}
            >
              {currentQuestion === totalQuestions ? 'Begin' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Onboarding
