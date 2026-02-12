import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import FeedbackModal from '../components/FeedbackModal'
import ExportModal from '../components/ExportModal'
import StoneIcon from '../components/StoneIcon'
import BackgroundSettings from '../components/BackgroundSettings'
import RateModal from '../components/RateModal'
import { isRatingDisabled, setRatingDisabled } from '../components/RatingPrompt'
import { getStreakSettings, saveStreakSettings } from '../utils/streakSettings'
import { usePrivacy, PRIVACY_MODES } from '../contexts/PrivacyContext'
import { useOnboarding } from '../contexts/OnboardingContext'
import { useAuth } from '../contexts/AuthContext'
import { isUserAdmin, getUnreadWhisperCount } from '../services/adminService'
import { getTraditionSettings } from '../components/TraditionSettings'
import { AVAILABLE_TRADITIONS, getSubgroup } from '../data/traditions'
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
  const { user, isAuthenticated } = useAuth()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [rateOpen, setRateOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [unreadWhispers, setUnreadWhispers] = useState(0)
  const [driveConnected, setDriveConnected] = useState(false)
  const [driveConfigured] = useState(isGoogleDriveConfigured())
  const [connecting, setConnecting] = useState(false)
  const [feedbackPromptsEnabled, setFeedbackPromptsEnabled] = useState(!isRatingDisabled())
  const [streakEnabled, setStreakEnabled] = useState(getStreakSettings().enabled === true)
  const [showPracticeGuides, setShowPracticeGuides] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { mode: privacyMode, enablePrivateMode, enableEncryptedMode, disablePrivacyMode } = usePrivacy()
  const [showPassphraseInput, setShowPassphraseInput] = useState(false)
  const [passphrase, setPassphrase] = useState('')
  const [passphraseConfirm, setPassphraseConfirm] = useState('')
  const [passphraseError, setPassphraseError] = useState('')
  const { resetOnboarding, getConfiguration } = useOnboarding()
  const config = getConfiguration()

  // Get current tradition info
  const traditionSettings = getTraditionSettings()
  const selectedTradition = AVAILABLE_TRADITIONS.find(t => t.id === traditionSettings.traditionId)
  const selectedSubgroup = traditionSettings.subgroupId ? getSubgroup(traditionSettings.traditionId, traditionSettings.subgroupId) : null

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

  // Check admin status
  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const adminStatus = await isUserAdmin(user.uid)
        setIsAdmin(adminStatus)
        if (adminStatus) {
          const count = await getUnreadWhisperCount()
          setUnreadWhispers(count)
        }
      } else {
        setIsAdmin(false)
        setUnreadWhispers(0)
      }
    }
    checkAdmin()
  }, [user])

  function getTraditionDisplayName() {
    if (!traditionSettings.traditionId) return 'Not selected'
    if (traditionSettings.traditionId === 'custom' && traditionSettings.customName) {
      return traditionSettings.customName
    }
    if (selectedSubgroup) {
      return `${selectedTradition?.name}: ${selectedSubgroup.name}`
    }
    return selectedTradition?.name || 'Unknown'
  }

  function handleToggleStreak() {
    const newValue = !streakEnabled
    setStreakEnabled(newValue)
    saveStreakSettings({ enabled: newValue })
  }

  function handlePrivacyModeChange(newMode) {
    if (newMode === PRIVACY_MODES.normal) {
      disablePrivacyMode()
    } else if (newMode === PRIVACY_MODES.private) {
      enablePrivateMode()
    } else if (newMode === PRIVACY_MODES.encrypted) {
      setShowPassphraseInput(true)
    }
  }

  async function handleSetPassphrase() {
    if (passphrase.length < 8) {
      setPassphraseError('Passphrase must be at least 8 characters')
      return
    }
    if (passphrase !== passphraseConfirm) {
      setPassphraseError('Passphrases do not match')
      return
    }

    const success = await enableEncryptedMode(passphrase)
    if (success) {
      setShowPassphraseInput(false)
      setPassphrase('')
      setPassphraseConfirm('')
      setPassphraseError('')
    } else {
      setPassphraseError('Failed to enable encryption')
    }
  }

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

  // Share the app
  async function handleShareApp() {
    const shareData = {
      title: 'Practice Space',
      text: 'Your sacred place for spiritual practice tracking',
      url: 'https://sanctum-pwa-app.netlify.app'
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareData.url)
          alert('Link copied to clipboard!')
        } catch {
          alert('Share link: ' + shareData.url)
        }
      }
    }
  }

  // Delete all data and uninstall
  async function handleDeleteAllData() {
    try {
      const databases = await indexedDB.databases()
      for (const db of databases) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name)
        }
      }

      localStorage.clear()
      sessionStorage.clear()

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
      }

      if ('caches' in window) {
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName)
        }
      }

      alert('All data has been deleted.\n\nTo complete uninstall:\n• iOS: Long-press the app icon → Remove App\n• Android: Long-press → Uninstall\n• Desktop: Click the install icon in address bar → Uninstall')

      window.location.href = '/'
      window.location.reload()
    } catch (error) {
      console.error('Error deleting data:', error)
      alert('Error deleting some data. Please try again.')
    }
  }

  return (
    <div className="settings-page">
      {/* Manage Account */}
      <section className="settings-section">
        <h2 className="settings-section-title">Account</h2>
        <div className="settings-list">
          <Link to="/settings/account" className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">👤</span>
              <div>
                <span className="settings-item-label">Manage Account</span>
                <span className="settings-item-desc">
                  {isAuthenticated ? user?.email : 'Sign in, sync, and cloud backup'}
                </span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Customize Section */}
      <section className="settings-section">
        <h2 className="settings-section-title">Customize</h2>
        <div className="settings-list">
          <Link to="/settings/tradition" className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">
                {selectedSubgroup?.icon || selectedTradition?.icon || '✨'}
              </span>
              <div>
                <span className="settings-item-label">Your Tradition</span>
                <span className="settings-item-desc">{getTraditionDisplayName()}</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </Link>

          <Link to="/settings/layout" className="settings-item">
            <div className="settings-item-content">
              <span className="settings-item-icon">🏠</span>
              <div>
                <span className="settings-item-label">Home Screen</span>
                <span className="settings-item-desc">Configure dashboard layout</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </Link>

          <label className="settings-item settings-item--toggle">
            <div className="settings-item-content">
              <span className="settings-item-icon">🔥</span>
              <div>
                <span className="settings-item-label">Practice Streaks</span>
                <span className="settings-item-desc">Track consecutive days of practice</span>
              </div>
            </div>
            <div className="toggle-switch">
              <input
                type="checkbox"
                checked={streakEnabled}
                onChange={handleToggleStreak}
              />
              <span className="toggle-slider"></span>
            </div>
          </label>
        </div>

        {/* App Color & Theme */}
        <h3 className="settings-subsection-title">App Color & Theme</h3>
        <BackgroundSettings />
      </section>

      {/* Daily Practice */}
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

      {/* Privacy Section */}
      <section className="settings-section">
        <h2 className="settings-section-title">Privacy</h2>
        <div className="settings-list">
          <div className="settings-item settings-item--column">
            <div className="settings-item-content">
              <span className="settings-item-icon">🛡</span>
              <div>
                <span className="settings-item-label">Privacy Mode</span>
                <span className="settings-item-desc">
                  {privacyMode === PRIVACY_MODES.normal && 'Standard - Data stored persistently'}
                  {privacyMode === PRIVACY_MODES.private && 'Private - Clears when browser closes'}
                  {privacyMode === PRIVACY_MODES.encrypted && 'Encrypted - Protected with passphrase'}
                </span>
              </div>
            </div>
            <div className="privacy-mode-selector">
              <button
                className={`privacy-mode-btn ${privacyMode === PRIVACY_MODES.normal ? 'privacy-mode-btn--active' : ''}`}
                onClick={() => handlePrivacyModeChange(PRIVACY_MODES.normal)}
              >
                <span>Standard</span>
              </button>
              <button
                className={`privacy-mode-btn ${privacyMode === PRIVACY_MODES.private ? 'privacy-mode-btn--active' : ''}`}
                onClick={() => handlePrivacyModeChange(PRIVACY_MODES.private)}
              >
                <span>Private</span>
              </button>
              <button
                className={`privacy-mode-btn ${privacyMode === PRIVACY_MODES.encrypted ? 'privacy-mode-btn--active' : ''}`}
                onClick={() => handlePrivacyModeChange(PRIVACY_MODES.encrypted)}
              >
                <span>Encrypted</span>
              </button>
            </div>
          </div>
        </div>

        {showPassphraseInput && (
          <div className="passphrase-setup">
            <h4>Set Encryption Passphrase</h4>
            <p className="passphrase-hint">You'll need this to access your data. Choose something memorable.</p>
            <input
              type="password"
              placeholder="Enter passphrase (min 8 characters)"
              value={passphrase}
              onChange={e => setPassphrase(e.target.value)}
              className="passphrase-input"
            />
            <input
              type="password"
              placeholder="Confirm passphrase"
              value={passphraseConfirm}
              onChange={e => setPassphraseConfirm(e.target.value)}
              className="passphrase-input"
            />
            {passphraseError && <p className="passphrase-error">{passphraseError}</p>}
            <div className="passphrase-buttons">
              <button
                className="btn btn-primary"
                onClick={handleSetPassphrase}
                disabled={passphrase.length < 8}
              >
                Enable Encryption
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowPassphraseInput(false)
                  setPassphrase('')
                  setPassphraseConfirm('')
                  setPassphraseError('')
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Export & Backup */}
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

      {/* Cloud Backup */}
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
                        Exports save to Practice Space folder
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

      {/* Preferences */}
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

      {/* Get Help */}
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

          <button
            className={`settings-item ${showPracticeGuides ? 'settings-item--expanded' : ''}`}
            onClick={() => setShowPracticeGuides(!showPracticeGuides)}
          >
            <div className="settings-item-content">
              <span className="settings-item-icon">📖</span>
              <div>
                <span className="settings-item-label">Practice Guides</span>
                <span className="settings-item-desc">Tradition-specific practice teachings</span>
              </div>
            </div>
            <span className="settings-item-arrow">{showPracticeGuides ? '▼' : '▶'}</span>
          </button>

          {showPracticeGuides && (
            <div className="practice-guides-list">
              {AVAILABLE_TRADITIONS.filter(t =>
                !['unsure', 'none', 'custom'].includes(t.id)
              ).map(tradition => (
                tradition.hasPreset ? (
                  <Link
                    key={tradition.id}
                    to={`/guide/${tradition.id}`}
                    className="practice-guide-item"
                    style={{ '--tradition-color': tradition.color }}
                  >
                    <span className="practice-guide-icon">{tradition.icon}</span>
                    <span className="practice-guide-name">{tradition.name}</span>
                    <span className="practice-guide-arrow">→</span>
                  </Link>
                ) : (
                  <div
                    key={tradition.id}
                    className="practice-guide-item practice-guide-item--coming-soon"
                    style={{ '--tradition-color': tradition.color }}
                  >
                    <span className="practice-guide-icon">{tradition.icon}</span>
                    <span className="practice-guide-name">{tradition.name}</span>
                    <span className="practice-guide-status">Coming Soon</span>
                  </div>
                )
              ))}
            </div>
          )}

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

      {/* Setup */}
      <section className="settings-section">
        <h2 className="settings-section-title">Setup</h2>
        <div className="settings-list">
          {config.personality && (
            <div className="settings-item">
              <div className="settings-item-content">
                <span className="settings-item-icon">🎨</span>
                <div>
                  <span className="settings-item-label">Style: {config.personality}</span>
                  <span className="settings-item-desc">Your visual personality preference</span>
                </div>
              </div>
            </div>
          )}
          <button className="settings-item" onClick={resetOnboarding}>
            <div className="settings-item-content">
              <span className="settings-item-icon">↺</span>
              <div>
                <span className="settings-item-label">Redo Setup Questions</span>
                <span className="settings-item-desc">Go through the welcome flow again</span>
              </div>
            </div>
            <span className="settings-item-arrow">→</span>
          </button>
        </div>
      </section>

      {/* Admin */}
      {user && (
        <section className="settings-section">
          <h2 className="settings-section-title">Admin</h2>
          <div className="settings-list">
            <Link to="/admin/whispers" className="settings-item">
              <div className="settings-item-content">
                <span className="settings-item-icon">💬</span>
                <div>
                  <span className="settings-item-label">
                    Whispers
                    {unreadWhispers > 0 && (
                      <span className="settings-badge">{unreadWhispers}</span>
                    )}
                  </span>
                  <span className="settings-item-desc">
                    {isAdmin ? 'View user feedback' : 'Admin access required'}
                  </span>
                </div>
              </div>
              <span className="settings-item-arrow">→</span>
            </Link>
            <Link to="/admin/tradition-feedback" className="settings-item">
              <div className="settings-item-content">
                <span className="settings-item-icon">📝</span>
                <div>
                  <span className="settings-item-label">Tradition Feedback</span>
                  <span className="settings-item-desc">
                    {isAdmin ? 'Manage content suggestions' : 'Admin access required'}
                  </span>
                </div>
              </div>
              <span className="settings-item-arrow">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Rate and Share */}
      <section className="settings-section">
        <h2 className="settings-section-title">Support Practice Space</h2>
        <div className="settings-support-buttons">
          <button className="settings-support-btn" onClick={() => setRateOpen(true)}>
            <span className="settings-support-btn-icon">★</span>
            <span>Rate</span>
          </button>
          <button className="settings-support-btn" onClick={handleShareApp}>
            <span className="settings-support-btn-icon">↗</span>
            <span>Share</span>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="settings-section settings-danger-section">
        <h2 className="settings-section-title settings-danger-title">Danger Zone</h2>
        <div className="settings-list">
          {!showDeleteConfirm ? (
            <button
              className="settings-item settings-item--danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <div className="settings-item-content">
                <span className="settings-item-icon">🗑</span>
                <div>
                  <span className="settings-item-label">Delete All Data & Uninstall</span>
                  <span className="settings-item-desc">Permanently remove everything</span>
                </div>
              </div>
              <span className="settings-item-arrow">→</span>
            </button>
          ) : (
            <div className="settings-delete-confirm">
              <p className="settings-delete-warning">
                This will permanently delete all your data including journal entries, meditation sessions, and practice logs. This cannot be undone.
              </p>
              <div className="settings-delete-buttons">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteAllData}
                >
                  Yes, Delete Everything
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* About */}
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
      <RateModal isOpen={rateOpen} onClose={() => setRateOpen(false)} />

      <ExportModal
        isOpen={exportModal.isOpen}
        onClose={closeExportModal}
        content={exportModal.content}
        filename={exportModal.filename}
        title={exportModal.title}
      />
    </div>
  )
}

export default Settings
