package com.sanctum.wear.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await
import java.text.SimpleDateFormat
import java.util.*

data class Practice(
    val id: String,
    val name: String,
    val category: String = ""
)

class FirestoreRepository {
    private val firestore = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    private fun getUserId(): String? = auth.currentUser?.uid

    private fun getTodayKey(): String {
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        return sdf.format(Date())
    }

    /**
     * Save a meditation session to Firestore
     * Matches the PWA's sessions collection structure
     */
    suspend fun saveSession(durationSeconds: Long) {
        val userId = getUserId() ?: return

        val session = hashMapOf(
            "duration" to durationSeconds.toInt(),
            "date" to Date(),
            "timestamp" to System.currentTimeMillis(),
            "type" to "meditation",
            "source" to "watch"
        )

        firestore
            .collection("users")
            .document(userId)
            .collection("sessions")
            .add(session)
            .await()
    }

    /**
     * Get today's practices and their completion status
     * Reads from the same structure as the PWA
     */
    suspend fun getTodaysPractices(): Pair<List<Practice>, Set<String>> {
        val userId = getUserId() ?: return Pair(emptyList(), emptySet())
        val todayKey = getTodayKey()

        // Get practices list
        val practicesSnapshot = firestore
            .collection("users")
            .document(userId)
            .collection("practices")
            .get()
            .await()

        val practices = practicesSnapshot.documents.mapNotNull { doc ->
            val name = doc.getString("name") ?: return@mapNotNull null
            Practice(
                id = doc.id,
                name = name,
                category = doc.getString("category") ?: ""
            )
        }

        // Get today's log to see what's completed
        val logDoc = firestore
            .collection("users")
            .document(userId)
            .collection("dailyLogs")
            .document(todayKey)
            .get()
            .await()

        val completedIds = if (logDoc.exists()) {
            @Suppress("UNCHECKED_CAST")
            val completed = logDoc.get("completedPractices") as? List<String> ?: emptyList()
            completed.toSet()
        } else {
            emptySet()
        }

        return Pair(practices, completedIds)
    }

    /**
     * Update practice completion status for today
     */
    suspend fun updatePracticeCompletion(practiceId: String, completed: Boolean) {
        val userId = getUserId() ?: return
        val todayKey = getTodayKey()

        val logRef = firestore
            .collection("users")
            .document(userId)
            .collection("dailyLogs")
            .document(todayKey)

        val logDoc = logRef.get().await()

        val currentCompleted = if (logDoc.exists()) {
            @Suppress("UNCHECKED_CAST")
            (logDoc.get("completedPractices") as? List<String>)?.toMutableList() ?: mutableListOf()
        } else {
            mutableListOf()
        }

        if (completed && !currentCompleted.contains(practiceId)) {
            currentCompleted.add(practiceId)
        } else if (!completed) {
            currentCompleted.remove(practiceId)
        }

        val data = hashMapOf(
            "date" to todayKey,
            "completedPractices" to currentCompleted,
            "lastUpdated" to System.currentTimeMillis(),
            "source" to "watch"
        )

        logRef.set(data, com.google.firebase.firestore.SetOptions.merge()).await()
    }
}
