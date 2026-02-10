import { useState } from 'react'
import { saveStreakSettings, markAskedLater } from '../utils/streakSettings'
import './StreakOptInModal.css'

function StreakOptInModal({ isOpen, onClose, currentStreak = 0 }) {
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  function handleChoice(enabled) {
    setSaving(true)
    saveStreakSettings({ enabled })

    // Brief delay for visual feedback
    setTimeout(() => {
      setSaving(false)
      onClose(enabled)
    }, 200)
  }

  function handleLater() {
    markAskedLater()
    onClose(null)
  }

  return (
    <div className="streak-modal-overlay" onClick={handleLater}>
      <div className="streak-modal" onClick={e => e.stopPropagation()}>
        <div className="streak-modal-header">
          <h2>Track your consistency?</h2>
          <p className="streak-modal-subtitle">
            Choose how you'd like to see your progress
          </p>
        </div>

        <div className="streak-modal-body">
          <p className="streak-modal-description">
            Some practitioners find streak tracking motivating.
            Others find it creates unhelpful pressure.
            <br />
            <strong>There's no wrong answer.</strong>
          </p>

          <div className="streak-options">
            <button
              className="streak-option streak-option--enabled"
              onClick={() => handleChoice(true)}
              disabled={saving}
            >
              <div className="streak-option-icon">🔥</div>
              <div className="streak-option-content">
                <span className="streak-option-title">Yes, show my streak</span>
                <span className="streak-option-preview">
                  {currentStreak > 0 ? `Current: ${currentStreak} days` : 'Track consecutive days'}
                </span>
              </div>
            </button>

            <button
              className="streak-option streak-option--disabled"
              onClick={() => handleChoice(false)}
              disabled={saving}
            >
              <div className="streak-option-icon">✓</div>
              <div className="streak-option-content">
                <span className="streak-option-title">No, just show completion</span>
                <span className="streak-option-preview">Today: ✓ or ○</span>
              </div>
            </button>
          </div>
        </div>

        <div className="streak-modal-footer">
          <button
            className="streak-later-btn"
            onClick={handleLater}
            disabled={saving}
          >
            Ask me later
          </button>
          <p className="streak-modal-note">
            You can change this anytime in Settings
          </p>
        </div>
      </div>
    </div>
  )
}

export default StreakOptInModal
