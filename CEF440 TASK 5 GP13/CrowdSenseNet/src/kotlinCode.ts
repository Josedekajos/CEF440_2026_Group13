// Kotlin Source Code templates for CrowdSenseNet MVVM Jetpack Compose Implementation

export const KOTLIN_FILES = {
  "Color.kt": `package com.crowdsensenet.ui.theme

import androidx.compose.ui.graphics.Color

// Brand colors
val DeepBlue = Color(0xFF1E3A8A)
val SignalGreen = Color(0xFF10B981)
val Amber = Color(0xFFF59E0B)
val Red = Color(0xFFEF4444)
val Gray = Color(0xFF6B7280)

// Detailed theme support colors
val DarkBackground = Color(0xFF0F172A)
val DarkSurface = Color(0xFF1E293B)
val LightBackground = Color(0xFFF8FAFC)
val LightSurface = Color(0xFFFFFFFF)
val MutedText = Color(0xFF94A3B8)`,

  "Theme.kt": `package com.crowdsensenet.ui.theme

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
        fontFamily = FontFamily.SansSerif, // Montserrat equivalent
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
        fontFamily = FontFamily.Monospace, // JetBrains Mono equivalent
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
}`,

  "SplashScreen.kt": `package com.crowdsensenet.ui.splash

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.WifiTethering
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.crowdsensenet.navigation.Screen
import com.crowdsensenet.ui.theme.DeepBlue
import com.crowdsensenet.ui.theme.SignalGreen
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(navController: NavController) {
    val scale = remember { Animatable(0.6f) }
    val alpha = remember { Animatable(0f) }

    LaunchedEffect(key1 = true) {
        alpha.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 1000)
        )
        scale.animateTo(
            targetValue = 1.0f,
            animationSpec = tween(durationMillis = 1200)
        )
        delay(1500)
        navController.navigate(Screen.Home.route) {
            popUpTo(Screen.Splash.route) { inclusive = true }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DeepBlue),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .scale(scale.value)
                .alpha(alpha.value)
        ) {
            Icon(
                imageVector = Icons.Default.WifiTethering,
                contentDescription = "CrowdSenseNet Emblem",
                tint = Color.White,
                modifier = Modifier
                    .size(120.dp)
                    .padding(bottom = 16.dp)
            )

            Text(
                text = "CrowdSenseNet",
                color = Color.White,
                fontSize = 34.sp,
                fontWeight = FontWeight.Bold,
                letterSpacing = (-0.5).sp
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Crowdsensed Coverage Prediction",
                color = SignalGreen,
                fontSize = 15.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}`,

  "HomeScreen.kt": `package com.crowdsensenet.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.crowdsensenet.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class NetworkMetrics(
    val rsrp: Int,  // Reference Signal Received Power in dBm
    val rsrq: Int,  // Reference Signal Received Quality in dB
    val sinr: Int   // Signal-to-Interference-plus-Noise Ratio in dB
)

class HomeViewModel : ViewModel() {
    private val _metrics = MutableStateFlow(NetworkMetrics(-88, -11, 14))
    val metrics = _metrics.asStateFlow()

    private val _isCollecting = MutableStateFlow(false)
    val isCollecting = _isCollecting.asStateFlow()

    private val _readingsCount = MutableStateFlow(0)
    val readingsCount = _readingsCount.asStateFlow()

    private val _gpsAccuracy = MutableStateFlow("High Accuracy (±3.6m)")
    val gpsAccuracy = _gpsAccuracy.asStateFlow()

    init {
        viewModelScope.launch {
            while (true) {
                delay(10000) // update metrics every 10s
                if (_isCollecting.value) {
                    _metrics.value = NetworkMetrics(
                        rsrp = (-115..-65).random(),
                        rsrq = (-18..-5).random(),
                        sinr = (-5..28).random()
                    )
                    _readingsCount.value += 1
                }
            }
        }
    }

    fun startCollection() { _isCollecting.value = true }
    fun stopCollection() { _isCollecting.value = false }
    fun resetReadings() { _readingsCount.value = 0 }
}

@Composable
fun HomeScreen(navController: NavController, viewModel: HomeViewModel = viewModel()) {
    val metrics by viewModel.metrics.collectAsState()
    val isCollecting by viewModel.isCollecting.collectAsState()
    val readingsCount by viewModel.readingsCount.collectAsState()
    val gpsAccuracy by viewModel.gpsAccuracy.collectAsState()

    Scaffold(
        topBar = { OptInHeader(title = "CrowdSenseNet Home") }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF1F5F9))
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = "Live Network Diagnostics",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = DeepBlue
                )

                // RSRP Metric Panel
                MetricRow(
                    label = "RSRP (Signal Power)",
                    value = "\${metrics.rsrp} dBm",
                    statusLabel = getRsrpStatus(metrics.rsrp),
                    statusColor = getRsrpColor(metrics.rsrp)
                )

                // RSRQ Metric Panel
                MetricRow(
                    label = "RSRQ (Signal Quality)",
                    value = "\${metrics.rsrq} dB",
                    statusLabel = getRsrqStatus(metrics.rsrq),
                    statusColor = getRsrqColor(metrics.rsrq)
                )

                // SINR Metric Panel
                MetricRow(
                    label = "SINR (Noise Ratio)",
                    value = "\${metrics.sinr} dB",
                    statusLabel = getSinrStatus(metrics.sinr),
                    statusColor = getSinrColor(metrics.sinr)
                )

                Spacer(modifier = Modifier.height(24.dp))

                // GPS lock status
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.GpsFixed, "Lock", tint = SignalGreen)
                        Text(" GPS Status: $gpsAccuracy", modifier = Modifier.padding(start = 8.dp))
                    }
                }
            }

            // Collection buttons
            Button(
                onClick = {
                    if (isCollecting) viewModel.stopCollection() else viewModel.startCollection()
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = if (isCollecting) Red else DeepBlue)
            ) {
                Text(if (isCollecting) "HALT CROWD-SENSING" else "ENGAGE TRACKING NETWORK")
            }
        }
    }
}`,

  "MapScreen.kt": `package com.crowdsensenet.ui.map

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.crowdsensenet.ui.theme.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class GridCoordinate(val lat: Double, val lng: Double, val dbm: Int)

class MapViewModel : ViewModel() {
    private val _heatmapPoints = MutableStateFlow<List<GridCoordinate>>(emptyList())
    val heatmapPoints = _heatmapPoints.asStateFlow()

    private val _exportResult = MutableStateFlow<String?>(null)
    val exportResult = _exportResult.asStateFlow()

    fun loadCoverageData(area: String) {
        viewModelScope.launch {
            _heatmapPoints.value = listOf(
                GridCoordinate(48.8566, 2.3522, -78),  // Green
                GridCoordinate(48.8584, 2.2945, -92),  // Yellow
                GridCoordinate(48.8606, 2.3376, -105), // Red
                GridCoordinate(48.8534, 2.3488, -118)  // Black
            )
        }
    }

    fun exportCoverage(format: String) {
        viewModelScope.launch {
            val result = if (format == "GEOJSON") "{ 'type': 'FeatureCollection' }" else "Lat,Lng,dbm"
            _exportResult.value = "Data downloaded as $format."
        }
    }
}

@Composable
fun MapScreen(viewModel: MapViewModel = viewModel()) {
    var searchInput by remember { mutableStateOf("") }
    val points by viewModel.heatmapPoints.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        // Google Map base simulation layer
        Box(modifier = Modifier.fillMaxSize().background(Color(0xFFE2E8F0)))

        // Search overlay
        OutlinedTextField(
            value = searchInput,
            onValueChange = { searchInput = it; viewModel.loadCoverageData(it) },
            leadingIcon = { Icon(Icons.Default.Search, "Search") },
            modifier = Modifier.fillMaxWidth().padding(16.dp)
        )

        // Float Legend
        Card(
            modifier = Modifier.align(Alignment.BottomStart).padding(16.dp).width(190.dp)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("RSRP HEATMAP CAP", fontWeight = FontWeight.Bold, fontSize = 11.sp)
                LegendItem(SignalGreen, "Good (> -85 dBm)")
                LegendItem(Amber, "Average (-85 to -100)")
                LegendItem(Red, "Poor (-100 to -110)")
                LegendItem(Color.Black, "Gap (< -110)")
            }
        }
    }
}`,

  "HistoryScreen.kt": `package com.crowdsensenet.ui.history

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.crowdsensenet.ui.theme.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

data class SessionLog(
    val id: String,
    val date: String,
    val duration: String,
    val readingCount: Int,
    val isSynced: Boolean
)

class HistoryViewModel : ViewModel() {
    val sessions = MutableStateFlow<List<SessionLog>>(emptyList())

    fun getSessionHistory() {
        sessions.value = listOf(
            SessionLog("1", "June 7, 2026 11:15 AM", "12 mins", 124, true),
            SessionLog("2", "June 6, 2026 03:40 PM", "8 mins", 82, false)
        )
    }
}

@Composable
fun HistoryScreen(viewModel: HistoryViewModel = viewModel()) {
    val sessions by viewModel.sessions.collectAsState()

    Scaffold(
        topBar = { TopAppBar(title = { Text("Session Logs") }) }
    ) { padding ->
        LazyColumn(contentPadding = PaddingValues(16.dp), modifier = Modifier.padding(padding)) {
            items(sessions) { session ->
                Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(session.date, fontWeight = FontWeight.Bold)
                        Text("Duration: \${session.duration} | Readings: \${session.readingCount}")
                    }
                }
            }
        }
    }
}`,

  "SettingsScreen.kt": `package com.crowdsensenet.ui.settings

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.lifecycle.ViewModel
import com.crowdsensenet.ui.theme.*

class SettingsViewModel : ViewModel() {
    val language = mutableStateOf("English")
    val wifiOnly = mutableStateOf(true)

    fun deleteLocalData() {
        // Purging Room database
    }
}

@Composable
fun SettingsScreen(viewModel: SettingsViewModel = viewModel()) {
    var wifiOnly by remember { viewModel.wifiOnly }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("App Configurations", style = MaterialTheme.typography.titleLarge)
        
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Simulate uploads to WiFi-only")
            Switch(checked = wifiOnly, onCheckedChange = { wifiOnly = it })
        }
        
        Button(
            onClick = { viewModel.deleteLocalData() },
            colors = ButtonDefaults.buttonColors(containerColor = Red)
        ) {
            Text("Purge Room Database")
        }
    }
}`,

  "NavGraph.kt": `package com.crowdsensenet.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.navigation.NavController
import androidx.navigation.compose.*
import com.crowdsensenet.ui.history.HistoryScreen
import com.crowdsensenet.ui.home.HomeScreen
import com.crowdsensenet.ui.map.MapScreen
import com.crowdsensenet.ui.settings.SettingsScreen
import com.crowdsensenet.ui.splash.SplashScreen

sealed class Screen(val route: String, val title: String, val icon: ImageVector?) {
    object Splash : Screen("splash", "Welcome", null)
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Map : Screen("map", "Map", Icons.Default.Map)
    object History : Screen("history", "History", Icons.Default.History)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}

@Composable
fun MainAppNavigation() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            if (currentRoute != Screen.Splash.route) {
                NavigationBar {
                    // NavigationBarItem loops...
                }
            }
        }
    ) { innerPadding ->
        NavHost(navController, startDestination = Screen.Splash.route) {
            composable(Screen.Splash.route) { SplashScreen(navController) }
            composable(Screen.Home.route) { HomeScreen(navController) }
            composable(Screen.Map.route) { MapScreen() }
            composable(Screen.History.route) { HistoryScreen() }
            composable(Screen.Settings.route) { SettingsScreen() }
        }
    }
}`
};
