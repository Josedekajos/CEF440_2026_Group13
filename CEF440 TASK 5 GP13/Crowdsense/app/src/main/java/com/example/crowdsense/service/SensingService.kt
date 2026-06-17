package com.example.crowdsense.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.example.crowdsense.R
import com.example.crowdsense.data.local.AppDatabase
import com.example.crowdsense.model.SignalReading
import com.example.crowdsense.ui.SettingsActivity
import com.example.crowdsense.utils.LocationUtils
import com.example.crowdsense.utils.NetworkDataStorage
import com.example.crowdsense.utils.NetworkUtils
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.UUID

class SensingService : Service() {

    private val scope = CoroutineScope(Dispatchers.IO)
    private var job: Job? = null
    private var interval: Long = 10000L

    companion object {
        const val ACTION_START = "ACTION_START"
        const val ACTION_STOP  = "ACTION_STOP"
        const val EXTRA_SAMPLING_INTERVAL = "EXTRA_INTERVAL"
        const val CHANNEL_ID = "SensingChannel"
        const val NOTIFICATION_ID = 1

        var isRunning = false
    }

    override fun onCreate() {
        super.onCreate()
        createChannel()
    }

    override fun onStartCommand(
        intent: Intent?,
        flags: Int,
        startId: Int
    ): Int {
        when (intent?.action) {
            ACTION_START -> {
                interval = intent.getLongExtra(
                    EXTRA_SAMPLING_INTERVAL,
                    SettingsActivity.getSamplingInterval(this)
                )
                isRunning = true
                startSensing()
            }
            ACTION_STOP -> {
                isRunning = false
                stopSensing()
            }
        }
        return START_STICKY
    }

    private fun startSensing() {
        if (job?.isActive == true) return

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                buildNotification(),
                ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION
            )
        } else {
            startForeground(NOTIFICATION_ID, buildNotification())
        }
        job = scope.launch {
            val db = AppDatabase.getDatabase(
                this@SensingService
            )
            val prefs = getSharedPreferences(
                "crowdsense_prefs", MODE_PRIVATE
            )
            val uuid = prefs.getString(
                "device_uuid",
                UUID.randomUUID().toString()
            ) ?: UUID.randomUUID().toString()

            while (true) {
                try {
                    val signal = NetworkDataStorage
                        .getCurrentSimulatedSignalStrength()
                    val cell = NetworkDataStorage
                        .getCurrentSimulatedCellInfo()
                    val net = NetworkUtils
                        .getNetworkType(this@SensingService)
                    val loc = LocationUtils
                        .getCurrentLocation(this@SensingService)

                    db.signalReadingDao().insertReading(
                        SignalReading(
                            deviceUUID  = uuid,
                            rsrp        = signal.first,
                            rsrq        = signal.second,
                            sinr        = 0.0,
                            rssi        = signal.first - 10,
                            cellId      = cell.first,
                            networkType = net,
                            latitude    = loc?.latitude  ?: 0.0,
                            longitude   = loc?.longitude ?: 0.0,
                            timestamp   = System.currentTimeMillis(),
                            sessionId   = 1
                        )
                    )
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                delay(interval.milliseconds)
            }
        }
    }

    private fun stopSensing() {
        job?.cancel()
        stopForeground(STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun createChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Signal Sensing",
            NotificationManager.IMPORTANCE_LOW
        )
        getSystemService(NotificationManager::class.java)
            .createNotificationChannel(channel)
    }

    private fun buildNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("CrowdSense")
            .setContentText("Collecting signal data...")
            .setSmallIcon(R.drawable.ic_notification)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}