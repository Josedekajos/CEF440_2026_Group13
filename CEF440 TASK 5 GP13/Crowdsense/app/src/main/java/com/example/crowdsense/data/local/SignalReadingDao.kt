package com.example.crowdsense.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.Query
import com.example.crowdsense.model.SignalReading

@Dao
interface SignalReadingDao {

    @Insert
    suspend fun insertReading(reading: SignalReading)

    @Query("SELECT * FROM signal_readings WHERE isSynced = 0")
    suspend fun getUnsyncedReadings(): List<SignalReading>

    @Query("SELECT COUNT(*) FROM signal_readings WHERE isSynced = 0")
    suspend fun getUnsyncedCount(): Int

    @Query("SELECT COUNT(*) FROM signal_readings WHERE isSynced = 1")
    suspend fun getSyncedCount(): Int

    @Query(
        "UPDATE signal_readings SET isSynced = 1 " +
                "WHERE id IN (:ids)"
    )
    suspend fun markAsSynced(ids: List<Int>)

    @Query("DELETE FROM signal_readings WHERE isSynced = 1")
    suspend fun deleteOldSyncedReadings()
}