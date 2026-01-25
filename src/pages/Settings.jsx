import { useState } from 'react'
import { db } from '../db'
import FeedbackModal from '../components/FeedbackModal'
import StoneIcon from '../components/StoneIcon'
import './Settings.css'

function Settings() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [exportStatus, setExportStatus] = useState('')

  async function handleExportData() {
    setExportStatus('Exporting...')
    try {
      const data = {
        exportDate: new Date().toISOString(),
        version: '1.0',
        sessions: await db.getAll('sessions'),
        documents: await db.getAll('documents'),
        links: await db.getAll('links'),
        dailyLogs: await db.getAll('dailyLogs'),
        ceremonies: await db.getAll('ceremonies'),
        journal: await db.getAll('journal')
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sanctum-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportStatus('Export complete!')
      setTimeout(() => setExportStatus(''), 3000)
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('Export failed')
    }
  }

  return (
    <div className="settings-page">
      <section className="settings-section">
        <h2 className="settings-section-title">Preferences</h2>
        <div className="settings-list">
          <div className="settings-item settings-item--disabled">
            <div className="settings-item-content">
              <span className="settings-item-icon">👤</span>
              <div>
                <span className="settings-item-label">Profile</span>
                <span className="settings-item-desc">Coming soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Data</h2>
        <div className="settings-list">
          <button className="settings-item" onClick={handleExportData}>
            <div className="settings-item-content">
              <span className="settings-item-icon">📦</span>
              <div>
                <span className="settings-item-label">Export Backup</span>
                <span className="settings-item-desc">
                  {exportStatus || 'Download all your data as JSON'}
                </span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Get Help</h2>
        <div className="settings-list">
          <div className="settings-item settings-item--disabled">
            <div className="settings-item-content">
              <span className="settings-item-icon">📜</span>
              <div>
                <span className="settings-item-label">App Guide</span>
                <span className="settings-item-desc">Coming soon</span>
              </div>
            </div>
          </div>

          <button className="settings-item" onClick={() => setFeedbackOpen(true)}>
            <div className="settings-item-content">
              <span className="settings-item-icon"><StoneIcon size={20} glow={false} /></span>
              <div>
                <span className="settings-item-label">Whisper to the Oracle</span>
                <span className="settings-item-desc">Send feedback or suggestions</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">About</h2>
        <div className="settings-list">
          <div className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">🌳</span>
              <div>
                <span className="settings-item-label">Sanctum</span>
                <span className="settings-item-desc">Version 1.0.0</span>
              </div>
            </div>
          </div>
        </div>
        <p className="settings-footer">
          A sacred space for spiritual practice tracking.
          <br />
          Your data stays local on your device.
        </p>
      </section>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  )
}

export default Settings
