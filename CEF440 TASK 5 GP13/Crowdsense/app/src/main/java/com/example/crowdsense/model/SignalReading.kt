package com.example.crowdsense.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "signal_readings")
data class SignalReading(
    @PrimaryKey(autoGenerate = true)
    val id: Int = 0,
    val deviceUUID: String,
    val rsrp: Double,
    val rsrq: Double,
    val sinr: Double,
    val rssi: Double,
    val cellId: String,
    val networkType: String,
    val latitude: Double,
    val longitude: Double,
    val timestamp: Long,
    val sessionId: Int,
    val isSynced: Boolean = false
)