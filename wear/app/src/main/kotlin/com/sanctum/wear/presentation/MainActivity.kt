package com.sanctum.wear.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.wear.compose.navigation.SwipeDismissableNavHost
import androidx.wear.compose.navigation.composable
import androidx.wear.compose.navigation.rememberSwipeDismissableNavController
import com.sanctum.wear.presentation.screens.HomeScreen
import com.sanctum.wear.presentation.screens.TimerScreen
import com.sanctum.wear.presentation.screens.PracticesScreen
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

        SwipeDismissableNavHost(
            navController = navController,
            startDestination = "home"
        ) {
            composable("home") {
                HomeScreen(
                    onTimerClick = { navController.navigate("timer") },
                    onPracticesClick = { navController.navigate("practices") }
                )
            }
            composable("timer") {
                TimerScreen(onBack = { navController.popBackStack() })
            }
            composable("practices") {
                PracticesScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}
