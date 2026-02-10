// Sync Service - Handles syncing local IndexedDB data with Firebase Firestore
import {
  collection,
  doc,
  setDoc,
  getDoc,
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

// Enable sync (also saves preference to Firestore)
export function enableSync(userId = null) {
  setSyncPrefs({ ...getSyncPrefs(), enabled: true })
  // Save to Firestore so preference syncs across devices
  if (userId && firestore) {
    saveSyncPreferenceToCloud(userId, true)
  }
}

// Disable sync (also saves preference to Firestore)
export function disableSync(userId = null) {
  setSyncPrefs({ ...getSyncPrefs(), enabled: false })
  // Save to Firestore so preference syncs across devices
  if (userId && firestore) {
    saveSyncPreferenceToCloud(userId, false)
  }
}

// Save sync preference to Firestore
async function saveSyncPreferenceToCloud(userId, enabled) {
  if (!firestore || !userId) return
  try {
    const prefDoc = doc(firestore, 'users', userId, 'settings', 'syncPreference')
    await setDoc(prefDoc, {
      enabled,
      updatedAt: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error('Error saving sync preference to cloud:', error)
  }
}

// Check if user has sync enabled in Firestore (for cross-device sync preference)
export async function getCloudSyncPreference(userId) {
  if (!firestore || !userId) return null
  try {
    const prefDoc = doc(firestore, 'users', userId, 'settings', 'syncPreference')
    const snapshot = await getDoc(prefDoc)
    if (snapshot.exists()) {
      return snapshot.data().enabled
    }
    return null // No preference saved yet
  } catch (error) {
    console.error('Error getting cloud sync preference:', error)
    return null
  }
}

// Get user's Firestore collection path
function getUserCollection(userId, storeName) {
  return collection(firestore, 'users', userId, storeName)
}

// Upload all local data to Firestore (with timestamp comparison)
export async function uploadAllData(userId) {
  if (!firestore || !userId) return { success: false, error: 'Not available' }

  try {
    for (const storeName of SYNCABLE_STORES) {
      const items = await localDb.getAll(storeName)
      const collectionRef = getUserCollection(userId, storeName)

      // Get existing cloud data to compare timestamps
      const snapshot = await getDocs(collectionRef)
      const cloudData = new Map()
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data()
        cloudData.set(docSnap.id, data)
      })

      // Use batched writes for efficiency
      const batch = writeBatch(firestore)
      let hasChanges = false

      for (const item of items) {
        const cloudItem = cloudData.get(item.id)

        // Only upload if local is newer than cloud (or cloud doesn't exist)
        const localUpdatedAt = item.updatedAt ? new Date(item.updatedAt).getTime() : 0
        const cloudUpdatedAt = cloudItem?.updatedAt ? new Date(cloudItem.updatedAt).getTime() : 0

        if (!cloudItem || localUpdatedAt > cloudUpdatedAt) {
          const docRef = doc(collectionRef, item.id)
          batch.set(docRef, {
            ...item,
            _syncedAt: serverTimestamp(),
            _userId: userId
          })
          hasChanges = true
        }
      }

      if (hasChanges) {
        await batch.commit()
      }
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
        } else if (storeName === 'dailyLogs') {
          // Special handling for dailyLogs - they have a unique index on 'date'
          // Need to check by date, not just by ID, and merge entries if both exist
          const database = await getLocalDatabase()
          const existingById = await localDb.get(storeName, data.id)

          if (existingById) {
            // Same ID exists - compare timestamps and update if cloud is newer
            const cloudUpdatedAt = data.updatedAt ? new Date(data.updatedAt).getTime() : 0
            const localUpdatedAt = existingById.updatedAt ? new Date(existingById.updatedAt).getTime() : 0

            if (cloudUpdatedAt > localUpdatedAt) {
              await database.put(storeName, data)
            }
          } else {
            // Different ID - check if a log for this date already exists
            const existingByDate = await database.getFromIndex(storeName, 'date', data.date)

            if (existingByDate) {
              // Merge entries from both logs
              const localEntries = existingByDate.entries || []
              const cloudEntries = data.entries || []

              // Combine entries, avoiding duplicates by entry ID
              const entryMap = new Map()
              localEntries.forEach(e => entryMap.set(e.id, e))
              cloudEntries.forEach(e => {
                // Cloud entry wins if same ID (it's likely newer if we're downloading)
                entryMap.set(e.id, e)
              })

              const mergedEntries = Array.from(entryMap.values())
              const mergedPractices = [...new Set(mergedEntries.map(e => e.practiceId))]

              // Use the newer timestamp
              const cloudUpdatedAt = data.updatedAt ? new Date(data.updatedAt).getTime() : 0
              const localUpdatedAt = existingByDate.updatedAt ? new Date(existingByDate.updatedAt).getTime() : 0

              const mergedLog = {
                ...existingByDate,
                entries: mergedEntries,
                practices: mergedPractices,
                updatedAt: cloudUpdatedAt > localUpdatedAt ? data.updatedAt : existingByDate.updatedAt
              }

              await database.put(storeName, mergedLog)
            } else {
              // No existing log for this date - safe to add
              await database.put(storeName, data)
            }
          }
        } else {
          // Standard handling for other stores
          const existing = await localDb.get(storeName, data.id)
          if (existing) {
            // Compare timestamps - only update if cloud data is newer
            const cloudUpdatedAt = data.updatedAt ? new Date(data.updatedAt).getTime() : 0
            const localUpdatedAt = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0

            // Only overwrite if cloud is definitively newer
            // If timestamps are equal or cloud is older, keep local data
            if (cloudUpdatedAt > localUpdatedAt) {
              // Use direct put to preserve cloud timestamp and avoid triggering re-sync
              const database = await getLocalDatabase()
              await database.put(storeName, data)
            }
            // If local is newer or equal, skip - local data wins
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
// IMPORTANT: This must match the schema in db/index.js exactly
async function getLocalDatabase() {
  const { openDB } = await import('idb')
  const DB_NAME = 'sanctum-db'
  const DB_VERSION = 7

  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Sessions store
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' })
        sessionStore.createIndex('date', 'date')
        sessionStore.createIndex('type', 'type')
      }
      // Documents store
      if (!db.objectStoreNames.contains('documents')) {
        const docStore = db.createObjectStore('documents', { keyPath: 'id' })
        docStore.createIndex('tradition', 'tradition')
        docStore.createIndex('createdAt', 'createdAt')
      }
      // Links store
      if (!db.objectStoreNames.contains('links')) {
        const linkStore = db.createObjectStore('links', { keyPath: 'id' })
        linkStore.createIndex('tags', 'tags', { multiEntry: true })
        linkStore.createIndex('createdAt', 'createdAt')
      }
      // Daily logs store
      if (!db.objectStoreNames.contains('dailyLogs')) {
        const logStore = db.createObjectStore('dailyLogs', { keyPath: 'id' })
        logStore.createIndex('date', 'date', { unique: true })
      }
      // Ceremonies store
      if (!db.objectStoreNames.contains('ceremonies')) {
        const ceremonyStore = db.createObjectStore('ceremonies', { keyPath: 'id' })
        ceremonyStore.createIndex('date', 'date')
        ceremonyStore.createIndex('type', 'type')
      }
      // Journal store
      if (!db.objectStoreNames.contains('journal')) {
        const journalStore = db.createObjectStore('journal', { keyPath: 'id' })
        journalStore.createIndex('date', 'date')
        journalStore.createIndex('type', 'type')
        journalStore.createIndex('createdAt', 'createdAt')
      }
      // Feedback store
      if (!db.objectStoreNames.contains('feedback')) {
        const feedbackStore = db.createObjectStore('feedback', { keyPath: 'id' })
        feedbackStore.createIndex('category', 'category')
        feedbackStore.createIndex('createdAt', 'createdAt')
      }
      // Milestones store
      if (!db.objectStoreNames.contains('milestones')) {
        const milestoneStore = db.createObjectStore('milestones', { keyPath: 'id' })
        milestoneStore.createIndex('date', 'date')
        milestoneStore.createIndex('annual', 'annual')
        milestoneStore.createIndex('createdAt', 'createdAt')
      }
      // Practice stats store
      if (!db.objectStoreNames.contains('practiceStats')) {
        db.createObjectStore('practiceStats', { keyPath: 'id' })
      }
      // Resources store
      if (!db.objectStoreNames.contains('resources')) {
        const resourceStore = db.createObjectStore('resources', { keyPath: 'id' })
        resourceStore.createIndex('category', 'category')
        resourceStore.createIndex('sourceType', 'sourceType')
        resourceStore.createIndex('tags', 'tags', { multiEntry: true })
        resourceStore.createIndex('createdAt', 'createdAt')
      }
      // Practices store
      if (!db.objectStoreNames.contains('practices')) {
        const practiceStore = db.createObjectStore('practices', { keyPath: 'id' })
        practiceStore.createIndex('order', 'order')
        practiceStore.createIndex('enabled', 'enabled')
      }
      // Meter readings store
      if (!db.objectStoreNames.contains('meterReadings')) {
        const meterStore = db.createObjectStore('meterReadings', { keyPath: 'id' })
        meterStore.createIndex('meterId', 'meterId')
        meterStore.createIndex('timestamp', 'timestamp')
      }
    }
  })
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
    // Download first to get latest cloud data
    // (only overwrites local if cloud is newer)
    await downloadAllData(userId)
    // Then upload local changes that are newer than cloud
    await uploadAllData(userId)

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
