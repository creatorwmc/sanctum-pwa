package com.sanctum.wear.presentation.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.wear.compose.material.*
import com.sanctum.wear.presentation.theme.DeepPurple
import com.sanctum.wear.presentation.theme.Gold

@Composable
fun HomeScreen(
    onTimerClick: () -> Unit,
    onPracticesClick: () -> Unit
) {
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
            item {
                Text(
                    text = "Sanctum",
                    style = MaterialTheme.typography.title2,
                    color = Gold,
                    textAlign = TextAlign.Center
                )
            }

            item { Spacer(modifier = Modifier.height(16.dp)) }

            item {
                Chip(
                    onClick = onTimerClick,
                    label = { Text("Timer") },
                    icon = {
                        Text(
                            text = "◷",
                            style = MaterialTheme.typography.title3
                        )
                    },
                    colors = ChipDefaults.chipColors(
                        backgroundColor = Gold.copy(alpha = 0.2f)
                    ),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }

            item { Spacer(modifier = Modifier.height(8.dp)) }

            item {
                Chip(
                    onClick = onPracticesClick,
                    label = { Text("Today") },
                    icon = {
                        Text(
                            text = "☀",
                            style = MaterialTheme.typography.title3
                        )
                    },
                    colors = ChipDefaults.chipColors(
                        backgroundColor = Gold.copy(alpha = 0.2f)
                    ),
                    modifier = Modifier.fillMaxWidth(0.9f)
                )
            }
        }
    }
}
