import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './SecurityAnswerBanner.css'

function SecurityAnswerBanner() {
  const { user, checkSecurityAnswerExists, saveSecurityAnswer } = useAuth()
  const [showBanner, setShowBanner] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function checkAnswer() {
      if (user) {
        // Check if already dismissed this session
        const dismissed = sessionStorage.getItem('security_banner_dismissed')
        if (dismissed) {
          return
        }

        const hasAnswer = await checkSecurityAnswerExists(user.uid)
        if (!hasAnswer) {
          setShowBanner(true)
        }
      }
    }
    checkAnswer()
  }, [user, checkSecurityAnswerExists])

  const handleDismiss = () => {
    sessionStorage.setItem('security_banner_dismissed', 'true')
    setShowBanner(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!answer.trim()) {
      setError('Please enter an answer')
      return
    }

    try {
      setLoading(true)
      await saveSecurityAnswer(user.uid, answer.trim(), user.email)
      setShowBanner(false)
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!showBanner) return null

  return (
    <div className="security-banner">
      {!showForm ? (
        <div className="security-banner-content">
          <div className="security-banner-text">
            <strong>Set up password recovery</strong>
            <span>Add a security question so you can reset your password if you forget it.</span>
          </div>
          <div className="security-banner-actions">
            <button
              onClick={() => setShowForm(true)}
              className="security-banner-btn primary"
            >
              Set up
            </button>
            <button
              onClick={handleDismiss}
              className="security-banner-btn secondary"
            >
              Later
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="security-banner-form">
          <label htmlFor="banner-security">What is your favorite color?</label>
          <div className="security-banner-input-row">
            <input
              type="text"
              id="banner-security"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={loading}
              className="security-banner-btn primary"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="security-banner-btn secondary"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
          {error && <p className="security-banner-error">{error}</p>}
        </form>
      )}
    </div>
  )
}

export default SecurityAnswerBanner
