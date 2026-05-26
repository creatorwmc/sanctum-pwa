package com.sanctum.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.*

import com.sanctum.wear.audio.SoundPlayer
import com.sanctum.wear.presentation.theme.DeepPurple
import com.sanctum.wear.presentation.theme.Gold
import com.sanctum.wear.presentation.theme.TextSecondary
import kotlinx.coroutines.launch

@Composable
fun TimerSettingsScreen(
    initialAlertMode: String,
    initialIntervalMin: Int,
    onSave: (alertMode: String, intervalMin: Int) -> Unit
) {
    var alertMode by remember { mutableStateOf(initialAlertMode) }
    var intervalMin by remember { mutableIntStateOf(initialIntervalMin) }
    val scope = rememberCoroutineScope()

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
                    text = "Settings",
                    style = MaterialTheme.typography.title3,
                    color = Gold
                )
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Alert Mode section
            item {
                Text(
                    text = "Alert Mode",
                    style = MaterialTheme.typography.caption1,
                    color = TextSecondary
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            item {
                val modes = listOf("silent" to "Silent", "sound" to "Sound", "both" to "Both")
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Spacer(modifier = Modifier.weight(1f))
                    modes.forEach { (key, label) ->
                        CompactChip(
                            onClick = { alertMode = key },
                            label = {
                                Text(
                                    text = label,
                                    color = if (alertMode == key) DeepPurple else Gold
                                )
                            },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = if (alertMode == key) Gold
                                else Gold.copy(alpha = 0.2f)
                            )
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                }
            }

            item { Spacer(modifier = Modifier.height(12.dp)) }

            // Interval section
            item {
                Text(
                    text = "Interval",
                    style = MaterialTheme.typography.caption1,
                    color = TextSecondary
                )
            }

            item { Spacer(modifier = Modifier.height(4.dp)) }

            // Interval row 1
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Spacer(modifier = Modifier.weight(1f))
                    listOf(0 to "Off", 1 to "1m", 2 to "2m").forEach { (value, label) ->
                        CompactChip(
                            onClick = { intervalMin = value },
                            label = {
                                Text(
                                    text = label,
                                    color = if (intervalMin == value) DeepPurple else Gold
                                )
                            },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = if (intervalMin == value) Gold
                                else Gold.copy(alpha = 0.2f)
                            )
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                }
            }

            // Interval row 2
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Spacer(modifier = Modifier.weight(1f))
                    listOf(5 to "5m", 10 to "10m", 15 to "15m").forEach { (value, label) ->
                        CompactChip(
                            onClick = { intervalMin = value },
                            label = {
                                Text(
                                    text = label,
                                    color = if (intervalMin == value) DeepPurple else Gold
                                )
                            },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = if (intervalMin == value) Gold
                                else Gold.copy(alpha = 0.2f)
                            )
                        )
                    }
                    Spacer(modifier = Modifier.weight(1f))
                }
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            // Sound preview (only when alert mode includes sound)
            if (alertMode != "silent") {
                item {
                    Text(
                        text = "Preview",
                        style = MaterialTheme.typography.caption1,
                        color = TextSecondary
                    )
                }

                item { Spacer(modifier = Modifier.height(4.dp)) }

                item {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Spacer(modifier = Modifier.weight(1f))
                        CompactChip(
                            onClick = { scope.launch { SoundPlayer.playBell() } },
                            label = { Text("Bell", color = Gold) },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = Gold.copy(alpha = 0.2f)
                            )
                        )
                        CompactChip(
                            onClick = { scope.launch { SoundPlayer.playSingingBowl() } },
                            label = { Text("Bowl", color = Gold) },
                            colors = ChipDefaults.chipColors(
                                backgroundColor = Gold.copy(alpha = 0.2f)
                            )
                        )
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }

                item { Spacer(modifier = Modifier.height(8.dp)) }
            }

            // Done button
            item {
                Chip(
                    onClick = { onSave(alertMode, intervalMin) },
                    label = {
                        Text(
                            text = "Done",
                            textAlign = TextAlign.Center,
                            color = DeepPurple,
                            modifier = Modifier.fillMaxWidth()
                        )
                    },
                    colors = ChipDefaults.chipColors(backgroundColor = Gold),
                    modifier = Modifier.fillMaxWidth(0.7f)
                )
            }
        }
    }
}
