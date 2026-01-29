import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import { EMAILJS_CONFIG } from '../config/emailjs'
import { submitWhisper } from '../services/adminService'
import { useAuth } from '../contexts/AuthContext'
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
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [section, setSection] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [logAsPractice, setLogAsPractice] = useState(true)
  const [practiceLogged, setPracticeLogged] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return

    setSaving(true)
    setError('')

    const timestamp = new Date().toISOString()
    const senderName = name.trim() || 'Anonymous'
    const sectionName = section || 'general'

    let emailSent = false
    let firebaseSent = false

    // Try Firebase first (primary method now)
    try {
      const result = await submitWhisper({
        name: senderName,
        message: message.trim(),
        section: sectionName,
        userEmail: user?.email || null,
        userId: user?.uid || null,
        userName: user?.displayName || null,
        userAgent: navigator.userAgent
      })
      firebaseSent = result.success
    } catch (err) {
      console.error('Firebase whisper error:', err)
    }

    // Try EmailJS as backup if configured
    if (EMAILJS_CONFIG.ENABLED) {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            to_email: 'creatorwmc@gmail.com',
            from_name: senderName,
            section: sectionName,
            message: message.trim(),
            timestamp: new Date().toLocaleString(),
            user_agent: navigator.userAgent
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        )
        emailSent = true
      } catch (err) {
        console.error('EmailJS error:', err)
      }
    }

    // Fallback to Netlify Forms
    if (!emailSent) {
      const formData = {
        'form-name': 'oracle-whisper',
        name: senderName,
        message: message.trim(),
        section: sectionName,
        timestamp
      }

      const encode = (data) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
          .join('&')
      }

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode(formData)
        })
        emailSent = response.ok
      } catch (err) {
        console.error('Netlify submission error:', err)
      }
    }

    // Always save locally as backup
    try {
      await db.add('feedback', {
        name: senderName,
        message: message.trim(),
        section: sectionName,
        timestamp,
        userAgent: navigator.userAgent,
        emailSent
      })
    } catch (err) {
      console.error('Local save error:', err)
    }

    // If logging as practice, save to journal and daily log
    if (logAsPractice && message.trim()) {
      try {
        // Save to journal
        const today = getLocalDateString()
        await db.add('journal', {
          type: 'reflection',
          title: 'Feedback to Oracle',
          content: message.trim(),
          date: today,
          tags: ['feedback-to-oracle', 'reflection']
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
      } catch (err) {
        console.error('Error logging practice:', err)
      }
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
    setLogAsPractice(true)
    setPracticeLogged(false)
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
          <p className="feedback-subtitle">Speak freely - this reaches open ears.</p>
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

            {message.trim() && (
              <label className="feedback-practice-checkbox">
                <input
                  type="checkbox"
                  checked={logAsPractice}
                  onChange={(e) => setLogAsPractice(e.target.checked)}
                />
                <span>Count this as today's Integration Journaling practice</span>
              </label>
            )}

            {message.trim() && (
              <p className="feedback-practice-hint">Your reflection is practice</p>
            )}

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
            {practiceLogged && (
              <div className="practice-logged-badge">Practice logged ✓</div>
            )}
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
