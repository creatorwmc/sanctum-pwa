import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
  getSyncPrefs,
  enableSync,
  disableSync,
  fullSync,
  getLastSyncTime,
  uploadAllData,
  downloadAllData,
  initAutoSync,
  stopAutoSync
} from '../services/syncService'
import './AccountSettings.css'

function AccountSettings({ onSignInClick }) {
  const { user, logout, isAuthenticated, firebaseAvailable } = useAuth()
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState('')
  const [syncEnabled, setSyncEnabled] = useState(() => getSyncPrefs().enabled)

  // Re-read sync preferences when authentication state changes
  // This ensures the checkbox reflects the correct state after sign-in
  useEffect(() => {
    if (isAuthenticated) {
      setSyncEnabled(getSyncPrefs().enabled)
    }
  }, [isAuthenticated])

  const lastSync = getLastSyncTime()

  async function handleToggleSync() {
    if (syncEnabled) {
      disableSync(user?.uid)
      stopAutoSync()
      setSyncEnabled(false)
      setSyncMessage('Cloud sync disabled')
    } else {
      enableSync(user?.uid)
      setSyncEnabled(true)
      setSyncMessage('Cloud sync enabled - syncing automatically')
      // Initialize auto-sync and do initial sync
      if (user) {
        initAutoSync(user.uid)
        await handleSync()
      }
    }
    setTimeout(() => setSyncMessage(''), 3000)
  }

  async function handleSync() {
    if (!user) return
    setSyncing(true)
    setSyncMessage('Syncing...')
    try {
      const result = await fullSync(user.uid)
      if (result.success) {
        setSyncMessage('Sync complete!')
      } else {
        setSyncMessage('Sync failed: ' + result.error)
      }
    } catch (error) {
      setSyncMessage('Sync error: ' + error.message)
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMessage(''), 3000)
    }
  }

  async function handleUpload() {
    if (!user) return
    setSyncing(true)
    setSyncMessage('Uploading to cloud...')
    try {
      const result = await uploadAllData(user.uid)
      if (result.success) {
        setSyncMessage('Upload complete!')
      } else {
        setSyncMessage('Upload failed: ' + result.error)
      }
    } catch (error) {
      setSyncMessage('Upload error: ' + error.message)
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMessage(''), 3000)
    }
  }

  async function handleDownload() {
    if (!user) return
    setSyncing(true)
    setSyncMessage('Downloading from cloud...')
    try {
      const result = await downloadAllData(user.uid)
      if (result.success) {
        setSyncMessage('Download complete!')
      } else {
        setSyncMessage('Download failed: ' + result.error)
      }
    } catch (error) {
      setSyncMessage('Download error: ' + error.message)
    } finally {
      setSyncing(false)
      setTimeout(() => setSyncMessage(''), 3000)
    }
  }

  async function handleLogout() {
    try {
      await logout()
      disableSync()
      setSyncEnabled(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Not logged in state
  if (!isAuthenticated) {
    return (
      <div className="account-settings">
        <div className="account-section">
          <h3 className="account-section-title">Cloud Sync</h3>
          <p className="account-description">
            Sign in to sync your practice data across devices. Your data is stored locally by default.
          </p>
          {firebaseAvailable ? (
            <button onClick={onSignInClick} className="btn btn-primary account-signin-btn">
              Sign In / Create Account
            </button>
          ) : (
            <p className="account-not-configured">
              Cloud sync is not configured. Contact the app administrator.
            </p>
          )}
        </div>

        <div className="account-local-note">
          <span className="local-icon">📱</span>
          <span>Your data is stored locally on this device</span>
        </div>
      </div>
    )
  }

  // Logged in state
  return (
    <div className="account-settings">
      <div className="account-section">
        <h3 className="account-section-title">Account</h3>
        <div className="account-user-info">
          <div className="user-avatar">
            {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="user-details">
            {user.displayName && <span className="user-name">{user.displayName}</span>}
            <span className="user-email">{user.email}</span>
            <span className="user-id">ID: {user.uid}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary account-logout-btn">
          Sign Out
        </button>
      </div>

      <div className="account-section">
        <h3 className="account-section-title">Cloud Sync</h3>

        <label className="sync-toggle">
          <input
            type="checkbox"
            checked={syncEnabled}
            onChange={handleToggleSync}
            disabled={syncing}
          />
          <span className="sync-toggle-label">Enable Cloud Sync</span>
        </label>

        {syncEnabled && (
          <>
            <div className="sync-actions">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="btn btn-secondary sync-btn"
              >
                {syncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            <div className="sync-advanced">
              <button
                onClick={handleUpload}
                disabled={syncing}
                className="sync-advanced-btn"
              >
                Upload Local → Cloud
              </button>
              <button
                onClick={handleDownload}
                disabled={syncing}
                className="sync-advanced-btn"
              >
                Download Cloud → Local
              </button>
            </div>

            {lastSync && (
              <p className="sync-last-time">
                Last synced: {new Date(lastSync).toLocaleString()}
              </p>
            )}
          </>
        )}

        {syncMessage && (
          <p className={`sync-message ${syncMessage.includes('error') || syncMessage.includes('failed') ? 'sync-message--error' : ''}`}>
            {syncMessage}
          </p>
        )}
      </div>

      <div className="account-privacy-info">
        <h4>About Your Data</h4>
        <ul>
          <li>Data is always stored locally on your device</li>
          <li>Cloud sync is optional and can be disabled anytime</li>
          {syncEnabled && <li>Changes sync automatically across devices</li>}
          <li>Disabling sync keeps your local data intact</li>
        </ul>
      </div>
    </div>
  )
}

export default AccountSettings
