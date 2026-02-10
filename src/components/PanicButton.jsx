import { useState } from 'react'
import { usePrivacy, PRIVACY_MODES } from '../contexts/PrivacyContext'
import './PanicButton.css'

function PanicButton() {
  const { mode, panicWipe } = usePrivacy()
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  // Only show in privacy modes
  if (mode === PRIVACY_MODES.normal) return null

  function handlePanicClick() {
    setShowConfirm(true)
  }

  function handleConfirm() {
    if (confirmText === 'DELETE') {
      panicWipe()
    }
  }

  function handleCancel() {
    setShowConfirm(false)
    setConfirmText('')
  }

  return (
    <>
      <button
        className="panic-button"
        onClick={handlePanicClick}
        aria-label="Emergency data wipe"
        title="Panic Button - Delete all data"
      >
        <span className="panic-button-icon">!</span>
      </button>

      {showConfirm && (
        <div className="panic-modal-overlay" onClick={handleCancel}>
          <div className="panic-modal" onClick={e => e.stopPropagation()}>
            <div className="panic-modal-header">
              <span className="panic-warning-icon">!</span>
              <h2>Emergency Data Wipe</h2>
            </div>

            <div className="panic-modal-body">
              <p className="panic-warning-text">
                This will <strong>permanently delete ALL your data</strong> from this device:
              </p>
              <ul className="panic-list">
                <li>Practice logs and history</li>
                <li>Journal entries</li>
                <li>Meditation sessions</li>
                <li>All settings and preferences</li>
              </ul>
              <p className="panic-warning-text">
                <strong>This cannot be undone.</strong>
              </p>

              <div className="panic-confirm-input-wrapper">
                <label>Type <strong>DELETE</strong> to confirm:</label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="DELETE"
                  className="panic-confirm-input"
                  autoFocus
                />
              </div>
            </div>

            <div className="panic-modal-footer">
              <button
                className="panic-wipe-btn"
                onClick={handleConfirm}
                disabled={confirmText !== 'DELETE'}
              >
                Wipe All Data Now
              </button>
              <button
                className="panic-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PanicButton
