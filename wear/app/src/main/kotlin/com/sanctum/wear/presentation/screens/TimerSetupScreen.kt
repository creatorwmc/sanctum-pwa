package com.sanctum.wear.presentation.screens

import android.os.VibrationEffect
import android.os.Vibrator
import androidx.compose.foundation.background
import androidx.compose.foundation.focusable
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.input.rotary.onRotaryScrollEvent
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.getSystemService
import androidx.wear.compose.material.*

import com.sanctum.wear.presentation.theme.DeepPurple
import com.sanctum.wear.presentation.theme.Gold
import com.sanctum.wear.presentation.theme.TextSecondary

val PRACTICE_TYPES = listOf(
    "Meditation", "Breathwork", "Visualization",
    "Ritual", "Study", "Contemplation", "Other"
)

@Composable
fun TimerSetupScreen(
    onBegin: (durationMin: Int, practiceType: String, alertMode: String, intervalMin: Int) -> Unit,
    onSettings: (alertMode: String, intervalMin: Int) -> Unit,
    alertMode: String = "both",
    intervalMin: Int = 5
) {
    val context = LocalContext.current
    val vibrator = context.getSystemService<Vibrator>()
    val focusRequester = remember { FocusRequester() }

    var durationMinutes by remember { mutableIntStateOf(10) }
    var showTypePicker by remember { mutableStateOf(false) }
    var selectedTypeIndex by remember { mutableIntStateOf(0) }

    LaunchedEffect(Unit) {
        focusRequester.requestFocus()
    }

    if (showTypePicker) {
        PracticeTypePicker(
            selectedIndex = selectedTypeIndex,
            onSelect = { index ->
                selectedTypeIndex = index
                showTypePicker = false
            }
        )
        return
    }

    Scaffold(
        timeText = { TimeText() }
    ) {
        ScalingLazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(DeepPurple)
                .onRotaryScrollEvent { event ->
                    val delta = if (event.verticalScrollPixels > 0) 1 else -1
                    durationMinutes = (durationMinutes + delta).coerceIn(1, 90)
                    vibrator?.vibrate(
                        VibrationEffect.createOneShot(10, VibrationEffect.DEFAULT_AMPLITUDE)
                    )
                    true
                }
                .focusRequester(focusRequester)
                .focusable(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Duration display
            item {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "$durationMinutes",
                        style = MaterialTheme.typography.display1.copy(fontSize = 52.sp),
                        color = Gold,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = "min",
                        style = MaterialTheme.typography.caption1,
                        color = TextSecondary
                    )
                }
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Preset chips - row 1
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Spacer(modifier = Modifier.weight(1f))
                    listOf(5, 10, 15).forEach { preset ->
                        CompactChip(
                            onClick = {
                                durationMinutes = preset
                                vibrator?.vibrate(
                                    VibrationEffect.createOneShot(10, VibrationEffect.DEFAULT_AMPLITUDE)
                                )
                            },
                            label = {
                                Text(
                                    text = "$preset",
                                    color = if (durationMinutes == preset) DeepPurple else Gold
                                )
                            },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = if (durationMinutes == preset) Gold
                                else Gold.copy(alpha = 0.2f)
                            )
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                }
            }

            // Preset chips - row 2
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Spacer(modifier = Modifier.weight(1f))
                    listOf(20, 30, 60).forEach { preset ->
                        CompactChip(
                            onClick = {
                                durationMinutes = preset
                                vibrator?.vibrate(
                                    VibrationEffect.createOneShot(10, VibrationEffect.DEFAULT_AMPLITUDE)
                                )
                            },
                            label = {
                                Text(
                                    text = "$preset",
                                    color = if (durationMinutes == preset) DeepPurple else Gold
                                )
                            },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = if (durationMinutes == preset) Gold
                                else Gold.copy(alpha = 0.2f)
                            )
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                }
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Practice type selector
            item {
                CompactChip(
                    onClick = { showTypePicker = true },
                    label = {
                        Text(
                            text = PRACTICE_TYPES[selectedTypeIndex],
                            color = Gold
                        )
                    },
                    colors = ChipDefaults.chipColors(
                        backgroundColor = Gold.copy(alpha = 0.15f)
                    )
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Settings chip
            item {
                CompactChip(
                    onClick = { onSettings(alertMode, intervalMin) },
                    label = {
                        val modeLabel = when (alertMode) {
                            "silent" -> "Silent"
                            "sound" -> "Sound"
                            else -> "Both"
                        }
                        val intervalLabel = if (intervalMin == 0) "Off" else "${intervalMin}m"
                        Text(
                            text = "⚙ $modeLabel · $intervalLabel",
                            color = TextSecondary,
                            style = MaterialTheme.typography.caption2
                        )
                    },
                    colors = ChipDefaults.chipColors(
                        backgroundColor = Gold.copy(alpha = 0.1f)
                    )
                )
            }

            item { Spacer(modifier = Modifier.height(12.dp)) }

            // Begin button
            item {
                Button(
                    onClick = {
                        vibrator?.vibrate(
                            VibrationEffect.createOneShot(50, VibrationEffect.DEFAULT_AMPLITUDE)
                        )
                        onBegin(
                            durationMinutes,
                            PRACTICE_TYPES[selectedTypeIndex],
                            alertMode,
                            intervalMin
                        )
                    },
                    colors = ButtonDefaults.buttonColors(backgroundColor = Gold),
                    modifier = Modifier.size(ButtonDefaults.LargeButtonSize)
                ) {
                    Text(
                        text = "Begin",
                        style = MaterialTheme.typography.button,
                        color = DeepPurple
                    )
                }
            }
        }
    }
}

@Composable
private fun PracticeTypePicker(
    selectedIndex: Int,
    onSelect: (Int) -> Unit
) {
    Scaffold(
        timeText = { TimeText() }
    ) {
        ScalingLazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(DeepPurple),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Text(
                    text = "Practice",
                    style = MaterialTheme.typography.title3,
                    color = Gold
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            items(PRACTICE_TYPES.size) { index ->
                val type = PRACTICE_TYPES[index]
                val isSelected = index == selectedIndex

                Chip(
                    onClick = { onSelect(index) },
                    label = {
                        Text(
                            text = type,
                            color = if (isSelected) DeepPurple else Gold
                        )
                    },
                    colors = ChipDefaults.chipColors(
                        backgroundColor = if (isSelected) Gold
                        else Gold.copy(alpha = 0.2f)
                    ),
                    modifier = Modifier.fillMaxWidth(0.85f)
                )

                Spacer(modifier = Modifier.height(2.dp))
            }
        }
    }
}
