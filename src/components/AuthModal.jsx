import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AuthModal.css'

function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signin') // 'signin' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const { signIn, signUp, error, clearError } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (!email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.')
      return
    }

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
      } else {
        await signUp(email, password, displayName.trim())
      }
      handleClose()
    } catch (err) {
      // Error is handled by AuthContext
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setEmail('')
    setPassword('')
    setDisplayName('')
    setLocalError('')
    clearError()
    onClose()
  }

  function toggleMode() {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setLocalError('')
    clearError()
  }

  if (!isOpen) return null

  const displayError = localError || error

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={handleClose} aria-label="Close">
          ×
        </button>

        <div className="auth-header">
          <h2>{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {mode === 'signin'
              ? 'Sign in to sync your practice across devices'
              : 'Create an account to enable cloud sync'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-name">Display Name (optional)</label>
              <input
                type="text"
                id="auth-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="input"
                autoComplete="name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="auth-email">Email</label>
            <input
              type="email"
              id="auth-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              type="password"
              id="auth-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              className="input"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          {displayError && (
            <p className="auth-error">{displayError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary auth-submit"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={toggleMode} className="auth-toggle-btn">
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="auth-privacy-note">
          <p>
            Your data is stored locally by default. Signing in enables optional cloud sync.
            You can disable sync anytime in Settings.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
