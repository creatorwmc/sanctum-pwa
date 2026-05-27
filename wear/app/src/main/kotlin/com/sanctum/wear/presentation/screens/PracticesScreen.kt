package com.sanctum.wear.presentation.screens

import android.os.Vibrator
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.core.content.getSystemService
import androidx.wear.compose.material.*

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.kairos.wear.common.data.observeListAs
import com.kairos.wear.common.data.rememberFirestoreList
import com.kairos.wear.common.haptics.tap
import com.kairos.wear.common.ui.WearScreen
import com.sanctum.wear.data.FirestoreRepository
import com.sanctum.wear.data.Practice
import com.sanctum.wear.presentation.theme.DeepPurple
import com.sanctum.wear.presentation.theme.Gold
import com.sanctum.wear.presentation.theme.TextSecondary
import kotlinx.coroutines.launch

@Composable
fun PracticesScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val vibrator = context.getSystemService<Vibrator>()
    val scope = rememberCoroutineScope()
    val repository = remember { FirestoreRepository() }
    val uid = FirebaseAuth.getInstance().currentUser?.uid

    val practices by rememberFirestoreList(key = uid) {
        FirebaseFirestore.getInstance()
            .collection("users")
            .document(uid ?: "_none_")
            .collection("practices")
            .observeListAs { doc ->
                val name = doc.getString("name") ?: return@observeListAs null
                Practice(
                    id = doc.id,
                    name = name,
                    category = doc.getString("category") ?: ""
                )
            }
    }

    var completedIds by remember { mutableStateOf<Set<String>>(emptySet()) }

    LaunchedEffect(uid) {
        completedIds = repository.getTodaysPractices().second
    }

    fun togglePractice(practice: Practice) {
        vibrator?.tap()

        val newCompleted = if (completedIds.contains(practice.id)) {
            completedIds - practice.id
        } else {
            completedIds + practice.id
        }
        completedIds = newCompleted

        scope.launch {
            repository.updatePracticeCompletion(practice.id, newCompleted.contains(practice.id))
        }
    }

    if (practices.isEmpty()) {
        Scaffold(timeText = { TimeText() }) {
            Box(
                modifier = Modifier.fillMaxSize().background(DeepPurple),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No practices\nset up yet",
                    style = MaterialTheme.typography.body1,
                    color = TextSecondary,
                    textAlign = TextAlign.Center
                )
            }
        }
        return
    }

    WearScreen(modifier = Modifier.background(DeepPurple)) {
        item {
            Text(
                text = "Today",
                style = MaterialTheme.typography.title3,
                color = Gold
            )
        }

        item { Spacer(modifier = Modifier.height(8.dp)) }

        items(practices.size) { index ->
            val practice = practices[index]
            val isCompleted = completedIds.contains(practice.id)

            ToggleChip(
                checked = isCompleted,
                onCheckedChange = { togglePractice(practice) },
                label = {
                    Text(
                        text = practice.name,
                        textDecoration = if (isCompleted)
                            TextDecoration.LineThrough
                        else
                            TextDecoration.None,
                        color = if (isCompleted) TextSecondary else Gold
                    )
                },
                toggleControl = {
                    Icon(
                        imageVector = ToggleChipDefaults.checkboxIcon(isCompleted),
                        contentDescription = if (isCompleted) "Completed" else "Not completed"
                    )
                },
                modifier = Modifier.fillMaxWidth(0.9f)
            )

            Spacer(modifier = Modifier.height(4.dp))
        }

        item {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "${completedIds.size}/${practices.size}",
                style = MaterialTheme.typography.caption1,
                color = TextSecondary
            )
        }
    }
}
