package com.sanctum.wear.presentation.screens

import android.os.VibrationEffect
import android.os.Vibrator
import androidx.activity.compose.BackHandler
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.getSystemService
import androidx.wear.compose.material.*

import com.sanctum.wear.audio.SoundPlayer
import com.sanctum.wear.presentation.theme.DeepPurple
import com.sanctum.wear.presentation.theme.Gold
import com.sanctum.wear.presentation.theme.LightPurple
import com.sanctum.wear.presentation.theme.TextSecondary
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun TimerRunningScreen(
    durationMin: Int,
    practiceType: String,
    alertMode: String,
    intervalMin: Int,
    onComplete: (actualSeconds: Int, completed: Boolean) -> Unit
) {
    val context = LocalContext.current
    val view = LocalView.current
    val vibrator = context.getSystemService<Vibrator>()
    val scope = rememberCoroutineScope()

    val totalSeconds = durationMin * 60
    var remainingSeconds by remember { mutableIntStateOf(totalSeconds) }
    var isRunning by remember { mutableStateOf(true) }
    var showStopConfirm by remember { mutableStateOf(false) }
    var lastIntervalFired by remember { mutableIntStateOf(0) }
    val startTimeMillis = remember { System.currentTimeMillis() }

    // Keep screen on
    DisposableEffect(Unit) {
        view.keepScreenOn = true
        onDispose { view.keepScreenOn = false }
    }

    // Back handler — confirm before leaving
    BackHandler {
        if (isRunning) {
            showStopConfirm = true
        } else {
            val elapsed = totalSeconds - remainingSeconds
            onComplete(elapsed, false)
        }
    }

    // Countdown tick
    LaunchedEffect(isRunning) {
        if (isRunning) {
            while (isRunning && remainingSeconds > 0) {
                delay(1000)
                if (isRunning) {
                    remainingSeconds--

                    // Check interval alerts
                    if (intervalMin > 0) {
                        val elapsed = totalSeconds - remainingSeconds
                        val intervalSeconds = intervalMin * 60
                        val currentInterval = elapsed / intervalSeconds
                        if (currentInterval > lastIntervalFired && elapsed > 0) {
                            lastIntervalFired = currentInterval
                            fireAlert(alertMode, vibrator, scope, isCompletion = false)
                        }
                    }

                    // Timer complete
                    if (remainingSeconds <= 0) {
                        fireAlert(alertMode, vibrator, scope, isCompletion = true)
                        onComplete(totalSeconds, true)
                    }
                }
            }
        }
    }

    // Stop confirmation dialog
    if (showStopConfirm) {
        StopConfirmDialog(
            onConfirm = {
                showStopConfirm = false
                isRunning = false
                val elapsed = totalSeconds - remainingSeconds
                onComplete(elapsed, false)
            },
            onDismiss = { showStopConfirm = false }
        )
        return
    }

    val progress = if (totalSeconds > 0) {
        (totalSeconds - remainingSeconds).toFloat() / totalSeconds
    } else 0f

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepPurple),
        contentAlignment = Alignment.Center
    ) {
        // Progress ring
        Canvas(modifier = Modifier.fillMaxSize().padding(12.dp)) {
            val strokeWidth = 8.dp.toPx()
            val arcSize = Size(size.width - strokeWidth, size.height - strokeWidth)
            val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)

            // Background track
            drawArc(
                color = LightPurple,
                startAngle = -90f,
                sweepAngle = 360f,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )

            // Progress arc
            drawArc(
                color = Gold,
                startAngle = -90f,
                sweepAngle = 360f * progress,
                useCenter = false,
                topLeft = topLeft,
                size = arcSize,
                style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
            )
        }

        // Center content
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Countdown
            Text(
                text = formatTime(remainingSeconds),
                style = MaterialTheme.typography.display1.copy(fontSize = 44.sp),
                color = if (isRunning) Gold else TextSecondary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(2.dp))

            // Practice type
            Text(
                text = practiceType,
                style = MaterialTheme.typography.caption2,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Controls
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Pause / Resume
                Button(
                    onClick = {
                        isRunning = !isRunning
                        vibrator?.vibrate(
                            VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE)
                        )
                    },
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = Gold.copy(alpha = 0.3f)
                    ),
                    modifier = Modifier.size(ButtonDefaults.DefaultButtonSize)
                ) {
                    Text(
                        text = if (isRunning) "❚❚" else "▶",
                        style = MaterialTheme.typography.title3
                    )
                }

                // Stop
                Button(
                    onClick = { showStopConfirm = true },
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = MaterialTheme.colors.error.copy(alpha = 0.7f)
                    ),
                    modifier = Modifier.size(ButtonDefaults.DefaultButtonSize)
                ) {
                    Text(
                        text = "■",
                        style = MaterialTheme.typography.title3
                    )
                }
            }
        }
    }
}

private fun formatTime(seconds: Int): String {
    val mins = seconds / 60
    val secs = seconds % 60
    return "%d:%02d".format(mins, secs)
}

private fun fireAlert(
    alertMode: String,
    vibrator: Vibrator?,
    scope: kotlinx.coroutines.CoroutineScope,
    isCompletion: Boolean
) {
    // Haptic
    if (alertMode == "silent" || alertMode == "both") {
        val pattern = if (isCompletion) {
            longArrayOf(0, 150, 100, 150, 100, 150) // triple pulse
        } else {
            longArrayOf(0, 100, 80, 100) // double pulse
        }
        vibrator?.vibrate(VibrationEffect.createWaveform(pattern, -1))
    }

    // Audio
    if (alertMode == "sound" || alertMode == "both") {
        scope.launch {
            if (isCompletion) {
                SoundPlayer.playSingingBowl()
            } else {
                SoundPlayer.playBell()
            }
        }
    }
}

@Composable
private fun StopConfirmDialog(
    onConfirm: () -> Unit,
    onDismiss: () -> Unit
) {
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
            Text(
                text = "End session?",
                style = MaterialTheme.typography.title3,
                color = Gold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = onDismiss,
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = Gold.copy(alpha = 0.3f)
                    ),
                    modifier = Modifier.size(ButtonDefaults.DefaultButtonSize)
                ) {
                    Text("No", color = Gold)
                }

                Button(
                    onClick = onConfirm,
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = MaterialTheme.colors.error.copy(alpha = 0.7f)
                    ),
                    modifier = Modifier.size(ButtonDefaults.DefaultButtonSize)
                ) {
                    Text("Yes")
                }
            }
        }
    }
}
