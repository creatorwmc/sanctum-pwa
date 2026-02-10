package com.sanctum.wear.presentation.screens

import android.os.VibrationEffect
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

    var practices by remember { mutableStateOf<List<Practice>>(emptyList()) }
    var completedIds by remember { mutableStateOf<Set<String>>(emptySet()) }
    var isLoading by remember { mutableStateOf(true) }

    // Load practices on mount
    LaunchedEffect(Unit) {
        try {
            val (loadedPractices, completed) = repository.getTodaysPractices()
            practices = loadedPractices
            completedIds = completed
        } catch (e: Exception) {
            // Handle error - show empty state
        }
        isLoading = false
    }

    fun togglePractice(practice: Practice) {
        vibrator?.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))

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

    Scaffold(
        timeText = { TimeText() }
    ) {
        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(DeepPurple),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(indicatorColor = Gold)
            }
        } else if (practices.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(DeepPurple),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No practices\nset up yet",
                    style = MaterialTheme.typography.body1,
                    color = TextSecondary,
                    textAlign = TextAlign.Center
                )
            }
        } else {
            ScalingLazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .background(DeepPurple),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
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

                // Summary
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
    }
}
