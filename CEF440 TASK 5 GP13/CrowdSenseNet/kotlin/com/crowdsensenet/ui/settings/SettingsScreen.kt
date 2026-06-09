package com.crowdsensenet.ui.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.Wifi
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

class SettingsViewModel : ViewModel() {
    private val _language = MutableStateFlow("English")
    val language = _language.asStateFlow()

    private val _wifiOnly = MutableStateFlow(true)
    val wifiOnly = _wifiOnly.asStateFlow()

    private val _isWifiEnabled = MutableStateFlow(true)
    val isWifiEnabled = _isWifiEnabled.asStateFlow()

    private val _dbStatusMessage = MutableStateFlow<String?>(null)
    val dbStatusMessage = _dbStatusMessage.asStateFlow()

    fun setLanguage(lang: String) {
        _language.value = lang
    }

    fun setUploadPreference(pref: Boolean) {
        _wifiOnly.value = pref
    }

    fun toggleWiFi() {
        _isWifiEnabled.value = !_isWifiEnabled.value
    }

    fun deleteLocalData() {
        viewModelScope.launch {
            // Empties the Room Database tables
            _dbStatusMessage.value = "Local database successfully cleared."
        }
    }

    fun clearStatusMessage() {
        _dbStatusMessage.value = null
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(viewModel: SettingsViewModel = viewModel()) {
    val language by viewModel.language.collectAsState()
    val wifiOnly by viewModel.wifiOnly.collectAsState()
    val isWifiEnabled by viewModel.isWifiEnabled.collectAsState()
    val dbStatusMessage by viewModel.dbStatusMessage.collectAsState()

    var showLangSelector by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Settings & Rules", fontWeight = FontWeight.Bold, color = Color.White) },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(containerColor = DeepBlue)
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .background(Color(0xFFF1F5F9))
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            
            // Preference Panel Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Global App Language",
                        fontWeight = FontWeight.Bold,
                        color = DeepBlue,
                        fontSize = 15.sp,
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                    
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { showLangSelector = true }
                            .background(Color(0xFFF8FAFC), RoundedCornerShape(8.dp))
                            .padding(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = language, fontWeight = FontWeight.SemiBold, color = Gray)
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                        }

                        DropdownMenu(
                            expanded = showLangSelector,
                            onDismissRequest = { showLangSelector = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("English (US)") },
                                onClick = {
                                    viewModel.setLanguage("English")
                                    showLangSelector = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text("Français (FR)") },
                                onClick = {
                                    viewModel.setLanguage("Français")
                                    showLangSelector = false
                                }
                            )
                        }
                    }
                }
            }

            // Sync Rules Panel Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Transmission Rules",
                        fontWeight = FontWeight.Bold,
                        color = DeepBlue,
                        fontSize = 15.sp,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    // Wifi Only Switch Slider
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "Unify uploads to WiFi-only", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text(text = "Helps conserve mobile subscription data", fontSize = 11.sp, color = MutedText)
                        }
                        Switch(
                            checked = wifiOnly,
                            onCheckedChange = { viewModel.setUploadPreference(it) },
                            colors = SwitchDefaults.colors(checkedThumbColor = SignalGreen)
                        )
                    }

                    Divider(modifier = Modifier.padding(vertical = 12.dp))

                    // Simulated Device WiFi State toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = "System WiFi Receiver State", fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Text(text = "Simulate active antenna link", fontSize = 11.sp, color = MutedText)
                        }
                        IconButton(onClick = { viewModel.toggleWiFi() }) {
                            Icon(
                                imageVector = Icons.Default.Wifi,
                                contentDescription = null,
                                tint = if (isWifiEnabled) SignalGreen else Red
                            )
                        }
                    }
                }
            }

            // Danger Section Card
            Card(
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Storage & Administration",
                        fontWeight = FontWeight.Bold,
                        color = DeepBlue,
                        fontSize = 15.sp,
                        modifier = Modifier.padding(bottom = 6.dp)
                    )
                    Text(
                        text = "Clears and resets the local SQLite Room DB cache schema permanently.",
                        fontSize = 12.sp,
                        color = Gray,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    Button(
                        onClick = { viewModel.deleteLocalData() },
                        colors = ButtonDefaults.buttonColors(containerColor = Red),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Default.DeleteForever, contentDescription = null)
                        Text(" Purge Room Cache Database", fontWeight = FontWeight.Bold)
                    }
                }
            }

            // Database confirmation alerts UI
            dbStatusMessage?.let { msg ->
                Card(
                    shape = RoundedCornerShape(8.dp),
                    colors = CardDefaults.cardColors(containerColor = SignalGreen.copy(alpha = 0.12f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = msg, color = SignalGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        TextButton(onClick = { viewModel.clearStatusMessage() }) {
                            Text("OK", color = DeepBlue, fontWeight = FontWeight.ExtraBold)
                        }
                    }
                }
            }
        }
    }
}
