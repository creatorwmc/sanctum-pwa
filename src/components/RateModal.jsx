import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../config/emailjs'
import './RateModal.css'

const STORAGE_KEY = 'sanctum-user-rating'

function RateModal({ isOpen, onClose }) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  async function handleRate(stars) {
    setRating(stars)
    setSubmitted(true)

    // Store locally
    const ratingData = {
      stars,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratingData))

    // Try EmailJS if configured
    if (EMAILJS_CONFIG.ENABLED) {
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            to_email: 'creatorwmc@gmail.com',
            from_name: 'App Rating',
            section: 'Rating',
            message: `${stars} star${stars !== 1 ? 's' : ''} ${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}`,
            timestamp: new Date().toLocaleString(),
            user_agent: navigator.userAgent
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        )
        console.log('Rating email sent via EmailJS')
      } catch (err) {
        console.error('EmailJS rating error:', err)
      }
    } else {
      // Fallback to Netlify Forms
      const formData = {
        'form-name': 'app-rating',
        rating: stars,
        timestamp: ratingData.timestamp,
        userAgent: navigator.userAgent,
        platform: navigator.platform || 'unknown',
        language: navigator.language || 'unknown'
      }

      const encode = (data) => {
        return Object.keys(data)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
          .join('&')
      }

      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode(formData)
        })
      } catch (err) {
        console.error('Rating submission error:', err)
      }
    }

    // Auto-dismiss
    setTimeout(() => {
      handleClose()
    }, 1000)
  }

  function handleClose() {
    setRating(0)
    setHoveredRating(0)
    setSubmitted(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="rate-overlay" onClick={handleClose}>
      <div className="rate-modal" onClick={(e) => e.stopPropagation()}>
        {!submitted ? (
          <>
            <h2 className="rate-title">Rate This App</h2>
            <div className="rate-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`rate-star ${(hoveredRating || rating) >= star ? 'rate-star--filled' : ''}`}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`Rate ${star} stars`}
                >
                  {(hoveredRating || rating) >= star ? '★' : '☆'}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="rate-thanks">
            <span className="rate-thanks-icon">✦</span>
            <p>Thank you.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RateModal
