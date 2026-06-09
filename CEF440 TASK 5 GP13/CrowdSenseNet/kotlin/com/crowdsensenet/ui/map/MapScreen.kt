package com.crowdsensenet.ui.map

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

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    private val _exportResult = MutableStateFlow<String?>(null)
    val exportResult = _exportResult.asStateFlow()

    init {
        // Build diagnostic signal matrix for preloaded points
        loadCoverageData("default_center")
    }

    fun loadCoverageData(area: String) {
        viewModelScope.launch {
            // Simulated retrieval of network geo-reads matching query
            _heatmapPoints.value = listOf(
                GridCoordinate(48.8566, 2.3522, -78),  // Green
                GridCoordinate(48.8584, 2.2945, -92),  // Yellow
                GridCoordinate(48.8606, 2.3376, -105), // Red
                GridCoordinate(48.8534, 2.3488, -118), // Black (Dead zone)
                GridCoordinate(48.8492, 2.3265, -82)   // Green
            )
        }
    }

    fun searchLocation(query: String) {
        _searchQuery.value = query
        loadCoverageData(query)
    }

    fun exportCoverage(format: String) {
        viewModelScope.launch {
            // Generates raw GeoJSON or CSV structure of active records
            val result = if (format == "GEOJSON") {
                "{ 'type': 'FeatureCollection', 'features': [...] }"
            } else {
                "Latitude,Longitude,RSRP_dBm,Signal_Status\n48.8566,2.3522,-78,Excellent"
            }
            _exportResult.value = "Active session saved as $format: ${result.take(30)}..."
        }
    }

    fun clearExportMessage() {
        _exportResult.value = null
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapScreen(viewModel: MapViewModel = viewModel()) {
    var searchInput by remember { mutableStateOf("") }
    val points by viewModel.heatmapPoints.collectAsState()
    val exportResult by viewModel.exportResult.collectAsState()
    val snareScope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize()) {
        
        // Mock Map Canvas
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFE2E8F0)),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "Google Maps Static Tiles Grid",
                    color = Gray,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Text(
                    text = "Loaded ${points.size} Coverage Micro-cells",
                    color = MutedText,
                    fontSize = 12.sp
                )
            }
        }

        // Overlay controls panel: Search Input Box
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .align(Alignment.TopCenter)
        ) {
            OutlinedTextField(
                value = searchInput,
                onValueChange = {
                    searchInput = it
                    viewModel.searchLocation(it)
                },
                placeholder = { Text("Search city, tower, or GPS cords...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Lookup") },
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Color.White,
                    unfocusedContainerColor = Color.White,
                    focusedBorderColor = DeepBlue
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Fast Export Buttons Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { viewModel.exportCoverage("CSV") },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = DeepBlue),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                    Text(" Export CSV", fontSize = 12.sp)
                }

                Button(
                    onClick = { viewModel.exportCoverage("GEOJSON") },
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = DeepBlue),
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                    Text(" Export GeoJSON", fontSize = 12.sp)
                }
            }
        }

        // Legend LegendBox Container (Floating bottom-left)
        Card(
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.95f)),
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(16.dp)
                .width(190.dp)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "RSRP HEATMAP CAP",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = DeepBlue,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                LegendItem(color = SignalGreen, text = "Good (> -85 dBm)")
                LegendItem(color = Amber, text = "Average (-85 to -100)")
                LegendItem(color = Red, text = "Poor (-100 to -110)")
                LegendItem(color = Color.Black, text = "Gap (< -110 dBm)")
            }
        }

        // Action Trigger messages matching active exporters
        exportResult?.let { msg ->
            Snackbar(
                action = {
                    TextButton(onClick = { viewModel.clearExportMessage() }) {
                        Text("DIMISS", color = SignalGreen)
                    }
                },
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(16.dp)
            ) {
                Text(text = msg)
            }
        }
    }
}

@Composable
fun LegendItem(color: Color, text: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(vertical = 3.dp)
    ) {
        Box(
            modifier = Modifier
                .size(12.dp)
                .background(color, shape = CircleShape)
        )
        Text(
            text = " $text",
            fontSize = 11.sp,
            color = Gray,
            modifier = Modifier.padding(start = 6.dp)
        )
    }
}
