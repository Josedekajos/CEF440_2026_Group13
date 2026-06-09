package com.crowdsensenet.ui.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.GpsFixed
import androidx.compose.material.icons.filled.SignalCellularAlt
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
        // Dynamic simulated background tracking
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

    fun startCollection() {
        _isCollecting.value = true
    }

    fun stopCollection() {
        _isCollecting.value = false
    }

    fun resetReadings() {
        _readingsCount.value = 0
    }
}

@Composable
fun HomeScreen(navController: NavController, viewModel: HomeViewModel = viewModel()) {
    val metrics by viewModel.metrics.collectAsState()
    val isCollecting by viewModel.isCollecting.collectAsState()
    val readingsCount by viewModel.readingsCount.collectAsState()
    val gpsAccuracy by viewModel.gpsAccuracy.collectAsState()

    Scaffold(
        topBar = {
            OptInHeader(title = "CrowdSenseNet Home")
        }
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
                    color = DeepBlue,
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                // RSRP Metric Panel
                MetricRow(
                    label = "RSRP (Signal Power)",
                    value = "${metrics.rsrp} dBm",
                    statusLabel = getRsrpStatus(metrics.rsrp),
                    statusColor = getRsrpColor(metrics.rsrp)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // RSRQ Metric Panel
                MetricRow(
                    label = "RSRQ (Signal Quality)",
                    value = "${metrics.rsrq} dB",
                    statusLabel = getRsrqStatus(metrics.rsrq),
                    statusColor = getRsrqColor(metrics.rsrq)
                )

                Spacer(modifier = Modifier.height(12.dp))

                // SINR Metric Panel
                MetricRow(
                    label = "SINR (Noise Ratio)",
                    value = "${metrics.sinr} dB",
                    statusLabel = getSinrStatus(metrics.sinr),
                    statusColor = getSinrColor(metrics.sinr)
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Hardware Status Widget
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.GpsFixed,
                                contentDescription = "GPS Status",
                                tint = SignalGreen,
                                modifier = Modifier.size(24.dp)
                            )
                            Text(
                                text = " GPS Lock Active",
                                fontWeight = FontWeight.SemiBold,
                                color = DeepBlue,
                                modifier = Modifier.padding(start = 8.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "State: $gpsAccuracy",
                            color = Gray,
                            fontSize = 13.sp
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Session log status display
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isCollecting) Color(0xFFEFF6FF) else Color.White
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = if (isCollecting) "Tracking Coverage" else "Recording Inactive",
                                fontWeight = FontWeight.Bold,
                                color = if (isCollecting) DeepBlue else Gray
                            )
                            Text(
                                text = "Passive crowd-sourced session",
                                fontSize = 12.sp,
                                color = MutedText
                            )
                        }
                        Box(
                            modifier = Modifier
                                .background(
                                    if (isCollecting) SignalGreen else Gray,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = "$readingsCount pnts",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }

            // Collection buttons
            Button(
                onClick = {
                    if (isCollecting) viewModel.stopCollection() else viewModel.startCollection()
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isCollecting) Red else DeepBlue
                )
            ) {
                Text(
                    text = if (isCollecting) "HALT CROWD-SENSING" else "ENGAGE TRACKING NETWORK",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OptInHeader(title: String) {
    CenterAlignedTopAppBar(
        title = { Text(title, fontWeight = FontWeight.Bold, color = Color.White, fontSize = 20.sp) },
        colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = DeepBlue)
    )
}

@Composable
fun MetricRow(label: String, value: String, statusLabel: String, statusColor: Color) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = label, color = Gray, fontSize = 13.sp)
                Spacer(modifier = Modifier.height(4.dp))
                Text(text = value, fontWeight = FontWeight.ExtraBold, fontSize = 22.sp, color = DeepBlue)
            }
            Surface(
                color = statusColor.copy(alpha = 0.15f),
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.padding(start = 8.dp)
            ) {
                Text(
                    text = statusLabel,
                    color = statusColor,
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                )
            }
        }
    }
}

// Helper methods mapping values to standards
fun getRsrpStatus(rsrp: Int) = when {
    rsrp >= -85 -> "Excellent"
    rsrp >= -100 -> "Average"
    rsrp >= -110 -> "Poor"
    else -> "Outage Gap"
}

fun getRsrpColor(rsrp: Int) = when {
    rsrp >= -85 -> SignalGreen
    rsrp >= -100 -> Amber
    rsrp >= -110 -> Red
    else -> Color.Black
}

fun getRsrqStatus(rsrq: Int) = when {
    rsrq >= -10 -> "Excellent"
    rsrq >= -15 -> "Satisfactory"
    else -> "Degraded"
}

fun getRsrqColor(rsrq: Int) = when {
    rsrq >= -10 -> SignalGreen
    rsrq >= -15 -> Amber
    else -> Red
}

fun getSinrStatus(sinr: Int) = when {
    sinr >= 15 -> "Premium Link"
    sinr >= 5 -> "Stable Connection"
    else -> "High Interference"
}

fun getSinrColor(sinr: Int) = when {
    sinr >= 15 -> SignalGreen
    sinr >= 5 -> Amber
    else -> Red
}
