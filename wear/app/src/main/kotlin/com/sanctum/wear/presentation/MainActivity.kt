package com.sanctum.wear.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.*
import androidx.wear.compose.navigation.SwipeDismissableNavHost
import androidx.wear.compose.navigation.composable
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import com.sanctum.wear.presentation.screens.*
import com.sanctum.wear.presentation.theme.SanctumWearTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SanctumWearApp()
        }
    }
}

@Composable
fun SanctumWearApp() {
    SanctumWearTheme {
        val navController = rememberSwipeDismissableNavController()

        // Shared timer settings state (persists across setup <-> settings navigation)
        var alertMode by remember { mutableStateOf("both") }
        var intervalMin by remember { mutableIntStateOf(5) }

        // Timer session state (for passing to complete screen)
        var sessionStartTime by remember { mutableLongStateOf(0L) }
        var sessionDurationMin by remember { mutableIntStateOf(0) }
        var sessionPracticeType by remember { mutableStateOf("Meditation") }

        SwipeDismissableNavHost(
            navController = navController,
            startDestination = "home"
        ) {
            composable("home") {
                HomeScreen(
                    onTimerClick = { navController.navigate("timer_setup") },
                    onPracticesClick = { navController.navigate("practices") }
                )
            }

            composable("timer_setup") {
                TimerSetupScreen(
                    alertMode = alertMode,
                    intervalMin = intervalMin,
                    onBegin = { durMin, type, mode, interval ->
                        sessionDurationMin = durMin
                        sessionPracticeType = type
                        alertMode = mode
                        intervalMin = interval
                        sessionStartTime = System.currentTimeMillis()
                        navController.navigate("timer_running")
                    },
                    onSettings = { mode, interval ->
                        alertMode = mode
                        intervalMin = interval
                        navController.navigate("timer_settings")
                    }
                )
            }

            composable("timer_settings") {
                TimerSettingsScreen(
                    initialAlertMode = alertMode,
                    initialIntervalMin = intervalMin,
                    onSave = { mode, interval ->
                        alertMode = mode
                        intervalMin = interval
                        navController.popBackStack()
                    }
                )
            }

            composable("timer_running") {
                TimerRunningScreen(
                    durationMin = sessionDurationMin,
                    practiceType = sessionPracticeType,
                    alertMode = alertMode,
                    intervalMin = intervalMin,
                    onComplete = { actualSeconds, completed ->
                        navController.navigate("timer_complete/$actualSeconds/$completed") {
                            popUpTo("timer_setup") { inclusive = true }
                        }
                    }
                )
            }

            composable("timer_complete/{actualSeconds}/{completed}") { backStackEntry ->
                val actualSeconds = backStackEntry.arguments?.getString("actualSeconds")?.toIntOrNull() ?: 0
                val completed = backStackEntry.arguments?.getString("completed")?.toBooleanStrictOrNull() ?: false

                TimerCompleteScreen(
                    actualSeconds = actualSeconds,
                    durationMin = sessionDurationMin,
                    practiceType = sessionPracticeType,
                    completed = completed,
                    startTimeMillis = sessionStartTime,
                    onDone = {
                        navController.navigate("home") {
                            popUpTo("home") { inclusive = true }
                        }
                    }
                )
            }

            composable("practices") {
                PracticesScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}
