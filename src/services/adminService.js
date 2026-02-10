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

// ============ TRADITION FEEDBACK FUNCTIONS ============

// Submit tradition feedback (from any user)
export async function submitTraditionFeedback(feedbackData) {
  if (!firestore) return { success: false, error: 'Firebase not configured' }

  try {
    const feedbackRef = collection(firestore, 'traditionFeedback')
    const newFeedbackRef = doc(feedbackRef)

    await setDoc(newFeedbackRef, {
      ...feedbackData,
      timestamp: serverTimestamp(),
      status: 'new'
    })

    return { success: true, id: newFeedbackRef.id }
  } catch (error) {
    console.error('Error submitting tradition feedback:', error)
    return { success: false, error: error.message }
  }
}

// Get all tradition feedback (admin only)
export async function getAllTraditionFeedback(limitCount = 200) {
  if (!firestore) return []

  try {
    const feedbackRef = collection(firestore, 'traditionFeedback')
    const q = query(feedbackRef, orderBy('timestamp', 'desc'), limit(limitCount))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching tradition feedback:', error)
    return []
  }
}

// Update tradition feedback status (admin only)
export async function updateTraditionFeedbackStatus(feedbackId, status) {
  if (!firestore) return false

  try {
    await setDoc(
      doc(firestore, 'traditionFeedback', feedbackId),
      { status, updatedAt: serverTimestamp() },
      { merge: true }
    )
    return true
  } catch (error) {
    console.error('Error updating tradition feedback:', error)
    return false
  }
}

// Delete tradition feedback (admin only)
export async function deleteTraditionFeedback(feedbackId) {
  if (!firestore) return false

  try {
    await deleteDoc(doc(firestore, 'traditionFeedback', feedbackId))
    return true
  } catch (error) {
    console.error('Error deleting tradition feedback:', error)
    return false
  }
}

// Get tradition feedback count
export async function getTraditionFeedbackCount() {
  if (!firestore) return { total: 0, new: 0 }

  try {
    const feedbackRef = collection(firestore, 'traditionFeedback')
    const snapshot = await getDocs(feedbackRef)
    const docs = snapshot.docs.map(d => d.data())

    return {
      total: docs.length,
      new: docs.filter(d => !d.status || d.status === 'new').length
    }
  } catch (error) {
    console.error('Error counting tradition feedback:', error)
    return { total: 0, new: 0 }
  }
}
