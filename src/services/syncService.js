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

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data()
        // Remove Firestore-specific fields
        delete data._syncedAt
        delete data._userId

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
  return openDB('sanctum-db', 5)
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
