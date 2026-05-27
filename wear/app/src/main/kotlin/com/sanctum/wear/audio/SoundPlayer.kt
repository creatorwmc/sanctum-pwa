package com.sanctum.wear.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.sin

object SoundPlayer {

    private const val SAMPLE_RATE = 44100

    /**
     * Play a bell tone — 880 Hz + harmonic, 1.5s decay
     * Matches the PWA's playBell() from sounds.js
     */
    suspend fun playBell() = withContext(Dispatchers.IO) {
        val duration = 1.5
        val samples = generateTone(
            frequencies = floatArrayOf(880f, 1760f),
            amplitudes = floatArrayOf(0.6f, 0.3f),
            durationSeconds = duration,
            decayRate = 3.0
        )
        playPcm(samples)
    }

    /**
     * Play a singing bowl tone — 220 Hz base with harmonics, 2s decay
     * Shortened from PWA's 4s for the watch speaker
     */
    suspend fun playSingingBowl() = withContext(Dispatchers.IO) {
        val duration = 2.0
        val samples = generateTone(
            frequencies = floatArrayOf(220f, 550f, 836f, 1144f),
            amplitudes = floatArrayOf(0.5f, 0.3f, 0.15f, 0.1f),
            durationSeconds = duration,
            decayRate = 2.0
        )
        playPcm(samples)
    }

    /**
     * Generate a multi-harmonic tone with exponential decay envelope
     */
    private fun generateTone(
        frequencies: FloatArray,
        amplitudes: FloatArray,
        durationSeconds: Double,
        decayRate: Double
    ): ShortArray {
        val numSamples = (SAMPLE_RATE * durationSeconds).toInt()
        val samples = ShortArray(numSamples)

        for (i in 0 until numSamples) {
            val t = i.toDouble() / SAMPLE_RATE
            val envelope = exp(-decayRate * t)

            var sample = 0.0
            for (h in frequencies.indices) {
                sample += amplitudes[h] * sin(2.0 * PI * frequencies[h] * t)
            }
            sample *= envelope

            // Clamp and convert to 16-bit PCM
            val pcm = (sample * Short.MAX_VALUE).toInt()
                .coerceIn(Short.MIN_VALUE.toInt(), Short.MAX_VALUE.toInt())
            samples[i] = pcm.toShort()
        }

        return samples
    }

    private fun playPcm(samples: ShortArray) {
        val bufferSize = samples.size * 2 // 2 bytes per short

        val track = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setSampleRate(SAMPLE_RATE)
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .build()
            )
            .setBufferSizeInBytes(bufferSize)
            .setTransferMode(AudioTrack.MODE_STATIC)
            .build()

        track.write(samples, 0, samples.size)
        track.setNotificationMarkerPosition(samples.size)
        track.setPlaybackPositionUpdateListener(object :
            AudioTrack.OnPlaybackPositionUpdateListener {
            override fun onMarkerReached(t: AudioTrack?) {
                t?.release()
            }
            override fun onPeriodicNotification(t: AudioTrack?) {}
        })
        track.play()
    }
}
