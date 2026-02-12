import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { generateKey, verifyPassphrase, storeTestValue, isEncryptionSetUp } from '../utils/encryption'

const PrivacyContext = createContext(null)

export const PRIVACY_MODES = {
  normal: 'normal',      // Regular localStorage/IndexedDB
  private: 'private',    // sessionStorage only, clears on browser close
  encrypted: 'encrypted' // AES-GCM encrypted storage with passphrase
}

const STORAGE_KEY = 'sanctum-privacy-mode'

export function PrivacyProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || PRIVACY_MODES.normal
  })
  const [encryptionKey, setEncryptionKey] = useState(null)
  const [isUnlocked, setIsUnlocked] = useState(true)

  // Check if app needs to be unlocked on load
  useEffect(() => {
    if (mode === PRIVACY_MODES.encrypted && isEncryptionSetUp()) {
      setIsUnlocked(false)
    }
  }, [mode])

  // Enable private mode (session-only storage)
  const enablePrivateMode = useCallback(() => {
    setMode(PRIVACY_MODES.private)
    localStorage.setItem(STORAGE_KEY, PRIVACY_MODES.private)

    // Move sensitive data to sessionStorage
    const keysToMove = [
      'sanctum-tradition-settings',
      'sanctum-user-settings',
      'sanctum-streak-settings'
    ]

    keysToMove.forEach(key => {
      const value = localStorage.getItem(key)
      if (value) {
        sessionStorage.setItem(key, value)
        localStorage.removeItem(key)
      }
    })
  }, [])

  // Enable encrypted mode
  const enableEncryptedMode = useCallback(async (passphrase) => {
    try {
      const key = await generateKey(passphrase)
      await storeTestValue(key)
      setEncryptionKey(key)
      setMode(PRIVACY_MODES.encrypted)
      setIsUnlocked(true)
      localStorage.setItem(STORAGE_KEY, PRIVACY_MODES.encrypted)
      return true
    } catch (err) {
      console.error('Failed to enable encrypted mode:', err)
      return false
    }
  }, [])

  // Unlock app with passphrase
  const unlockApp = useCallback(async (passphrase) => {
    const isValid = await verifyPassphrase(passphrase)
    if (isValid) {
      const key = await generateKey(passphrase)
      setEncryptionKey(key)
      setIsUnlocked(true)
      return true
    }
    return false
  }, [])

  // Lock app (encrypted mode)
  const lockApp = useCallback(() => {
    if (mode === PRIVACY_MODES.encrypted) {
      setIsUnlocked(false)
      setEncryptionKey(null)
    }
  }, [mode])

  // Disable privacy mode (return to normal)
  const disablePrivacyMode = useCallback(() => {
    // Move data back from sessionStorage if in private mode
    if (mode === PRIVACY_MODES.private) {
      const keysToMove = [
        'sanctum-tradition-settings',
        'sanctum-user-settings',
        'sanctum-streak-settings'
      ]

      keysToMove.forEach(key => {
        const value = sessionStorage.getItem(key)
        if (value) {
          localStorage.setItem(key, value)
          sessionStorage.removeItem(key)
        }
      })
    }

    // Clear encryption test if coming from encrypted mode
    if (mode === PRIVACY_MODES.encrypted) {
      localStorage.removeItem('sanctum-encryption-test')
    }

    setMode(PRIVACY_MODES.normal)
    setEncryptionKey(null)
    setIsUnlocked(true)
    localStorage.setItem(STORAGE_KEY, PRIVACY_MODES.normal)
  }, [mode])

  // Panic wipe - immediately delete all data
  const panicWipe = useCallback(async () => {
    try {
      // Clear localStorage
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('sanctum-')) {
          localStorage.removeItem(key)
        }
      })

      // Clear sessionStorage
      sessionStorage.clear()

      // Clear IndexedDB
      const databases = await indexedDB.databases?.() || []
      for (const db of databases) {
        if (db.name && db.name.includes('sanctum')) {
          indexedDB.deleteDatabase(db.name)
        }
      }
      // Also try to delete the main db
      indexedDB.deleteDatabase('sanctum-db')

      // Clear caches
      if ('caches' in window) {
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName)
        }
      }

      // Redirect to blank page
      window.location.href = 'about:blank'
    } catch (err) {
      console.error('Panic wipe error:', err)
      // Force reload even if there's an error
      window.location.reload()
    }
  }, [])

  const value = {
    mode,
    isPrivate: mode === PRIVACY_MODES.private,
    isEncrypted: mode === PRIVACY_MODES.encrypted,
    isNormal: mode === PRIVACY_MODES.normal,
    isUnlocked,
    encryptionKey,
    enablePrivateMode,
    enableEncryptedMode,
    disablePrivacyMode,
    unlockApp,
    lockApp,
    panicWipe
  }

  return (
    <PrivacyContext.Provider value={value}>
      {children}
    </PrivacyContext.Provider>
  )
}

export function usePrivacy() {
  const context = useContext(PrivacyContext)
  if (!context) {
    throw new Error('usePrivacy must be used within a PrivacyProvider')
  }
  return context
}
