package com.example.crowdsense.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
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
import com.example.crowdsense.data.local.AppDatabase
import com.example.crowdsense.data.remote.SyncManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlin.time.Duration.Companion.seconds

class UploadsActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            HomeTheme {
                UploadsScreen()
            }
        }
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun UploadsScreen() {
        val context = LocalContext.current
        val syncManager = remember { SyncManager(context) }
        val scope = rememberCoroutineScope()
        
        var pendingCount by remember { mutableStateOf(234) }
        var uploadedCount by remember { mutableStateOf(1204) }
        var isUploading by remember { mutableStateOf(false) }

        LaunchedEffect(Unit) {
            val db = AppDatabase.getDatabase(context)
            while (true) {
                pendingCount = db.signalReadingDao().getUnsyncedCount()
                uploadedCount = db.signalReadingDao().getSyncedCount()
                delay(3.seconds)
            }
        }

        Scaffold(
            topBar = {
                CrowdSenseTopBar(title = "Data Uploads", onExit = { 
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
                        selected = true,
                        onClick = {}
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
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header Image
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(140.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF001F3F)), // Dark blue
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.CloudUpload, contentDescription = null, tint = Color.White.copy(alpha = 0.5f), modifier = Modifier.size(80.dp))
                }

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    CountCard(label = "PENDING", count = pendingCount.toString(), color = Color(0xFFF57C00), modifier = Modifier.weight(1f))
                    CountCard(label = "UPLOADED", count = uploadedCount.toString(), color = Color(0xFF388E3C), modifier = Modifier.weight(1f))
                }

                // Cloud Status Card
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(2.dp)
                ) {
                    Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(modifier = Modifier.size(40.dp).background(Color(0xFFE3F2FD), CircleShape), contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.CloudQueue, contentDescription = null, tint = Color(0xFF1565C0))
                        }
                                                Spacer(modifier = Modifier.width(16.dp))
                        Column {
                            Text("Cloud Status", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Last full backup: Nov 15, 2023 14:32", fontSize = 10.sp, color = Color.Gray)
                        }
                    }
                }

                // Syncing section
                Column(modifier = Modifier.padding(vertical = 8.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column {
                            Text("Syncing Records...", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text("Active connection established", fontSize = 10.sp, color = Color(0xFF00897B))
                        }
                        Text("60%", fontWeight = FontWeight.Bold, color = Color(0xFF1565C0))
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    LinearProgressIndicator(
                        progress = { 0.6f },
                        modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(4.dp)),
                        color = Color(0xFF00897B),
                        trackColor = Color(0xFFE0F2F1)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("143 of 234 records uploaded", fontSize = 10.sp, color = Color.Gray)
                }

                Button(
                    onClick = {
                        isUploading = true
                        scope.launch {
                            syncManager.syncPendingReadings()
                            isUploading = false
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(56.dp).padding(vertical = 4.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Color(0xFF1565C0)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF1565C0)),
                    enabled = !isUploading && pendingCount > 0
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Upload, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Upload Now", fontWeight = FontWeight.Bold)
                    }
                }

                Text("Upload History", fontWeight = FontWeight.Bold, fontSize = 16.sp, modifier = Modifier.padding(top = 8.dp))

                HistoryItem("Nov 14, 2023 • 42 Records", "Routine daily sync", "SUCCESSFUL", Color(0xFF388E3C))
                HistoryItem("Nov 13, 2023 • 18 Records", "Incomplete sync session", "PENDING", Color(0xFFF57C00))
                HistoryItem("Nov 12, 2023 • 89 Records", "Campaign batch upload", "SUCCESSFUL", Color(0xFF388E3C))
            }
        }
    }

    @Composable
    fun CountCard(label: String, count: String, color: Color, modifier: Modifier = Modifier) {
        Card(
            modifier = modifier,
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(2.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text(label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                Spacer(modifier = Modifier.height(8.dp))
                Text(count, fontSize = 28.sp, fontWeight = FontWeight.Bold, color = color)
            }
        }
    }

    @Composable
    fun HistoryItem(title: String, subtitle: String, status: String, statusColor: Color) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(1.dp)
        ) {
            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Box(modifier = Modifier.size(32.dp).background(Color(0xFFF5F5F5), CircleShape), contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.CloudDone, contentDescription = null, modifier = Modifier.size(16.dp), tint = Color.Gray)
                }
                Spacer(modifier = Modifier.width(16.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(title, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    Text(subtitle, fontSize = 10.sp, color = Color.Gray)
                }
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = statusColor.copy(alpha = 0.1f)
                ) {
                    Text(status, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp), fontSize = 8.sp, fontWeight = FontWeight.Bold, color = statusColor)
                }
            }
        }
    }
}
