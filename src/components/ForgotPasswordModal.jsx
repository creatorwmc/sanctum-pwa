import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './ForgotPasswordModal.css'

function ForgotPasswordModal({ isOpen, onClose, onBack }) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { resetPasswordWithAnswer } = useAuth()

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isValidPassword = (password) => {
    if (!password || password.length < 8) return false
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    return hasLetter && hasNumber
  }

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setStep(2)
  }

  const handleSecuritySubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!securityAnswer.trim()) {
      setError('Please enter your security answer')
      return
    }

    setStep(3)
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setError('')

    if (!isValidPassword(newPassword)) {
      setError('Password must be at least 8 characters with a letter and number')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      await resetPasswordWithAnswer(email, securityAnswer, newPassword)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Password reset failed. Please check your answer and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setEmail('')
    setSecurityAnswer('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="auth-overlay" onClick={handleClose}>
      <div className="forgot-password-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={handleClose} aria-label="Close">
          x
        </button>

        {success ? (
          <div className="forgot-password-success">
            <h2>Password Reset!</h2>
            <p>Your password has been updated successfully. You can now sign in with your new password.</p>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-primary"
            >
              Sign In
            </button>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <h2>Reset Password</h2>
              <p className="auth-subtitle">
                {step === 1 && 'Enter your email to begin'}
                {step === 2 && 'Answer your security question'}
                {step === 3 && 'Create a new password'}
              </p>
            </div>

            {error && <p className="auth-error">{error}</p>}

            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="forgot-email">Email</label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input"
                    autoComplete="email"
                  />
                </div>

                <button type="submit" className="btn btn-primary auth-submit">
                  Continue
                </button>

                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={onBack}
                >
                  Back to Sign In
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSecuritySubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="forgot-security">What is your favorite color?</label>
                  <input
                    type="text"
                    id="forgot-security"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="input"
                    autoComplete="off"
                  />
                </div>

                <button type="submit" className="btn btn-primary auth-submit">
                  Continue
                </button>

                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePasswordReset} className="auth-form">
                <div className="form-group">
                  <label htmlFor="forgot-new-password">New Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="forgot-new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 chars, letter + number"
                      className="input"
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="forgot-confirm-password">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="forgot-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="input"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button
                  type="button"
                  className="auth-back-btn"
                  onClick={() => setStep(2)}
                  disabled={loading}
                >
                  Back
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordModal
