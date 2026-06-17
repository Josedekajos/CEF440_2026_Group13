package com.example.crowdsense.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
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
import com.example.crowdsense.utils.LocationUtils
import com.example.crowdsense.utils.NetworkDataStorage
import com.example.crowdsense.utils.NetworkUtils
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.osmdroid.config.Configuration
import org.osmdroid.util.GeoPoint
import org.osmdroid.views.overlay.Marker
import org.osmdroid.views.overlay.Polygon
import kotlin.time.Duration.Companion.seconds

class StatsActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Configuration.getInstance().userAgentValue = packageName
        Configuration.getInstance().load(this, getSharedPreferences("osmdroid", MODE_PRIVATE))
        setContent {
            HomeTheme {
                StatsScreen()
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun StatsScreen() {
        val context = LocalContext.current
        val scope = rememberCoroutineScope()
        var rsrp by remember { mutableStateOf("-78") }
        var rsrq by remember { mutableStateOf("-9") }
        var cellId by remember { mutableStateOf("28471") }
        var networkType by remember { mutableStateOf("LTE") }
        var operatorName by remember { mutableStateOf("MTN") }
        var lat by remember { mutableStateOf("4.1517° N") }
        var lng by remember { mutableStateOf("9.2435° E") }
        var currentLoc by remember { mutableStateOf<android.location.Location?>(null) }
        var showHeatmap by remember { mutableStateOf(false) }

        LaunchedEffect(Unit) {
            while (true) {
                operatorName = NetworkUtils.getOperatorName(context)
                val signal = NetworkDataStorage.getCurrentSimulatedSignalStrength()
                val cell = NetworkDataStorage.getCurrentSimulatedCellInfo()
                val net = NetworkUtils.getNetworkType(context)
                val loc = LocationUtils.getCurrentLocation(context)

                rsrp = signal.first.toInt().toString()
                rsrq = signal.second.toInt().toString()
                cellId = cell.first
                networkType = net
                if (loc != null) {
                    currentLoc = loc
                    lat = "${"%.4f".format(loc.latitude)}° N"
                    lng = "${"%.4f".format(loc.longitude)}° E"
                }
                
                delay(5.seconds)
            }
        }

        Scaffold(
            topBar = {
                CrowdSenseTopBar(title = "Signal Metrics", onExit = { 
                    val intent = Intent(context, com.example.crowdsense.service.SensingService::class.java)
                        .apply { action = com.example.crowdsense.service.SensingService.ACTION_STOP }
                    context.startService(intent)
                    finishAffinity() 
                })
            },
            bottomBar = {
                NavigationBar(containerColor = Color.White) {
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Home, contentDescription = null) },
                        label = { Text("Home") },
                        selected = false,
                        onClick = {
                            startActivity(Intent(context, HomeActivity::class.java))
                            finish()
                        }
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.BarChart, contentDescription = null) },
                        label = { Text("Stats") },
                        selected = true,
                        onClick = {}
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.CloudUpload, contentDescription = null) },
                        label = { Text("Uploads") },
                        selected = false,
                        onClick = {
                            startActivity(Intent(context, UploadsActivity::class.java))
                            finish()
                        }
                    )
                    NavigationBarItem(
                        icon = { Icon(Icons.Default.Settings, contentDescription = null) },
                        label = { Text("Settings") },
                        selected = false,
                        onClick = {
                            startActivity(Intent(context, SettingsActivity::class.java))
                            finish()
                        }
                    )
                }
            }
        ) { padding ->
            Column(
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize()
                    .background(Color(0xFFF8F9FA))
                    .padding(horizontal = 16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Spacer(modifier = Modifier.height(8.dp))

                // Real-time Grid
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard(label = "RSRP", value = "$rsrp dBm", subLabel = "Signal Level", progress = 0.75f, modifier = Modifier.weight(1f))
                    StatCard(label = "RSRQ", value = "$rsrq dB", subLabel = "Signal Quality", progress = 0.6f, modifier = Modifier.weight(1f))
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    StatCard(label = "Cell ID", value = cellId, subLabel = "Base Station", progress = 0.4f, modifier = Modifier.weight(1f))
                    StatCard(label = "Network", value = networkType, subLabel = operatorName, progress = 0.85f, modifier = Modifier.weight(1f))
                }

                // Map & Heatmap Section
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier.size(32.dp).clip(CircleShape).background(Color(0xFFE3F2FD)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(Icons.Default.MyLocation, contentDescription = null, tint = Color(0xFF1565C0), modifier = Modifier.size(18.dp))
                                }
                                Spacer(modifier = Modifier.width(12.dp))
                                Text("Live Coverage", fontWeight = FontWeight.ExtraBold, fontSize = 18.sp, color = Color(0xFF1A237E))
                            }
                            
                            // Network badge
                            Surface(
                                shape = RoundedCornerShape(16.dp),
                                color = Color(0xFFE8F5E9),
                            ) {
                                Text(
                                    text = "GPS ACTIVE",
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF2E7D32)
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            LocationInfoItem(label = "Latitude", value = lat, icon = Icons.Default.North)
                            LocationInfoItem(label = "Longitude", value = lng, icon = Icons.Default.East)
                        }
                        
                        Spacer(modifier = Modifier.height(20.dp))
                        
                        // Map Section
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(280.dp)
                                .clip(RoundedCornerShape(16.dp))
                        ) {
                            OsmMapView(location = currentLoc, showHeatmap = showHeatmap, modifier = Modifier.fillMaxSize())
                            
                            // Overlay Legend
                            if (showHeatmap) {
                                Column(
                                    modifier = Modifier
                                        .align(Alignment.TopEnd)
                                        .padding(12.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color.White.copy(alpha = 0.9f))
                                        .padding(8.dp),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    LegendItem(Color(0xFF4CAF50), "Good")
                                    LegendItem(Color(0xFFFFC107), "Average")
                                    LegendItem(Color(0xFFF44336), "Poor")
                                }
                            }
                        }

                        AnimatedVisibility(
                            visible = showHeatmap,
                            enter = fadeIn() + expandVertically(),
                            exit = fadeOut() + shrinkVertically()
                        ) {
                            Column(modifier = Modifier.padding(top = 16.dp)) {
                                Text(
                                    "Location Analysis",
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF1565C0)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    "Based on your $operatorName SIM, you are currently in a 'Good' coverage zone. Neighboring streets show 'Average' penetration due to urban density. Avoid basement areas for stable LTE connectivity.",
                                    fontSize = 12.sp,
                                    color = Color.Gray,
                                    lineHeight = 18.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(20.dp))
                        
                        Button(
                            onClick = { showHeatmap = !showHeatmap },
                            modifier = Modifier.fillMaxWidth().height(52.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (showHeatmap) Color(0xFF455A64) else Color(0xFF1565C0)
                            ),
                            elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    if (showHeatmap) Icons.Default.VisibilityOff else Icons.Default.Layers,
                                    contentDescription = null,
                                    modifier = Modifier.size(20.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text(
                                    if (showHeatmap) "HIDE SIGNAL HEATMAP" else "ANALYZE LOCAL HEATMAP",
                                    fontWeight = FontWeight.Bold,
                                    letterSpacing = 1.sp
                                )
                            }
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }

    @Composable
    fun StatCard(label: String, value: String, subLabel: String, progress: Float, modifier: Modifier = Modifier) {
        Card(
            modifier = modifier,
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(label, fontSize = 11.sp, fontWeight = FontWeight.Black, color = Color.LightGray)
                Spacer(modifier = Modifier.height(4.dp))
                Text(value, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1565C0))
                Text(subLabel, fontSize = 10.sp, color = Color.Gray)
                Spacer(modifier = Modifier.height(12.dp))
                LinearProgressIndicator(
                    progress = { progress },
                    modifier = Modifier.fillMaxWidth().height(6.dp).clip(CircleShape),
                    color = Color(0xFF1565C0),
                    trackColor = Color(0xFFE3F2FD)
                )
            }
        }
    }

    @Composable
    fun LocationInfoItem(label: String, value: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, contentDescription = null, modifier = Modifier.size(14.dp), tint = Color.LightGray)
            Spacer(modifier = Modifier.width(6.dp))
            Column {
                Text(label, fontSize = 10.sp, color = Color.Gray)
                Text(value, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
            }
        }
    }

    @Composable
    fun LegendItem(color: Color, label: String) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(modifier = Modifier.size(10.dp).clip(CircleShape).background(color))
            Spacer(modifier = Modifier.width(6.dp))
            Text(label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
        }
    }
}
