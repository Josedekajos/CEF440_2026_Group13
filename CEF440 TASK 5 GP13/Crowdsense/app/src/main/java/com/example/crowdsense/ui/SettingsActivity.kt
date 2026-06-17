package com.example.crowdsense.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.*
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.edit
import com.example.crowdsense.service.SensingService
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SettingsActivity : ComponentActivity() {

    companion object {
        private const val PREFS = "crowdsense_prefs"
        private val INTERVALS = mapOf(
            "High (1Hz)" to 1000L,
            "Medium (0.5Hz)" to 2000L,
            "Low (0.1Hz)" to 10000L
        )

        fun getSamplingInterval(context: Context): Long {
            val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            val key = prefs.getString("sampling_interval", "High (1Hz)") ?: "High (1Hz)"
            return INTERVALS[key] ?: 1000L
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HomeTheme {
                SettingsScreen()
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun SettingsScreen() {
        val context = LocalContext.current
        val prefs = remember { context.getSharedPreferences(PREFS, MODE_PRIVATE) }
        val scope = rememberCoroutineScope()

        var samplingRate by remember { mutableStateOf(prefs.getString("sampling_interval", "High (1Hz)") ?: "High (1Hz)") }
        var locationPrecision by remember { mutableStateOf(prefs.getBoolean("location_precision", true)) }
        var automaticUpload by remember { mutableStateOf(prefs.getBoolean("automatic_upload", false)) }
        var wifiOnly by remember { mutableStateOf(prefs.getBoolean("wifi_only", true)) }
        var firebaseConnected by remember { mutableStateOf(true) }

        Scaffold(
            topBar = {
                CrowdSenseTopBar(title = "Settings", onExit = { 
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
                        selected = false,
                        onClick = {
                            startActivity(Intent(context, StatsActivity::class.java))
                            finish()
                        }
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
                        selected = true,
                        onClick = {}
                    )
                }
            }
        ) { padding ->
            Column(
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize()
                    .background(Color(0xFFF8F9FA))
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                SettingsSection(title = "DATA COLLECTION") {
                    SettingsDropdownItem(
                        icon = Icons.Default.Timer,
                        title = "Sampling Rate",
                        description = "Frequency of sensor data collection",
                        value = samplingRate,
                        onValueChange = {
                            samplingRate = it
                            prefs.edit().putString("sampling_interval", it).apply()
                        }
                    )
                    SettingsSwitchItem(
                        icon = Icons.Default.LocationSearching,
                        title = "Location Precision",
                        description = "High accuracy requires more battery",
                        checked = locationPrecision,
                        onCheckedChange = {
                            locationPrecision = it
                            prefs.edit().putBoolean("location_precision", it).apply()
                        }
                    )
                }

                SettingsSection(title = "SYNCHRONIZATION") {
                    SettingsSwitchItem(
                        icon = Icons.Default.CloudSync,
                        title = "Automatic Upload",
                        description = "Sync collected data automatically",
                        checked = automaticUpload,
                        onCheckedChange = {
                            automaticUpload = it
                            prefs.edit().putBoolean("automatic_upload", it).apply()
                        }
                    )
                    SettingsSwitchItem(
                        icon = Icons.Default.Wifi,
                        title = "WiFi Only",
                        description = "Saves mobile data in Cameroon",
                        checked = wifiOnly,
                        onCheckedChange = {
                            wifiOnly = it
                            prefs.edit().putBoolean("wifi_only", it).apply()
                        }
                    )
                }

                SettingsSection(title = "CONNECTION") {
                    SettingsActionItem(
                        icon = Icons.Default.Lan,
                        title = "Test Firebase Connection",
                        description = "Verify cloud infrastructure status",
                        status = if (firebaseConnected) "Connected" else "Failed",
                        statusColor = if (firebaseConnected) Color(0xFF388E3C) else Color(0xFFD32F2F)
                    )
                    SettingsActionItem(
                        icon = Icons.Default.Dns,
                        title = "Regional API Gateway",
                        description = "Yaoundé Node - Tier 1",
                        showArrow = true
                    )
                }

                SettingsSection(title = "ABOUT") {
                    SettingsInfoItem(
                        icon = Icons.Default.Info,
                        title = "Software Version",
                        description = "v2.4.0-stable (Build 892)"
                    )
                }
            }
        }
    }

    @Composable
    fun SettingsSection(title: String, content: @Composable ColumnScope.() -> Unit) {
        Column {
            Text(
                text = title,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                color = Color.Gray,
                modifier = Modifier.padding(start = 4.dp, bottom = 8.dp)
            )
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(1.dp)
            ) {
                Column(modifier = Modifier.padding(vertical = 4.dp)) {
                    content()
                }
            }
        }
    }

    @Composable
    fun SettingsSwitchItem(icon: ImageVector, title: String, description: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF1565C0), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(description, fontSize = 10.sp, color = Color.Gray)
            }
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange,
                colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = Color(0xFF1565C0))
            )
        }
    }

    @Composable
    fun SettingsDropdownItem(icon: ImageVector, title: String, description: String, value: String, onValueChange: (String) -> Unit) {
        var expanded by remember { mutableStateOf(false) }
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF1565C0), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(description, fontSize = 10.sp, color = Color.Gray)
            }
            Box {
                Surface(
                    onClick = { expanded = true },
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFE3F2FD)
                ) {
                    Row(modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(value, fontSize = 12.sp, color = Color(0xFF1565C0))
                        Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Color(0xFF1565C0))
                    }
                }
                DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                    INTERVALS.keys.forEach {
                        DropdownMenuItem(text = { Text(it) }, onClick = { onValueChange(it); expanded = false })
                    }
                }
            }
        }
    }

    @Composable
    fun SettingsActionItem(icon: ImageVector, title: String, description: String, status: String? = null, statusColor: Color = Color.Gray, showArrow: Boolean = false) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF1565C0), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(description, fontSize = 10.sp, color = Color.Gray)
            }
            if (status != null) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(modifier = Modifier.size(8.dp).background(statusColor, androidx.compose.foundation.shape.CircleShape))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(status, fontSize = 12.sp, color = statusColor, fontWeight = FontWeight.Bold)
                }
            }
            if (showArrow) {
                Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = null, tint = Color.LightGray)
            }
        }
    }

    @Composable
    fun SettingsInfoItem(icon: ImageVector, title: String, description: String) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, contentDescription = null, tint = Color(0xFF1565C0), modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.width(16.dp))
            Column {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(description, fontSize = 10.sp, color = Color.Gray)
            }
        }
    }
}
