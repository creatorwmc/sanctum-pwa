import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../config/firebase'

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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [firebaseAvailable])

  async function signUp(email, password, displayName) {
    if (!firebaseAvailable) {
      throw new Error('Firebase is not configured')
    }

    setError(null)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName) {
        await updateProfile(result.user, { displayName })
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

  const value = {
    user,
    loading,
    error,
    firebaseAvailable,
    signUp,
    signIn,
    logout,
    clearError,
    isAuthenticated: !!user
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
