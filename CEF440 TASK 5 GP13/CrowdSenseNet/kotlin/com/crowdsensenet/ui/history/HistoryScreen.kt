package com.crowdsensenet.ui.history

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.CloudOff
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

data class SessionLog(
    val id: String,
    val date: String,
    val duration: String,
    val readingCount: Int,
    val isSynced: Boolean
)

class HistoryViewModel : ViewModel() {
    private val _sessions = MutableStateFlow<List<SessionLog>>(emptyList())
    val sessions = _sessions.asStateFlow()

    init {
        getSessionHistory()
    }

    fun getSessionHistory() {
        viewModelScope.launch {
            // Simulated Room Entity fetch
            _sessions.value = listOf(
                SessionLog("1", "June 7, 2026 11:15 AM", "12 mins", 124, true),
                SessionLog("2", "June 6, 2026 03:40 PM", "8 mins", 82, true),
                SessionLog("3", "June 5, 2026 09:20 AM", "25 mins", 310, false),
                SessionLog("4", "June 3, 2026 01:10 PM", "4 mins", 41, true),
                SessionLog("5", "May 30, 2026 06:05 PM", "15 mins", 158, false)
            )
        }
    }

    fun syncSession(sessionId: String) {
        viewModelScope.launch {
            _sessions.value = _sessions.value.map {
                if (it.id == sessionId) it.copy(isSynced = true) else it
            }
        }
    }
}

@Composable
fun HistoryScreen(viewModel: HistoryViewModel = viewModel()) {
    val sessions by viewModel.sessions.collectAsState()

    Scaffold(
        topBar = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(DeepBlue)
                    .padding(16.dp)
            ) {
                Text(
                    text = "Telemetry History",
                    color = Color.White,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Room DB Repository",
                    color = LightBackground.copy(alpha = 0.7f),
                    fontSize = 12.sp
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF1F5F9))
        ) {
            if (sessions.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                    Text(text = "No recorded sessions discovered.", color = Gray)
                }
            } else {
                LazyColumn(
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(sessions) { session ->
                        SessionItemRow(
                            session = session,
                            onSyncClick = { viewModel.syncSession(session.id) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun SessionItemRow(session: SessionLog, onSyncClick: () -> Unit) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = session.date,
                    fontWeight = FontWeight.Bold,
                    color = DeepBlue,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row {
                    Text(
                        text = "Duration: ${session.duration}  |  ",
                        fontSize = 12.sp,
                        color = Gray
                    )
                    Text(
                        text = "${session.readingCount} Points",
                        fontSize = 12.sp,
                        color = DeepBlue,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            // Synced Status / Manual Sync triggers
            if (session.isSynced) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.CloudDone,
                        contentDescription = "Synchronized",
                        tint = SignalGreen,
                        modifier = Modifier.size(24.dp)
                    )
                    Text(text = "Synced", fontSize = 10.sp, color = SignalGreen, fontWeight = FontWeight.Bold)
                }
            } else {
                IconButton(onClick = onSyncClick) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.CloudOff,
                            contentDescription = "Trigger Sync",
                            tint = Amber,
                            modifier = Modifier.size(24.dp)
                        )
                        Text(text = "Sync Now", fontSize = 10.sp, color = Amber, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
