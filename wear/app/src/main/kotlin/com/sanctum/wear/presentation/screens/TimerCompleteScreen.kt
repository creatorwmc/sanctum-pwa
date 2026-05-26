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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.getSystemService
import androidx.wear.compose.material.*

import com.sanctum.wear.data.FirestoreRepository
import com.sanctum.wear.data.SessionData
import com.sanctum.wear.presentation.theme.DeepPurple
import com.sanctum.wear.presentation.theme.Gold
import com.sanctum.wear.presentation.theme.TextSecondary
import kotlinx.coroutines.launch

@Composable
fun TimerCompleteScreen(
    actualSeconds: Int,
    durationMin: Int,
    practiceType: String,
    completed: Boolean,
    startTimeMillis: Long,
    onDone: () -> Unit
) {
    val context = LocalContext.current
    val vibrator = context.getSystemService<Vibrator>()
    val scope = rememberCoroutineScope()
    val repository = remember { FirestoreRepository() }
    var isSaving by remember { mutableStateOf(false) }

    Scaffold(
        timeText = { TimeText() }
    ) {
        ScalingLazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(DeepPurple),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Checkmark or early stop indicator
            item {
                Text(
                    text = if (completed) "✓" else "◼",
                    style = MaterialTheme.typography.display1.copy(fontSize = 40.sp),
                    color = Gold,
                    textAlign = TextAlign.Center
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            item {
                Text(
                    text = if (completed) "Complete" else "Session Ended",
                    style = MaterialTheme.typography.title3,
                    color = Gold,
                    textAlign = TextAlign.Center
                )
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Duration display
            item {
                if (completed) {
                    Text(
                        text = formatDuration(actualSeconds),
                        style = MaterialTheme.typography.body1.copy(fontSize = 20.sp),
                        color = Gold,
                        textAlign = TextAlign.Center
                    )
                } else {
                    Text(
                        text = "${formatDuration(actualSeconds)} of ${formatDuration(durationMin * 60)}",
                        style = MaterialTheme.typography.body1,
                        color = TextSecondary,
                        textAlign = TextAlign.Center
                    )
                }
            }

            item {
                Text(
                    text = practiceType,
                    style = MaterialTheme.typography.caption1,
                    color = TextSecondary
                )
            }

            item { Spacer(modifier = Modifier.height(12.dp)) }

            // Save button
            item {
                Chip(
                    onClick = {
                        if (!isSaving) {
                            isSaving = true
                            vibrator?.vibrate(
                                VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE)
                            )
                            scope.launch {
                                try {
                                    val session = SessionData(
                                        type = practiceType,
                                        duration = durationMin * 60,
                                        actualDuration = actualSeconds,
                                        startTime = startTimeMillis,
                                        endTime = System.currentTimeMillis(),
                                        completed = completed
                                    )
                                    repository.saveSession(session)
                                } catch (_: Exception) {
                                    // Session save failed — still return to home
                                }
                                onDone()
                            }
                        }
                    },
                    label = {
                        Text(
                            text = if (isSaving) "Saving..." else "Save",
                            textAlign = TextAlign.Center,
                            color = DeepPurple,
                            modifier = Modifier.fillMaxWidth()
                        )
                    },
                    colors = ChipDefaults.chipColors(backgroundColor = Gold),
                    modifier = Modifier.fillMaxWidth(0.7f),
                    enabled = !isSaving
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Discard
            item {
                CompactChip(
                    onClick = { onDone() },
                    label = {
                        Text(
                            text = "Discard",
                            color = TextSecondary,
                            style = MaterialTheme.typography.caption2
                        )
                    },
                    colors = ChipDefaults.chipColors(
                        backgroundColor = Gold.copy(alpha = 0.1f)
                    )
                )
            }
        }
    }
}

private fun formatDuration(seconds: Int): String {
    val mins = seconds / 60
    val secs = seconds % 60
    return "%d:%02d".format(mins, secs)
}
