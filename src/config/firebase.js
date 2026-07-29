// Firebase Configuration
// To set up:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Go to Project Settings > General > Your apps > Add app > Web
// 4. Copy the config values below
// 5. Enable Authentication: Build > Authentication > Get Started > Email/Password
// 6. Enable Firestore: Build > Firestore Database > Create Database > Start in production mode

import { initializeApp } from 'firebase/app'
import {
  initializeAuth,
  getAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  browserPopupRedirectResolver,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  )
}

// Initialize Firebase only if configured
let app = null
let auth = null
let db = null
let functions = null

// Explicit persistence chain — IndexedDB first, so the session survives an
// installed-PWA relaunch on Android. Default getAuth() writes to a storage
// partition standalone mode doesn't read back, dropping the user to sign-in
// every launch. popupRedirectResolver is mandatory with initializeAuth;
// getAuth() wires it in automatically, initializeAuth does not. The catch
// covers Vite HMR re-running this module.
function getOrInitAuth(firebaseApp) {
  try {
    return initializeAuth(firebaseApp, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence, browserSessionPersistence],
      popupRedirectResolver: browserPopupRedirectResolver,
    })
  } catch {
    return getAuth(firebaseApp)
  }
}

if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getOrInitAuth(app)
    db = getFirestore(app)
    functions = getFunctions(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
}

export { app, auth, db as firestore, functions }
