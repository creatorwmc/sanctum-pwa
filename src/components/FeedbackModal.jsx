import { useState } from 'react'
import { db } from '../db'
import './FeedbackModal.css'

const FEEDBACK_CATEGORIES = [
  { id: '', label: 'Select a topic (optional)' },
  { id: 'timer', label: 'Meditation Timer' },
  { id: 'daily', label: 'Practice Tracking' },
  { id: 'journal', label: 'Integration Journal' },
  { id: 'library', label: 'Document Library' },
  { id: 'links', label: 'Research Links' },
  { id: 'calendar', label: 'Ceremonial Calendar' },
  { id: 'design', label: 'Design & Theme' },
  { id: 'feature', label: 'Feature Request' },
  { id: 'bug', label: 'Something Broken' },
  { id: 'other', label: 'Other' }
]

function FeedbackModal({ isOpen, onClose }) {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return

    setSaving(true)
    try {
      // Save feedback locally
      await db.add('feedback', {
        message: message.trim(),
        category: category || 'general',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })

      setSubmitted(true)
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (error) {
      console.error('Error saving feedback:', error)
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setMessage('')
    setCategory('')
    setSubmitted(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="feedback-overlay" onClick={handleClose}>
      <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
        <button className="feedback-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <div className="feedback-header">
          <h2>Whisper to the Oracle</h2>
          <p className="feedback-subtitle">Your words travel beyond the veil</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="form-group">
              <label htmlFor="feedback-category">What does this relate to?</label>
              <select
                id="feedback-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
              >
                {FEEDBACK_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="feedback-message">Your message</label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report an issue..."
                className="input feedback-textarea"
                rows={5}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!message.trim() || saving}
              className="btn btn-primary feedback-submit"
            >
              {saving ? 'Sending...' : 'Send Whisper'}
            </button>
          </form>
        ) : (
          <div className="feedback-success">
            <div className="success-icon">✦</div>
            <p className="success-message">
              Your whisper has been carried across the threshold.
            </p>
            <p className="success-submessage">The Oracle listens.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedbackModal
