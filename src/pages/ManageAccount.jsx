import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'
import {
  isGoogleDriveConfigured,
  isConnected,
  connectGoogleDrive,
  disconnectGoogleDrive
} from '../services/googleDrive'
import './Settings.css'
import './ManageAccount.css'

function ManageAccount() {
  const { user, isAuthenticated, signOut, firebaseAvailable } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('signin')
  const [driveConnected, setDriveConnected] = useState(false)
  const [driveConfigured] = useState(isGoogleDriveConfigured())
  const [connecting, setConnecting] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(false)

  // Check Drive connection status
  useEffect(() => {
    setDriveConnected(isConnected())
  }, [])

  // Check sync status
  useEffect(() => {
    const saved = localStorage.getItem('sanctum-sync-enabled')
    setSyncEnabled(saved === 'true')
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

  function handleToggleSync() {
    const newValue = !syncEnabled
    setSyncEnabled(newValue)
    localStorage.setItem('sanctum-sync-enabled', String(newValue))
    window.dispatchEvent(new CustomEvent('sync-settings-changed', { detail: { enabled: newValue } }))
  }

  function handleSignIn() {
    setAuthModalMode('signin')
    setAuthModalOpen(true)
  }

  function handleSignUp() {
    setAuthModalMode('signup')
    setAuthModalOpen(true)
  }

  async function handleSignOut() {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Generate a display-friendly user ID
  function getUserDisplayId() {
    if (!user?.uid) return null
    // Show first 8 chars of UID
    return user.uid.substring(0, 8).toUpperCase()
  }

  return (
    <div className="settings-page">
      <div className="settings-back-header">
        <Link to="/settings" className="settings-back-link">
          <span>←</span>
          <span>Settings</span>
        </Link>
        <h1 className="settings-page-title">Manage Account</h1>
      </div>

      {/* Account Status */}
      <section className="settings-section">
        <h2 className="settings-section-title">Account</h2>
        <div className="settings-list">
          {isAuthenticated ? (
            <>
              <div className="settings-item account-card">
                <div className="account-card-avatar">
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="account-card-info">
                  {user?.displayName && (
                    <span className="account-card-name">{user.displayName}</span>
                  )}
                  <span className="account-card-email">{user?.email}</span>
                  <span className="account-card-id">ID: {getUserDisplayId()}</span>
                </div>
              </div>
              <button className="settings-item" onClick={handleSignOut}>
                <div className="settings-item-content">
                  <span className="settings-item-icon">🚪</span>
                  <div>
                    <span className="settings-item-label">Sign Out</span>
                    <span className="settings-item-desc">Sign out of your account</span>
                  </div>
                </div>
                <span className="settings-item-arrow">→</span>
              </button>
            </>
          ) : (
            <>
              <div className="settings-item account-signin-card">
                <div className="account-signin-content">
                  <span className="account-signin-icon">👤</span>
                  <div>
                    <span className="account-signin-title">Not signed in</span>
                    <span className="account-signin-desc">Sign in to sync across devices</span>
                  </div>
                </div>
              </div>
              {firebaseAvailable ? (
                <div className="account-auth-buttons">
                  <button className="btn btn-primary" onClick={handleSignIn}>
                    Sign In
                  </button>
                  <button className="btn btn-secondary" onClick={handleSignUp}>
                    Create Account
                  </button>
                </div>
              ) : (
                <div className="settings-item settings-item--disabled">
                  <div className="settings-item-content">
                    <span className="settings-item-icon">⚠</span>
                    <div>
                      <span className="settings-item-label">Cloud services not configured</span>
                      <span className="settings-item-desc">Authentication is not available</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Google Drive */}
      <section className="settings-section">
        <h2 className="settings-section-title">Google Drive</h2>
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

      {/* Cloud Sync */}
      <section className="settings-section">
        <h2 className="settings-section-title">Cloud Sync</h2>
        <div className="settings-info-box">
          <div className="settings-info-box-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="settings-info-box-content">
            <strong>Local-First Storage</strong>
            <p>Your data is stored on this device. Enable sync to backup to the cloud.</p>
          </div>
        </div>

        <div className="settings-list" style={{ marginTop: '12px' }}>
          {isAuthenticated ? (
            <label className="settings-item settings-item--toggle">
              <div className="settings-item-content">
                <span className="settings-item-icon">🔄</span>
                <div>
                  <span className="settings-item-label">Enable Cloud Sync</span>
                  <span className="settings-item-desc">
                    {syncEnabled ? 'Syncing data to cloud' : 'Data stored locally only'}
                  </span>
                </div>
              </div>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={syncEnabled}
                  onChange={handleToggleSync}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          ) : (
            <div className="settings-item settings-item--disabled">
              <div className="settings-item-content">
                <span className="settings-item-icon">🔄</span>
                <div>
                  <span className="settings-item-label">Cloud Sync</span>
                  <span className="settings-item-desc">Sign in to enable cloud sync</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  )
}

export default ManageAccount
