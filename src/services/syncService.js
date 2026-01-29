// Sync Service - Handles syncing local IndexedDB data with Firebase Firestore
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'
import { firestore, isFirebaseConfigured } from '../config/firebase'
import { db as localDb } from '../db'

const SYNC_PREFS_KEY = 'sanctum-sync-prefs'
const LAST_SYNC_KEY = 'sanctum-last-sync'
const SYNC_DEBOUNCE_MS = 2000 // Wait 2 seconds after last change before syncing

// Collections to sync
const SYNCABLE_STORES = [
  'sessions',
  'dailyLogs',
  'journal',
  'ceremonies',
  'milestones',
  'practiceStats',
  'practices',
  'feedback'
]

// Auto-sync state
let autoSyncTimeout = null
let pendingChanges = new Map() // storeName -> Set of item IDs
let currentUserId = null
let isAutoSyncInitialized = false

// Get sync preferences
export function getSyncPrefs() {
  try {
    const saved = localStorage.getItem(SYNC_PREFS_KEY)
    return saved ? JSON.parse(saved) : { enabled: false, lastSync: null }
  } catch {
    return { enabled: false, lastSync: null }
  }
}

// Save sync preferences
export function setSyncPrefs(prefs) {
  localStorage.setItem(SYNC_PREFS_KEY, JSON.stringify(prefs))
}

// Check if sync is enabled and available
export function isSyncEnabled() {
  if (!isFirebaseConfigured() || !firestore) return false
  const prefs = getSyncPrefs()
  return prefs.enabled
}

// Enable sync
export function enableSync() {
  setSyncPrefs({ ...getSyncPrefs(), enabled: true })
}

// Disable sync
export function disableSync() {
  setSyncPrefs({ ...getSyncPrefs(), enabled: false })
}

// Get user's Firestore collection path
function getUserCollection(userId, storeName) {
  return collection(firestore, 'users', userId, storeName)
}

// Upload all local data to Firestore
export async function uploadAllData(userId) {
  if (!firestore || !userId) return { success: false, error: 'Not available' }

  try {
    for (const storeName of SYNCABLE_STORES) {
      const items = await localDb.getAll(storeName)
      const collectionRef = getUserCollection(userId, storeName)

      // Use batched writes for efficiency
      const batch = writeBatch(firestore)

      for (const item of items) {
        const docRef = doc(collectionRef, item.id)
        batch.set(docRef, {
          ...item,
          _syncedAt: serverTimestamp(),
          _userId: userId
        })
      }

      await batch.commit()
    }

    // Update last sync time
    const now = new Date().toISOString()
    localStorage.setItem(LAST_SYNC_KEY, now)
    setSyncPrefs({ ...getSyncPrefs(), lastSync: now })

    return { success: true }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: error.message }
  }
}

// Download all data from Firestore to local
export async function downloadAllData(userId) {
  if (!firestore || !userId) return { success: false, error: 'Not available' }

  try {
    for (const storeName of SYNCABLE_STORES) {
      const collectionRef = getUserCollection(userId, storeName)
      const snapshot = await getDocs(collectionRef)

      // For practices, replace entirely instead of merging
      // This ensures tradition presets sync correctly across devices
      if (storeName === 'practices' && snapshot.docs.length > 0) {
        const database = await getLocalDatabase()
        await database.clear('practices')
      }

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data()
        // Remove Firestore-specific fields
        delete data._syncedAt
        delete data._userId

        // For practices (after clear) or non-practices, just put the data
        if (storeName === 'practices') {
          const database = await getLocalDatabase()
          await database.put(storeName, data)
        } else {
          // Check if item exists locally
          const existing = await localDb.get(storeName, data.id)
          if (existing) {
            await localDb.update(storeName, data)
          } else {
            // Add without generating new ID
            const database = await getLocalDatabase()
            await database.put(storeName, data)
          }
        }
      }
    }

    // Update last sync time
    const now = new Date().toISOString()
    localStorage.setItem(LAST_SYNC_KEY, now)
    setSyncPrefs({ ...getSyncPrefs(), lastSync: now })

    return { success: true }
  } catch (error) {
    console.error('Download error:', error)
    return { success: false, error: error.message }
  }
}

// Helper to get raw database instance
async function getLocalDatabase() {
  const { openDB } = await import('idb')
  // Match the version in db/index.js
  return openDB('sanctum-db', 7)
}

// Sync a single item (for real-time sync)
export async function syncItem(userId, storeName, item) {
  if (!firestore || !userId || !isSyncEnabled()) return

  try {
    const collectionRef = getUserCollection(userId, storeName)
    const docRef = doc(collectionRef, item.id)
    await setDoc(docRef, {
      ...item,
      _syncedAt: serverTimestamp(),
      _userId: userId
    })
  } catch (error) {
    console.error('Sync item error:', error)
  }
}

// Delete a synced item
export async function deleteSyncedItem(userId, storeName, itemId) {
  if (!firestore || !userId || !isSyncEnabled()) return

  try {
    const collectionRef = getUserCollection(userId, storeName)
    const docRef = doc(collectionRef, itemId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Delete synced item error:', error)
  }
}

// Full sync (merge local and cloud)
export async function fullSync(userId) {
  if (!firestore || !userId) return { success: false, error: 'Not available' }

  try {
    // First upload local data
    await uploadAllData(userId)
    // Then download any cloud-only data
    await downloadAllData(userId)

    return { success: true }
  } catch (error) {
    console.error('Full sync error:', error)
    return { success: false, error: error.message }
  }
}

// Get last sync time
export function getLastSyncTime() {
  const prefs = getSyncPrefs()
  return prefs.lastSync
}

// Clear all cloud data for user
export async function clearCloudData(userId) {
  if (!firestore || !userId) return { success: false, error: 'Not available' }

  try {
    for (const storeName of SYNCABLE_STORES) {
      const collectionRef = getUserCollection(userId, storeName)
      const snapshot = await getDocs(collectionRef)

      const batch = writeBatch(firestore)
      snapshot.docs.forEach(docSnap => {
        batch.delete(docSnap.ref)
      })
      await batch.commit()
    }

    return { success: true }
  } catch (error) {
    console.error('Clear cloud data error:', error)
    return { success: false, error: error.message }
  }
}

// ============ AUTO-SYNC FUNCTIONS ============

// Initialize auto-sync for a user
export function initAutoSync(userId) {
  if (!userId || !isFirebaseConfigured() || !firestore) return

  currentUserId = userId
  isAutoSyncInitialized = true

  // Do initial sync on login (download cloud data)
  if (isSyncEnabled()) {
    console.log('[Sync] Auto-sync initialized, performing initial sync...')
    downloadAllData(userId).then(result => {
      if (result.success) {
        console.log('[Sync] Initial download complete')
      }
    }).catch(err => {
      console.error('[Sync] Initial sync error:', err)
    })
  }
}

// Stop auto-sync (on logout)
export function stopAutoSync() {
  currentUserId = null
  isAutoSyncInitialized = false
  pendingChanges.clear()
  if (autoSyncTimeout) {
    clearTimeout(autoSyncTimeout)
    autoSyncTimeout = null
  }
}

// Queue a change to be synced (debounced)
export function queueSync(storeName, itemId) {
  if (!isSyncEnabled() || !currentUserId) return
  if (!SYNCABLE_STORES.includes(storeName)) return

  // Add to pending changes
  if (!pendingChanges.has(storeName)) {
    pendingChanges.set(storeName, new Set())
  }
  pendingChanges.get(storeName).add(itemId)

  // Debounce: reset timer on each change
  if (autoSyncTimeout) {
    clearTimeout(autoSyncTimeout)
  }

  autoSyncTimeout = setTimeout(() => {
    flushPendingChanges()
  }, SYNC_DEBOUNCE_MS)
}

// Queue a deletion to be synced
export function queueDelete(storeName, itemId) {
  if (!isSyncEnabled() || !currentUserId) return
  if (!SYNCABLE_STORES.includes(storeName)) return

  // Immediately sync deletions (they're quick and important)
  deleteSyncedItem(currentUserId, storeName, itemId)
}

// Flush all pending changes to Firestore
async function flushPendingChanges() {
  if (!currentUserId || pendingChanges.size === 0) return

  console.log('[Sync] Flushing pending changes...')

  try {
    for (const [storeName, itemIds] of pendingChanges) {
      const collectionRef = getUserCollection(currentUserId, storeName)
      const batch = writeBatch(firestore)

      for (const itemId of itemIds) {
        const item = await localDb.get(storeName, itemId)
        if (item) {
          const docRef = doc(collectionRef, itemId)
          batch.set(docRef, {
            ...item,
            _syncedAt: serverTimestamp(),
            _userId: currentUserId
          })
        }
      }

      await batch.commit()
    }

    // Clear pending changes
    pendingChanges.clear()

    // Update last sync time
    const now = new Date().toISOString()
    localStorage.setItem(LAST_SYNC_KEY, now)
    setSyncPrefs({ ...getSyncPrefs(), lastSync: now })

    console.log('[Sync] Changes synced successfully')
  } catch (error) {
    console.error('[Sync] Error flushing changes:', error)
    // Keep pending changes to retry later
  }
}

// Check if auto-sync is active
export function isAutoSyncActive() {
  return isAutoSyncInitialized && currentUserId && isSyncEnabled()
}
