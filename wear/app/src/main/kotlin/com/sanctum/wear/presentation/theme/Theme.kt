package com.sanctum.wear.presentation.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.wear.compose.material.Colors
import androidx.wear.compose.material.MaterialTheme

// Sanctum color palette - matches PWA
val Gold = Color(0xFFD4AF37)
val DeepPurple = Color(0xFF1A1A4E)
val LightPurple = Color(0xFF2D1B4E)
val TextPrimary = Color(0xFFE8E8E8)
val TextSecondary = Color(0xFFB0B0B0)

private val SanctumColors = Colors(
    primary = Gold,
    primaryVariant = Gold,
    secondary = LightPurple,
    secondaryVariant = DeepPurple,
    background = DeepPurple,
    surface = LightPurple,
    error = Color(0xFFCF6679),
    onPrimary = DeepPurple,
    onSecondary = TextPrimary,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onError = DeepPurple
)

@Composable
fun SanctumWearTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colors = SanctumColors,
        content = content
    )
}
