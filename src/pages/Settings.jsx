import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import FeedbackModal from '../components/FeedbackModal'
import ExportModal from '../components/ExportModal'
import StoneIcon from '../components/StoneIcon'
import AccountSettings from '../components/AccountSettings'
import AuthModal from '../components/AuthModal'
import BackgroundSettings from '../components/BackgroundSettings'
import { isRatingDisabled, setRatingDisabled } from '../components/RatingPrompt'
import { useOnboarding } from '../contexts/OnboardingContext'
import { isFeatureEnabled } from '../config/featureFlags'
import TraditionSettings from '../components/TraditionSettings'
import {
  isGoogleDriveConfigured,
  isConnected,
  connectGoogleDrive,
  disconnectGoogleDrive
} from '../services/googleDrive'
import {
  generateFilename,
  allJournalEntriesToMarkdown,
  sessionsToCSV,
  practiceLogsToCSV,
  exportAllToJSON
} from '../utils/exportUtils'
import './Settings.css'

function Settings() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [driveConnected, setDriveConnected] = useState(false)
  const [driveConfigured] = useState(isGoogleDriveConfigured())
  const [connecting, setConnecting] = useState(false)
  const [feedbackPromptsEnabled, setFeedbackPromptsEnabled] = useState(!isRatingDisabled())
  const { resetOnboarding, getConfiguration } = useOnboarding()
  const config = getConfiguration()

  // Export modal state
  const [exportModal, setExportModal] = useState({
    isOpen: false,
    content: '',
    filename: '',
    title: ''
  })

  // Check Drive connection status
  useEffect(() => {
    setDriveConnected(isConnected())
  }, [])

  async function handleConnectDrive() {
    setConnecting(true)
    try {
      await connectGoogleDrive()
      setDriveConnected(true)
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setConnecting(false)
    }
  }

  function handleDisconnectDrive() {
    disconnectGoogleDrive()
    setDriveConnected(false)
  }

  async function handleExportJournal() {
    const entries = await db.getAll('journal')
    if (entries.length === 0) {
      alert('No journal entries to export')
      return
    }

    const content = allJournalEntriesToMarkdown(entries)
    setExportModal({
      isOpen: true,
      content,
      filename: generateFilename('Journal', 'md'),
      title: 'Export Journal'
    })
  }

  async function handleExportMeditation() {
    const sessions = await db.getAll('sessions')
    if (sessions.length === 0) {
      alert('No meditation sessions to export')
      return
    }

    const content = sessionsToCSV(sessions)
    setExportModal({
      isOpen: true,
      content,
      filename: generateFilename('Meditation_History', 'csv'),
      title: 'Export Meditation History'
    })
  }

  async function handleExportPractice() {
    const logs = await db.getAll('dailyLogs')
    if (logs.length === 0) {
      alert('No practice logs to export')
      return
    }

    const content = practiceLogsToCSV(logs)
    setExportModal({
      isOpen: true,
      content,
      filename: generateFilename('Practice_History', 'csv'),
      title: 'Export Practice History'
    })
  }

  async function handleExportAll() {
    const data = {
      sessions: await db.getAll('sessions'),
      documents: await db.getAll('documents'),
      links: await db.getAll('links'),
      dailyLogs: await db.getAll('dailyLogs'),
      ceremonies: await db.getAll('ceremonies'),
      journal: await db.getAll('journal')
    }

    const content = exportAllToJSON(data)
    setExportModal({
      isOpen: true,
      content,
      filename: generateFilename('Complete_Backup', 'json'),
      title: 'Export Everything'
    })
  }

  function closeExportModal() {
    setExportModal({ isOpen: false, content: '', filename: '', title: '' })
  }

  function handleToggleFeedbackPrompts() {
    const newValue = !feedbackPromptsEnabled
    setFeedbackPromptsEnabled(newValue)
    setRatingDisabled(!newValue)
  }

  return (
    <div className="settings-page">
      <section className="settings-section">
        <h2 className="settings-section-title">Account & Sync</h2>
        <AccountSettings onSignInClick={() => setAuthModalOpen(true)} />
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Background Theme</h2>
        <BackgroundSettings />
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Spiritual Tradition</h2>
        <TraditionSettings />
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Daily Practice</h2>
        <div className="settings-list">
          <Link to="/practices" className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">🧘</span>
              <div>
                <span className="settings-item-label">Manage Practices</span>
                <span className="settings-item-desc">Add, edit, or remove daily practices</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </Link>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Export & Backup</h2>
        <div className="settings-list">
          <button className="settings-item" onClick={handleExportJournal}>
            <div className="settings-item-content">
              <span className="settings-item-icon">✎</span>
              <div>
                <span className="settings-item-label">Export Journal</span>
                <span className="settings-item-desc">All entries as Markdown</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </button>

          <button className="settings-item" onClick={handleExportMeditation}>
            <div className="settings-item-content">
              <span className="settings-item-icon">◷</span>
              <div>
                <span className="settings-item-label">Export Meditation History</span>
                <span className="settings-item-desc">All sessions as CSV</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </button>

          <button className="settings-item" onClick={handleExportPractice}>
            <div className="settings-item-content">
              <span className="settings-item-icon">☀</span>
              <div>
                <span className="settings-item-label">Export Practice History</span>
                <span className="settings-item-desc">Daily logs as CSV</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </button>

          <button className="settings-item settings-item--primary" onClick={handleExportAll}>
            <div className="settings-item-content">
              <span className="settings-item-icon">📦</span>
              <div>
                <span className="settings-item-label">Export Everything</span>
                <span className="settings-item-desc">Complete backup as JSON</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </button>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Cloud Backup</h2>
        <div className="settings-list">
          {driveConfigured ? (
            driveConnected ? (
              <>
                <div className="settings-item settings-item--connected">
                  <div className="settings-item-content">
                    <span className="settings-item-icon">☁</span>
                    <div>
                      <span className="settings-item-label">Google Drive Connected</span>
                      <span className="settings-item-desc settings-item-desc--success">
                        Exports will save to Practice Space Exports folder
                      </span>
                    </div>
                  </div>
                  <span className="settings-item-status">✓</span>
                </div>
                <button className="settings-item" onClick={handleDisconnectDrive}>
                  <div className="settings-item-content">
                    <span className="settings-item-icon">🔗</span>
                    <div>
                      <span className="settings-item-label">Disconnect Google Drive</span>
                      <span className="settings-item-desc">Remove cloud backup access</span>
                    </div>
                  </div>
                </button>
              </>
            ) : (
              <button
                className="settings-item"
                onClick={handleConnectDrive}
                disabled={connecting}
              >
                <div className="settings-item-content">
                  <span className="settings-item-icon">{connecting ? '⏳' : '☁'}</span>
                  <div>
                    <span className="settings-item-label">
                      {connecting ? 'Connecting...' : 'Connect Google Drive'}
                    </span>
                    <span className="settings-item-desc">Enable cloud backup for exports</span>
                  </div>
                </div>
                <span className="settings-item-arrow">→</span>
              </button>
            )
          ) : (
            <div className="settings-item settings-item--disabled">
              <div className="settings-item-content">
                <span className="settings-item-icon">☁</span>
                <div>
                  <span className="settings-item-label">Google Drive</span>
                  <span className="settings-item-desc">Not configured for this deployment</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Preferences</h2>
        <div className="settings-list">
          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">💭</span>
              <div>
                <span className="settings-item-label">Reflection Prompts</span>
                <span className="settings-item-desc">
                  Occasional "Is this helping?" check-ins
                </span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={feedbackPromptsEnabled}
                onChange={handleToggleFeedbackPrompts}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h2 className="settings-section-title">Get Help</h2>
        <div className="settings-list">
          <Link to="/guide" className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">📜</span>
              <div>
                <span className="settings-item-label">App Guide</span>
                <span className="settings-item-desc">Learn how to use Practice Space</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </Link>

          <Link to="/guide/druid" className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">🌳</span>
              <div>
                <span className="settings-item-label">Druid Practice Guide</span>
                <span className="settings-item-desc">Traditional Druidry teachings</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </Link>

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

      {isFeatureEnabled('HELPER_SYSTEM_ENABLED') && (
        <section className="settings-section">
          <h2 className="settings-section-title">Personalization</h2>
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-content">
                <span className="settings-item-icon">🎨</span>
                <div>
                  <span className="settings-item-label">Style: {config.personality || 'Not set'}</span>
                  <span className="settings-item-desc">Your visual personality preference</span>
                </div>
              </div>
            </div>
            <button className="settings-item" onClick={resetOnboarding}>
              <div className="settings-item-content">
                <span className="settings-item-icon">↺</span>
                <div>
                  <span className="settings-item-label">Redo Onboarding</span>
                  <span className="settings-item-desc">Go through the welcome flow again</span>
                </div>
              </div>
              <span className="settings-item-arrow">→</span>
            </button>
          </div>
        </section>
      )}

      <section className="settings-section">
        <h2 className="settings-section-title">About</h2>
        <div className="settings-list">
          <div className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">🌳</span>
              <div>
                <span className="settings-item-label">Practice Space</span>
                <span className="settings-item-desc">Version 1.0.0</span>
              </div>
            </div>
          </div>
        </div>
        <p className="settings-footer">
          Your sacred place for spiritual practice tracking.
          <br />
          Your data stays local on your device.
        </p>
      </section>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      <ExportModal
        isOpen={exportModal.isOpen}
        onClose={closeExportModal}
        content={exportModal.content}
        filename={exportModal.filename}
        title={exportModal.title}
      />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  )
}

export default Settings
