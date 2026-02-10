import { useState, useEffect } from 'react'
import './DataPrivacyBanner.css'

const STORAGE_KEY = 'sanctum-privacy-banner-dismissed'

function DataPrivacyBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (!dismissed) {
      // Small delay to let the app load first
      const timer = setTimeout(() => {
        setShow(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="privacy-banner">
      <div className="privacy-banner-content">
        <div className="privacy-banner-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div className="privacy-banner-text">
          <strong>Your data stays on your device</strong>
          <span className="privacy-banner-subtext">
            All practice data is stored locally. Cloud sync is optional and off by default.
          </span>
        </div>
        <button
          className="privacy-banner-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss privacy notice"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default DataPrivacyBanner
