import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, firestore as db, isFirebaseConfigured } from '../config/firebase'
import { initAutoSync, stopAutoSync, isSyncEnabled, getCloudSyncPreference, enableSync } from '../services/syncService'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if Firebase is available
  const firebaseAvailable = isFirebaseConfigured() && auth

  useEffect(() => {
    if (!firebaseAvailable) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)

      // Initialize or stop auto-sync based on auth state
      if (user) {
        // Check if sync is enabled locally
        if (isSyncEnabled()) {
          initAutoSync(user.uid)
        } else {
          // Check cloud preference - maybe user enabled sync on another device
          const cloudPref = await getCloudSyncPreference(user.uid)
          if (cloudPref === true) {
            // User has sync enabled on another device, enable it here too
            enableSync(user.uid)
            initAutoSync(user.uid)
          }
        }
      } else {
        stopAutoSync()
      }
    })

    return () => {
      unsubscribe()
      stopAutoSync()
    }
  }, [firebaseAvailable])

  async function signUp(email, password, displayName, securityAnswer) {
    if (!firebaseAvailable) {
      throw new Error('Firebase is not configured')
    }

    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      // Save security answer if provided
      if (securityAnswer && securityAnswer.trim()) {
        await saveSecurityAnswer(result.user.uid, securityAnswer.trim(), email)
      }
      return result.user
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  // Save security answer for password recovery
  async function saveSecurityAnswer(uid, answer, email) {
    if (!firebaseAvailable) {
      throw new Error('Firebase is not configured')
    }
    await setDoc(doc(db, 'securityAnswers', uid), {
      answer: answer.toLowerCase(),
      email: email.toLowerCase(),
    })
  }

  // Check if user has a security answer set
  async function checkSecurityAnswerExists(uid) {
    if (!firebaseAvailable) {
      return false
    }
    const securityDoc = await getDoc(doc(db, 'securityAnswers', uid))
    return securityDoc.exists()
  }

  // Reset password via serverless function
  async function resetPasswordWithAnswer(email, answer, newPassword) {
    const baseUrl = import.meta.env.VITE_FUNCTIONS_URL || '';
    const response = await fetch(`${baseUrl}/.netlify/functions/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, answer: answer.toLowerCase(), newPassword }),
    })

    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('Server response:', text)
      throw new Error('Server error. Please try again later.')
    }

    if (!response.ok) {
      throw new Error(data.error || 'Password reset failed')
    }
    return data
  }

  async function signIn(email, password) {
    if (!firebaseAvailable) {
      throw new Error('Firebase is not configured')
    }

    setError(null)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  async function logout() {
    if (!firebaseAvailable) {
      throw new Error('Firebase is not configured')
    }

    setError(null)
    try {
      await signOut(auth)
    } catch (err) {
      setError(getErrorMessage(err.code))
      throw err
    }
  }

  function clearError() {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    firebaseAvailable,
    signUp,
    signIn,
    logout,
    clearError,
    isAuthenticated: !!user,
    saveSecurityAnswer,
    checkSecurityAnswerExists,
    resetPasswordWithAnswer
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Convert Firebase error codes to user-friendly messages
function getErrorMessage(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/operation-not-allowed':
      return 'Email/password sign in is not enabled.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/user-disabled':
      return 'This account has been disabled.'
    case 'auth/user-not-found':
      return 'No account found with this email.'
    case 'auth/wrong-password':
      return 'Incorrect password.'
    case 'auth/invalid-credential':
      return 'Invalid email or password.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.'
    default:
      return 'An error occurred. Please try again.'
  }
}

export default AuthContext
