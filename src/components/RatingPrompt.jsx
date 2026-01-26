import { useState, useEffect } from 'react'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import './RatingPrompt.css'

const REFLECTION_QUESTIONS = [
  { id: 'helping', text: 'Is this helping?' },
  { id: 'useful', text: 'Is this useful?' },
  { id: 'enjoyable', text: 'Is this enjoyable?' },
  { id: 'supporting', text: 'Is this supporting your practice?' },
  { id: 'growing', text: 'Is this helping you grow?' },
  { id: 'meaningful', text: 'Does this feel meaningful?' }
]

const STORAGE_KEY = 'sanctum-rating-data'
const COOLDOWN_DAYS = 30
const MIN_ACTIVE_DAYS = 7

function getRatingData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {
      lastShown: null,
      lastResponse: null,
      responses: [],
      disabled: false,
      firstUseDate: getLocalDateString()
    }
  } catch {
    return {
      lastShown: null,
      lastResponse: null,
      responses: [],
      disabled: false,
      firstUseDate: getLocalDateString()
    }
  }
}

function saveRatingData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function shouldShowRatingPrompt() {
  const data = getRatingData()

  // User has disabled prompts
  if (data.disabled) return false

  // Check if user has been active for minimum days
  const firstUse = new Date(data.firstUseDate)
  const today = new Date()
  const daysSinceFirstUse = Math.floor((today - firstUse) / (1000 * 60 * 60 * 24))
  if (daysSinceFirstUse < MIN_ACTIVE_DAYS) return false

  // Check cooldown period
  if (data.lastShown) {
    const lastShown = new Date(data.lastShown)
    const daysSinceShown = Math.floor((today - lastShown) / (1000 * 60 * 60 * 24))
    if (daysSinceShown < COOLDOWN_DAYS) return false
  }

  return true
}

export function markRatingShown() {
  const data = getRatingData()
  data.lastShown = new Date().toISOString()
  saveRatingData(data)
}

export function isRatingDisabled() {
  return getRatingData().disabled
}

export function setRatingDisabled(disabled) {
  const data = getRatingData()
  data.disabled = disabled
  saveRatingData(data)
}

function RatingPrompt({ isOpen, onClose, onOpenFeedback }) {
  const [step, setStep] = useState('initial') // 'initial', 'form', 'followup', 'thanks'
  const [selectedQuestion, setSelectedQuestion] = useState('helping')
  const [response, setResponse] = useState(null) // 'yes', 'sometimes', 'not-yet'
  const [comments, setComments] = useState('')
  const [logAsPractice, setLogAsPractice] = useState(true)
  const [practiceLogged, setPracticeLogged] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStep('initial')
      setSelectedQuestion('helping')
      setResponse(null)
      setComments('')
      setLogAsPractice(true)
      setPracticeLogged(false)
    }
  }, [isOpen])

  function handleResponse(resp) {
    setResponse(resp)
    setStep('form')
  }

  async function handleSubmitForm() {
    setSaving(true)

    // Save response to rating data
    const data = getRatingData()
    data.responses.push({
      date: new Date().toISOString(),
      question: selectedQuestion,
      response,
      hasComments: !!comments.trim()
    })
    data.lastResponse = response
    saveRatingData(data)

    // If logging as practice and has comments, save to journal
    if (logAsPractice && comments.trim()) {
      try {
        const today = getLocalDateString()
        await db.add('journal', {
          type: 'reflection',
          title: `Reflection: ${REFLECTION_QUESTIONS.find(q => q.id === selectedQuestion)?.text}`,
          content: comments.trim(),
          date: today,
          tags: ['app-feedback', 'reflection']
        })

        // Log Integration Journaling as today's practice
        const todayLog = await queries.getTodayLog()

        if (todayLog) {
          if (!todayLog.practices?.includes('journaling')) {
            await db.update('dailyLogs', {
              ...todayLog,
              practices: [...(todayLog.practices || []), 'journaling']
            })
          }
        } else {
          await db.add('dailyLogs', {
            date: today,
            practices: ['journaling'],
            notes: ''
          })
        }

        setPracticeLogged(true)
      } catch (error) {
        console.error('Error saving journal entry:', error)
      }
    }

    setSaving(false)
    setStep('followup')
  }

  async function handleShare() {
    const shareData = {
      title: 'Sanctum',
      text: 'A sacred space for spiritual practice tracking',
      url: 'https://sanctum-pwa-app.netlify.app'
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareData.url)
          alert('Link copied to clipboard!')
        } catch {
          // Ignore
        }
      }
    }

    showThanks()
  }

  function handleWhisperToOracle() {
    onClose()
    onOpenFeedback()
  }

  function showThanks() {
    setStep('thanks')
    setTimeout(() => {
      onClose()
    }, 2500)
  }

  function handleDismiss() {
    // Still mark as shown to respect cooldown
    markRatingShown()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="rating-overlay" onClick={handleDismiss}>
      <div className="rating-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rating-close" onClick={handleDismiss} aria-label="Close">
          ×
        </button>

        {step === 'initial' && (
          <div className="rating-initial">
            <h2 className="rating-question">Is this helping?</h2>
            <p className="rating-subtext">A moment of honest reflection</p>

            <div className="rating-options">
              <button
                className="rating-option rating-option--yes"
                onClick={() => handleResponse('yes')}
              >
                Yes
              </button>
              <button
                className="rating-option rating-option--sometimes"
                onClick={() => handleResponse('sometimes')}
              >
                Sometimes
              </button>
              <button
                className="rating-option rating-option--not-yet"
                onClick={() => handleResponse('not-yet')}
              >
                Not yet
              </button>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div className="rating-form">
            <h2 className="rating-form-title">
              {response === 'yes' ? 'Wonderful!' : 'Thank you for sharing'}
            </h2>

            <div className="form-group">
              <label className="form-label">Reflect on:</label>
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                className="input"
              >
                {REFLECTION_QUESTIONS.map(q => (
                  <option key={q.id} value={q.id}>{q.text}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Share more if you'd like...</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Your thoughts, experiences, or suggestions..."
                className="input rating-textarea"
                rows={4}
              />
            </div>

            {comments.trim() && (
              <label className="practice-checkbox">
                <input
                  type="checkbox"
                  checked={logAsPractice}
                  onChange={(e) => setLogAsPractice(e.target.checked)}
                />
                <span>Count this as today's Integration Journaling practice</span>
              </label>
            )}

            {comments.trim() && (
              <p className="practice-hint">Your reflection is practice</p>
            )}

            <div className="rating-form-actions">
              <button
                className="btn btn-primary"
                onClick={handleSubmitForm}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {step === 'followup' && (
          <div className="rating-followup">
            {practiceLogged && (
              <div className="practice-logged-badge">
                Practice logged ✓
              </div>
            )}

            {response === 'yes' ? (
              <>
                <h2 className="followup-title">We're grateful.</h2>
                <p className="followup-text">Tell others?</p>
                <div className="followup-actions">
                  <button className="btn btn-primary" onClick={handleShare}>
                    Share Sanctum
                  </button>
                  <button className="btn btn-secondary" onClick={showThanks}>
                    Maybe Later
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="followup-title">What's missing?</h2>
                <p className="followup-text">We'd love to hear more</p>
                <div className="followup-actions">
                  <button className="btn btn-primary" onClick={handleWhisperToOracle}>
                    Whisper to Oracle
                  </button>
                  <button className="btn btn-secondary" onClick={showThanks}>
                    Not Now
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 'thanks' && (
          <div className="rating-thanks">
            <div className="thanks-icon">✦</div>
            <h2 className="thanks-title">Thank you for your honesty.</h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default RatingPrompt
