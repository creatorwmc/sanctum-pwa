import { useState } from 'react'
import { db } from '../db'
import StoneIcon from './StoneIcon'
import './FeedbackModal.css'

const FEEDBACK_CATEGORIES = [
  { id: '', label: 'Select a section (optional)' },
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
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [section, setSection] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return

    setSaving(true)
    setError('')

    const timestamp = new Date().toISOString()
    const formData = {
      'form-name': 'oracle-whisper',
      name: name.trim() || 'Anonymous',
      message: message.trim(),
      section: section || 'general',
      timestamp
    }

    // Encode form data for submission
    const encode = (data) => {
      return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&')
    }

    let netlifySuccess = false

    try {
      // Submit to Netlify Forms
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(formData)
      })

      netlifySuccess = response.ok
    } catch (err) {
      console.error('Netlify submission error:', err)
    }

    // Always save locally as backup
    try {
      await db.add('feedback', {
        name: name.trim() || 'Anonymous',
        message: message.trim(),
        section: section || 'general',
        timestamp,
        userAgent: navigator.userAgent,
        sentToNetlify: netlifySuccess
      })
    } catch (err) {
      console.error('Local save error:', err)
    }

    // Show success even if Netlify failed (we have local backup)
    setSubmitted(true)
    setTimeout(() => {
      handleClose()
    }, 4000)
    setSaving(false)
  }

  function handleClose() {
    setName('')
    setMessage('')
    setSection('')
    setSubmitted(false)
    setError('')
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
          <div className="feedback-icon">
            <StoneIcon size={48} />
          </div>
          <h2>Whisper to the Oracle</h2>
          <p className="feedback-subtitle">Speak freely - this reaches willing ears.</p>
        </div>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="feedback-form"
            name="oracle-whisper"
            data-netlify="true"
          >
            <input type="hidden" name="form-name" value="oracle-whisper" />

            <div className="form-group">
              <label htmlFor="feedback-name">Your name (optional)</label>
              <input
                type="text"
                id="feedback-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="feedback-section">What section does this relate to?</label>
              <select
                id="feedback-section"
                name="section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
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
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report an issue..."
                className="input feedback-textarea"
                rows={5}
                required
              />
            </div>

            <input type="hidden" name="timestamp" value={new Date().toISOString()} />

            {error && <p className="feedback-error">{error}</p>}

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
