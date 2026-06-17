package com.example.crowdsense.data.remote

import android.content.Context
import android.util.Log
import com.example.crowdsense.data.local.AppDatabase
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class SyncManager(private val context: Context) {

    private val db = AppDatabase.getDatabase(context)
    private val dao = db.signalReadingDao()

    suspend fun syncPendingReadings() = withContext(Dispatchers.IO) {
        try {
            val pending = dao.getUnsyncedReadings()
            if (pending.isEmpty()) return@withContext

            Log.d("SyncManager", "Syncing ${pending.size} readings...")

            // TODO: Implement actual network call here
            // val response = api.uploadReadings(pending)
            // if (response.isSuccessful) {
            
            // Mocking successful sync for now
            val ids = pending.map { it.id }
            dao.markAsSynced(ids)
            Log.d("SyncManager", "Successfully synced ${ids.size} readings")
            
            // }
        } catch (e: Exception) {
            Log.e("SyncManager", "Error during sync", e)
        }
    }
}