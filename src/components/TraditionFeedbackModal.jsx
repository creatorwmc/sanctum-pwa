import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { submitTraditionFeedback } from '../services/adminService'
import './TraditionFeedbackModal.css'

const FEEDBACK_TYPES = [
  { id: 'practice', label: 'Practice Description' },
  { id: 'prompt', label: 'Journaling Prompt' },
  { id: 'calendar', label: 'Calendar / Holy Day' },
  { id: 'terminology', label: 'Terminology' },
  { id: 'missing', label: 'Missing Content' },
  { id: 'accuracy', label: 'Accuracy Issue' },
  { id: 'other', label: 'Other' }
]

function TraditionFeedbackModal({
  isOpen,
  onClose,
  traditionId,
  traditionName,
  contentType = null,
  contentId = null,
  contentText = null
}) {
  const { user } = useAuth()
  const [type, setType] = useState(contentType || '')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return

    setSaving(true)
    setError('')

    try {
      const result = await submitTraditionFeedback({
        traditionId,
        traditionName,
        contentType: type,
        contentId,
        contentText,
        message: message.trim(),
        userId: user?.uid || null,
        userEmail: user?.email || null,
        userDisplayName: user?.displayName || null
      })

      if (result.success) {
        setSubmitted(true)
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setError(result.error || 'Failed to submit feedback')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setSubmitted(false)
    setMessage('')
    setType(contentType || '')
    setError('')
    onClose()
  }

  return (
    <div className="tradition-feedback-overlay" onClick={handleClose}>
      <div className="tradition-feedback-modal" onClick={e => e.stopPropagation()}>
        <button className="tradition-feedback-close" onClick={handleClose}>
          &times;
        </button>

        <div className="tradition-feedback-header">
          <h2>Suggest Improvement</h2>
          <p className="tradition-feedback-subtitle">
            Help us improve {traditionName || 'tradition'} content
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="tradition-feedback-form">
            {contentText && (
              <div className="tradition-feedback-context">
                <label>Regarding:</label>
                <blockquote>{contentText}</blockquote>
              </div>
            )}

            <div className="tradition-feedback-field">
              <label>Feedback Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                required
              >
                <option value="">Select type...</option>
                {FEEDBACK_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="tradition-feedback-field">
              <label>Your Suggestion</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe the issue or suggest an improvement..."
                rows={4}
                required
              />
            </div>

            {error && (
              <div className="tradition-feedback-error">{error}</div>
            )}

            <div className="tradition-feedback-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !message.trim() || !type}
              >
                {saving ? 'Sending...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>

            <p className="tradition-feedback-note">
              Your feedback helps us serve practitioners better.
              {!user && ' Sign in to track your submissions.'}
            </p>
          </form>
        ) : (
          <div className="tradition-feedback-success">
            <div className="success-icon">✓</div>
            <h3>Thank you!</h3>
            <p>Your feedback has been submitted and will be reviewed.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TraditionFeedbackModal
