import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs
} from 'firebase/firestore'
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

  // Save security answer to Firestore (stored by email for lookup without auth)
  async function saveSecurityAnswer(uid, answer, email) {
    if (!firebaseAvailable || !db) {
      throw new Error('Firebase is not configured')
    }

    try {
      // Store by email (lowercase) so we can look it up during password reset
      const normalizedEmail = email.toLowerCase().trim()
      await setDoc(doc(db, 'securityAnswers', normalizedEmail), {
        answer: answer.toLowerCase().trim(),
        uid,
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error saving security answer:', err)
      throw new Error('Failed to save security answer')
    }
  }

  // Check if user has set up a security answer
  async function checkSecurityAnswerExists(uid) {
    if (!firebaseAvailable || !db) {
      return false
    }

    try {
      // Query by uid to find if this user has an answer
      const q = query(
        collection(db, 'securityAnswers'),
        where('uid', '==', uid)
      )
      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (err) {
      console.error('Error checking security answer:', err)
      return false
    }
  }

  // Reset password using security answer via Netlify Function
  async function resetPasswordWithAnswer(email, answer, newPassword) {
    try {
      const response = await fetch('/.netlify/functions/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          answer: answer,
          newPassword: newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed')
      }

      return data
    } catch (err) {
      console.error('Error resetting password:', err)
      throw new Error(err.message || 'Password reset failed. Please try again.')
    }
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
