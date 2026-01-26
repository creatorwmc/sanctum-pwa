import { useState } from 'react'
import {
  isGoogleDriveConfigured,
  isConnected,
  connectGoogleDrive,
  uploadToGoogleDrive,
  getMimeType
} from '../services/googleDrive'
import { downloadFile } from '../utils/exportUtils'
import './ExportModal.css'

function ExportModal({ isOpen, onClose, content, filename, title = 'Export' }) {
  const [status, setStatus] = useState('idle') // idle, connecting, uploading, success, error
  const [driveLink, setDriveLink] = useState(null)
  const [error, setError] = useState('')

  const driveConfigured = isGoogleDriveConfigured()
  const driveConnected = isConnected()

  function handleDownload() {
    const mimeType = getMimeType(filename)
    downloadFile(content, filename, mimeType)
    onClose()
  }

  async function handleConnectDrive() {
    setStatus('connecting')
    setError('')

    try {
      await connectGoogleDrive()
      setStatus('idle')
    } catch (err) {
      console.error('Failed to connect:', err)
      setError('Failed to connect to Google Drive')
      setStatus('error')
    }
  }

  async function handleSaveToDrive() {
    setStatus('uploading')
    setError('')

    try {
      if (!isConnected()) {
        await connectGoogleDrive()
      }

      const mimeType = getMimeType(filename)
      const result = await uploadToGoogleDrive(content, filename, mimeType)

      setDriveLink(result.webViewLink)
      setStatus('success')
    } catch (err) {
      console.error('Failed to upload:', err)
      setError(err.message || 'Failed to save to Google Drive')
      setStatus('error')
    }
  }

  function handleClose() {
    setStatus('idle')
    setDriveLink(null)
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="export-overlay" onClick={handleClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <button className="export-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <div className="export-header">
          <h2>{title}</h2>
          <p className="export-filename">{filename}</p>
        </div>

        {status === 'success' ? (
          <div className="export-success">
            <div className="success-icon">✓</div>
            <p>Saved to Google Drive</p>
            {driveLink && (
              <a
                href={driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open in Drive
              </a>
            )}
            <button className="btn btn-secondary" onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <div className="export-options">
            {error && <p className="export-error">{error}</p>}

            <button
              className="export-option"
              onClick={handleDownload}
              disabled={status !== 'idle'}
            >
              <span className="export-option-icon">⬇</span>
              <div className="export-option-text">
                <span className="export-option-title">Download to Device</span>
                <span className="export-option-desc">Save file directly to your device</span>
              </div>
            </button>

            {driveConfigured ? (
              driveConnected ? (
                <button
                  className="export-option"
                  onClick={handleSaveToDrive}
                  disabled={status !== 'idle'}
                >
                  <span className="export-option-icon">
                    {status === 'uploading' ? '⏳' : '☁'}
                  </span>
                  <div className="export-option-text">
                    <span className="export-option-title">
                      {status === 'uploading' ? 'Uploading...' : 'Save to Google Drive'}
                    </span>
                    <span className="export-option-desc">Save to Sanctum Exports folder</span>
                  </div>
                </button>
              ) : (
                <button
                  className="export-option export-option--connect"
                  onClick={handleConnectDrive}
                  disabled={status !== 'idle'}
                >
                  <span className="export-option-icon">
                    {status === 'connecting' ? '⏳' : '🔗'}
                  </span>
                  <div className="export-option-text">
                    <span className="export-option-title">
                      {status === 'connecting' ? 'Connecting...' : 'Connect Google Drive'}
                    </span>
                    <span className="export-option-desc">Enable cloud backup</span>
                  </div>
                </button>
              )
            ) : (
              <div className="export-option export-option--disabled">
                <span className="export-option-icon">☁</span>
                <div className="export-option-text">
                  <span className="export-option-title">Google Drive</span>
                  <span className="export-option-desc">Not configured</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExportModal
