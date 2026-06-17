package com.example.crowdsense.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import com.example.crowdsense.service.SensingService
import com.example.crowdsense.utils.LocationUtils
import com.example.crowdsense.utils.NetworkDataStorage
import com.example.crowdsense.utils.NetworkUtils
import kotlinx.coroutines.delay
import org.osmdroid.config.Configuration
import org.osmdroid.tileprovider.tilesource.TileSourceFactory
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.MapView
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polygon
import kotlin.time.Duration.Companion.seconds

@Composable
fun HomeTheme(content: @Composable () -> Unit) {
    val colorScheme = lightColorScheme(
        primary = Color(0xFF1565C0),
        onPrimary = Color.White,
        primaryContainer = Color(0xFFE3F2FD),
        onPrimaryContainer = Color(0xFF1565C0),
        surface = Color.White,
        background = Color(0xFFF5F5F5)
    )
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CrowdSenseTopBar(title: String, onExit: () -> Unit) {
    var showMenu by remember { mutableStateOf(false) }
    val context = LocalContext.current

    CenterAlignedTopAppBar(
        title = { Text(title, fontWeight = FontWeight.Bold, color = Color(0xFF1565C0)) },
        actions = {
            IconButton(onClick = { showMenu = true }) {
                Icon(Icons.Default.MoreVert, contentDescription = "Menu", tint = Color.Gray)
            }
            DropdownMenu(
                expanded = showMenu,
                onDismissRequest = { showMenu = false }
            ) {
                DropdownMenuItem(
                    text = { Text("History") },
                    onClick = {
                        showMenu = false
                        context.startActivity(Intent(context, UploadsActivity::class.java))
                    },
                    leadingIcon = { Icon(Icons.Default.History, contentDescription = null) }
                )
                DropdownMenuItem(
                    text = { Text("Exit") },
                    onClick = {
                        showMenu = false
                        onExit()
                    },
                    leadingIcon = { Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = null) }
                )
            }
        },
        colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = Color.White)
    )
}

@Composable
fun OsmMapView(location: android.location.Location?, showHeatmap: Boolean = false, modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val mapView = remember { MapView(context) }
    
    DisposableEffect(mapView) {
        mapView.onResume()
        onDispose {
            mapView.onPause()
        }
    }

    AndroidView(
        factory = { mapView },
        update = { view ->
            try {
                view.setTileSource(TileSourceFactory.MAPNIK)
                view.setMultiTouchControls(true)
                view.controller.setZoom(15.0)
                view.overlays.clear()
                
                location?.let {
                    val point = GeoPoint(it.latitude, it.longitude)
                    view.controller.animateTo(point)
                    
                    if (showHeatmap) {
                        // Simulate heatmap coverage with circles
                        val heatmapColors = listOf(
                            android.graphics.Color.argb(100, 76, 175, 80),  // Green
                            android.graphics.Color.argb(100, 255, 193, 7), // Amber
                            android.graphics.Color.argb(100, 244, 67, 54)  // Red
                        )
                        
                        val points = listOf(
                           GeoPoint(it.latitude, it.longitude),
                           GeoPoint(it.latitude + 0.002, it.longitude + 0.002),
                           GeoPoint(it.latitude - 0.002, it.longitude - 0.002)
                        )

                        points.forEachIndexed { index, p ->
                            val circle = Polygon(view)
                            circle.points = Polygon.pointsAsCircle(p, 300.0)
                            circle.fillPaint.color = heatmapColors[index % heatmapColors.size]
                            circle.outlinePaint.strokeWidth = 0f
                            view.overlays.add(circle)
                        }
                    }

                    val marker = Marker(view)
                    marker.position = point
                    marker.setAnchor(Marker.ANCHOR_CENTER, Marker.ANCHOR_BOTTOM)
                    view.overlays.add(marker)
                }
                view.invalidate()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        },
        modifier = modifier
    )
}

class HomeActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Configuration.getInstance().userAgentValue = packageName
        Configuration.getInstance().load(this, getSharedPreferences("osmdroid", MODE_PRIVATE))
        
        setContent {
            HomeTheme {
                HomeDashboard(onExit = { 
                    stopSensing()
                    finishAffinity() 
                })
            }
        }
    }

    private fun startSensing() {
        val intent = Intent(this, SensingService::class.java)
            .apply { action = SensingService.ACTION_START }
        ContextCompat.startForegroundService(this, intent)
    }

    private fun stopSensing() {
        val intent = Intent(this, SensingService::class.java)
            .apply { action = SensingService.ACTION_STOP }
        startService(intent)
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun HomeDashboard(onExit: () -> Unit) {
        val context = LocalContext.current
        var isSensing by remember { mutableStateOf(SensingService.isRunning) }
        var networkInfo by remember { mutableStateOf("Loading...") }
        var operatorName by remember { mutableStateOf("Operator") }
        var signalStrength by remember { mutableStateOf(-78.0) }
        var cellId by remember { mutableStateOf("28471") }
        var currentLoc by remember { mutableStateOf<android.location.Location?>(null) }
        var coordinates by remember { mutableStateOf("4.1534° N, 9.2425° E") }

        LaunchedEffect(Unit) {
            while (true) {
                isSensing = SensingService.isRunning
                operatorName = NetworkUtils.getOperatorName(context)
                networkInfo = NetworkUtils.getNetworkType(context)
                
                val signal = NetworkDataStorage.getCurrentSimulatedSignalStrength()
                signalStrength = signal.first

                val cell = NetworkDataStorage.getCurrentSimulatedCellInfo()
                cellId = cell.first

                val loc = LocationUtils.getCurrentLocation(context)
                if (loc != null) {
                    currentLoc = loc
                    coordinates = "${"%.4f".format(loc.latitude)}° N, ${"%.4f".format(loc.longitude)}° E"
                }
                delay(5.seconds)
            }
        }

        Scaffold(
            topBar = {
                CrowdSenseTopBar(title = "CrowdSenseNet", onExit = onExit)
            },
            bottomBar = {
                NavigationBar(containerColor = Color.White) {
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Home, contentDescription = null) },
                        label = { Text("Home") },
                        selected = true,
                        onClick = {}
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.BarChart, contentDescription = null) },
                        label = { Text("Stats") },
                        selected = false,
                        onClick = { startActivity(Intent(context, StatsActivity::class.java)) }
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.CloudUpload, contentDescription = null) },
                        label = { Text("Uploads") },
                        selected = false,
                        onClick = { startActivity(Intent(context, UploadsActivity::class.java)) }
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Settings, contentDescription = null) },
                        label = { Text("Settings") },
                        selected = false,
                        onClick = { startActivity(Intent(context, SettingsActivity::class.java)) }
                    )
                }
            }
        ) { padding ->
            Column(
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize()
                    .background(Color(0xFFF8F9FA))
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Sensing Status Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp).fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(modifier = Modifier.size(8.dp).background(if (isSensing) Color(0xFF4CAF50) else Color.Gray, CircleShape))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(if (isSensing) "SENSING ON" else "SENSING OFF", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("00:15:40", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Text("886 readings collected", fontSize = 10.sp, color = Color.Gray)
                        }
                    }
                }

                // Signal Strength Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("RSRP SIGNAL STRENGTH", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                        Row(verticalAlignment = Alignment.Bottom) {
                            Text("${signalStrength.toInt()} dBm", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2E7D32))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Excellent", fontSize = 14.sp, color = Color(0xFF2E7D32), fontWeight = FontWeight.Medium)
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        LinearProgressIndicator(
                            progress = { 0.8f },
                            modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)),
                            color = Color(0xFF4CAF50),
                            trackColor = Color(0xFFE8F5E9)
                        )
                    }
                }

                // Operator Info Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(operatorName, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                            Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF1565C0), modifier = Modifier.size(20.dp))
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        InfoRow("Network Type:", networkInfo)
                        InfoRow("Cell ID:", cellId)
                        Row(modifier = Modifier.padding(vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.LocationOn, contentDescription = null, tint = Color(0xFF4CAF50), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("GPS Active:", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4CAF50))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(coordinates, fontSize = 12.sp, color = Color.Gray)
                        }
                    }
                }

                // Map Section
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .clip(RoundedCornerShape(16.dp))
                        .background(Color(0xFFE0E0E0)),
                    contentAlignment = Alignment.BottomCenter
                ) {
                    OsmMapView(location = currentLoc, modifier = Modifier.fillMaxSize())
                    
                    Button(
                        onClick = { 
                            if (isSensing) stopSensing() else startSensing()
                            isSensing = !isSensing 
                        },
                        modifier = Modifier.padding(bottom = 16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color.Black),
                        shape = RoundedCornerShape(24.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            if (isSensing) {
                                Box(modifier = Modifier.size(12.dp).background(Color.White, RoundedCornerShape(2.dp)))
                            } else {
                                Icon(Icons.Default.PlayArrow, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(if (isSensing) "TAP TO STOP SENSING" else "TAP TO START SENSING", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    @Composable
    fun InfoRow(label: String, value: String) {
        Row(modifier = Modifier.fillMaxWidth().padding(vertical = 2.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontSize = 12.sp, color = Color.Gray)
            Text(value, fontSize = 12.sp, fontWeight = FontWeight.Bold)
        }
    }
}
