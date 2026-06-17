package com.example.crowdsense.utils

import kotlin.math.sin

object NetworkDataStorage {

    private var lastRsrp: Double = -85.0
    private var lastRsrq: Double = -9.0
    private var lastCellId: String = "28471"
    private var lastPci: Double = 142.0
    private var lastNetworkType: String = "LTE"

    fun getCurrentSimulatedSignalStrength(): Pair<Double, Double> {
        val time = System.currentTimeMillis() / 1000.0
        val rsrp = -85.0 + sin(time / 30.0) * 10.0
        val rsrq = -9.0 + sin(time / 20.0) * 3.0
        return Pair(rsrp, rsrq)
    }

    fun getCurrentSimulatedCellInfo(): Pair<String, Double> {
        return Pair(lastCellId, lastPci)
    }

    fun setLastKnownSignalStrength(rsrp: Double, rsrq: Double) {
        lastRsrp = rsrp
        lastRsrq = rsrq
    }

    fun getLastKnownSignalStrength(): Pair<Double, Double> {
        return Pair(lastRsrp, lastRsrq)
    }

    fun setLastKnownCellInfo(cellId: String, pci: Double) {
        lastCellId = cellId
        lastPci = pci
    }

    fun getLastKnownCellInfo(): Pair<String, Double> {
        return Pair(lastCellId, lastPci)
    }

    fun setLastKnownNetworkType(type: String) {
        lastNetworkType = type
    }

    fun getLastKnownNetworkType(): String {
        return lastNetworkType
    }
}