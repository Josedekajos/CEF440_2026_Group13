package com.example.crowdsense.utils

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.telephony.TelephonyManager
import androidx.core.content.ContextCompat

import kotlin.time.Duration.Companion.seconds

object NetworkUtils {

    fun getNetworkType(context: Context): String {
        val tm = context.getSystemService(
            Context.TELEPHONY_SERVICE
        ) as TelephonyManager

        if (ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.READ_PHONE_STATE
            ) != PackageManager.PERMISSION_GRANTED
        ) return "Permission Required"

        val networkType = tm.dataNetworkType

        return when (networkType) {
            TelephonyManager.NETWORK_TYPE_LTE    -> "LTE"
            20 -> "5G" // TelephonyManager.NETWORK_TYPE_NR
            TelephonyManager.NETWORK_TYPE_UMTS,
            TelephonyManager.NETWORK_TYPE_HSDPA,
            TelephonyManager.NETWORK_TYPE_HSUPA,
            TelephonyManager.NETWORK_TYPE_HSPA  -> "3G"
            TelephonyManager.NETWORK_TYPE_EDGE,
            TelephonyManager.NETWORK_TYPE_GPRS  -> "2G"
            else -> "Unknown"
        }
    }

    fun getOperatorName(context: Context): String {
        val tm = context.getSystemService(
            Context.TELEPHONY_SERVICE
        ) as TelephonyManager
        return tm.networkOperatorName.ifEmpty { "Unknown" }
    }
}