package com.crowdsensenet.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.Typography
import androidx.compose.runtime.Composable
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// Typography definitions favoring Montserrat for headings and Roboto for body text
val AppTypography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.SansSerif, // Montserrat equivalent in custom assets
        fontWeight = FontWeight.Bold,
        fontSize = 30.sp,
        letterSpacing = (-0.5).sp
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.SemiBold,
        fontSize = 24.sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Medium,
        fontSize = 20.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default, // Roboto equivalent
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Monospace, // JetBrains Mono equivalent for specs
        fontWeight = FontWeight.Bold,
        fontSize = 11.sp
    )
)

private val LightColorScheme = lightColorScheme(
    primary = DeepBlue,
    secondary = SignalGreen,
    tertiary = Amber,
    error = Red,
    background = LightBackground,
    surface = LightSurface,
    onPrimary = LightSurface,
    onSecondary = DarkBackground,
    onTertiary = DarkBackground,
    onBackground = DarkBackground,
    onSurface = DarkBackground
)

private val DarkColorScheme = darkColorScheme(
    primary = SignalGreen,
    secondary = DeepBlue,
    tertiary = Amber,
    error = Red,
    background = DarkBackground,
    surface = DarkSurface,
    onPrimary = DarkBackground,
    onSecondary = LightSurface,
    onTertiary = LightSurface,
    onBackground = LightSurface,
    onSurface = LightSurface
)

@Composable
fun CrowdSenseNetTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,
        content = content
    )
}
