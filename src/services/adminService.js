// Admin Service - Handles admin-only operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore'
import { firestore, isFirebaseConfigured } from '../config/firebase'

// Check if a user is an admin
export async function isUserAdmin(userId) {
  if (!firestore || !userId) return false

  try {
    const adminDoc = await getDoc(doc(firestore, 'admins', userId))
    return adminDoc.exists() && adminDoc.data()?.isAdmin === true
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

// Set a user as admin (must be done by existing admin or in Firebase console)
export async function setUserAsAdmin(userId, email) {
  if (!firestore || !userId) return false

  try {
    await setDoc(doc(firestore, 'admins', userId), {
      isAdmin: true,
      email: email,
      createdAt: serverTimestamp()
    })
    return true
  } catch (error) {
    console.error('Error setting admin:', error)
    return false
  }
}

// Get all whispers/feedback from all users (admin only)
export async function getAllWhispers(limitCount = 100) {
  if (!firestore) return []

  try {
    // Whispers are stored in a global collection
    const whispersRef = collection(firestore, 'whispers')
    const q = query(whispersRef, orderBy('timestamp', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching whispers:', error)
    return []
  }
}

// Submit a whisper (from any user)
export async function submitWhisper(whisperData) {
  if (!firestore) return { success: false, error: 'Firebase not configured' }

  try {
    const whispersRef = collection(firestore, 'whispers')
    const newWhisperRef = doc(whispersRef)

    await setDoc(newWhisperRef, {
      ...whisperData,
      timestamp: serverTimestamp(),
      read: false
    })

    return { success: true, id: newWhisperRef.id }
  } catch (error) {
    console.error('Error submitting whisper:', error)
    return { success: false, error: error.message }
  }
}

// Mark a whisper as read (admin only)
export async function markWhisperRead(whisperId, read = true) {
  if (!firestore) return false

  try {
    await setDoc(doc(firestore, 'whispers', whisperId), { read }, { merge: true })
    return true
  } catch (error) {
    console.error('Error marking whisper read:', error)
    return false
  }
}

// Delete a whisper (admin only)
export async function deleteWhisper(whisperId) {
  if (!firestore) return false

  try {
    await deleteDoc(doc(firestore, 'whispers', whisperId))
    return true
  } catch (error) {
    console.error('Error deleting whisper:', error)
    return false
  }
}

// Get whisper count (for badges)
export async function getUnreadWhisperCount() {
  if (!firestore) return 0

  try {
    const whispersRef = collection(firestore, 'whispers')
    const snapshot = await getDocs(whispersRef)
    return snapshot.docs.filter(doc => !doc.data().read).length
  } catch (error) {
    console.error('Error counting whispers:', error)
    return 0
  }
}
