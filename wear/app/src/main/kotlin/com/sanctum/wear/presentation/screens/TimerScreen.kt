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
import com.sanctum.wear.presentation.theme.DeepPurple
import com.sanctum.wear.presentation.theme.Gold
import com.sanctum.wear.presentation.theme.TextPrimary
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun TimerScreen(onBack: () -> Unit) {
    val context = LocalContext.current
    val vibrator = context.getSystemService<Vibrator>()
    val scope = rememberCoroutineScope()
    val repository = remember { FirestoreRepository() }

    var isRunning by remember { mutableStateOf(false) }
    var elapsedSeconds by remember { mutableLongStateOf(0L) }
    var startTime by remember { mutableLongStateOf(0L) }

    // Timer tick
    LaunchedEffect(isRunning) {
        if (isRunning) {
            startTime = System.currentTimeMillis() - (elapsedSeconds * 1000)
            while (isRunning) {
                elapsedSeconds = (System.currentTimeMillis() - startTime) / 1000
                delay(1000)
            }
        }
    }

    fun formatTime(seconds: Long): String {
        val mins = seconds / 60
        val secs = seconds % 60
        return "%d:%02d".format(mins, secs)
    }

    fun handleStartStop() {
        if (isRunning) {
            // Stopping - save session
            isRunning = false
            vibrator?.vibrate(VibrationEffect.createOneShot(100, VibrationEffect.DEFAULT_AMPLITUDE))

            if (elapsedSeconds >= 60) {
                scope.launch {
                    repository.saveSession(elapsedSeconds)
                }
            }
        } else {
            // Starting
            if (elapsedSeconds > 0) {
                elapsedSeconds = 0
            }
            isRunning = true
            vibrator?.vibrate(VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE))
        }
    }

    fun handleReset() {
        isRunning = false
        elapsedSeconds = 0
    }

    Scaffold(
        timeText = { TimeText() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(DeepPurple),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Timer display
            Text(
                text = formatTime(elapsedSeconds),
                style = MaterialTheme.typography.display1.copy(fontSize = 48.sp),
                color = if (isRunning) Gold else TextPrimary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Start/Stop button
            Button(
                onClick = { handleStartStop() },
                colors = ButtonDefaults.buttonColors(
                    backgroundColor = if (isRunning)
                        MaterialTheme.colors.error.copy(alpha = 0.8f)
                    else
                        Gold
                ),
                modifier = Modifier.size(ButtonDefaults.LargeButtonSize)
            ) {
                Text(
                    text = if (isRunning) "Stop" else "Start",
                    style = MaterialTheme.typography.button
                )
            }

            // Reset button (only show when stopped with time)
            if (!isRunning && elapsedSeconds > 0) {
                Spacer(modifier = Modifier.height(8.dp))
                CompactChip(
                    onClick = { handleReset() },
                    label = { Text("Reset", style = MaterialTheme.typography.caption3) }
                )
            }
        }
    }
}
