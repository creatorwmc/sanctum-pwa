import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../db'
import './MMRTest.css'

function MMRTest() {
  const [readings, setReadings] = useState([])
  const [loading, setLoading] = useState(true)
  const [capturing, setCapturing] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [meterValue, setMeterValue] = useState('')
  const [meterId, setMeterId] = useState('')
  const [saving, setSaving] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    loadReadings()
    return () => stopCamera()
  }, [])

  async function loadReadings() {
    try {
      const allReadings = await db.getAll('meterReadings')
      setReadings(allReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
    } catch (error) {
      console.error('Error loading readings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setCapturing(true)
    } catch (error) {
      console.error('Camera error:', error)
      alert('Could not access camera. Please ensure camera permissions are granted.')
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCapturing(false)
  }

  function captureImage() {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.8)
    setCurrentImage(imageData)
    stopCamera()
  }

  function retakePhoto() {
    setCurrentImage(null)
    setMeterValue('')
    setAnalysis(null)
    startCamera()
  }

  function analyzeReading(newValue, meterIdToCheck) {
    const meterHistory = readings
      .filter(r => r.meterId === meterIdToCheck)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    if (meterHistory.length === 0) {
      return { isFirstReading: true }
    }

    const lastReading = meterHistory[0]
    const newVal = parseFloat(newValue)
    const lastVal = parseFloat(lastReading.value)

    if (isNaN(newVal) || isNaN(lastVal)) {
      return { error: 'Invalid meter values' }
    }

    const consumption = newVal - lastVal
    const timeDiff = new Date() - new Date(lastReading.timestamp)
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

    // Calculate average daily consumption from history
    let avgDailyConsumption = 0
    if (meterHistory.length >= 2) {
      const oldestReading = meterHistory[meterHistory.length - 1]
      const totalConsumption = lastVal - parseFloat(oldestReading.value)
      const totalDays = (new Date(lastReading.timestamp) - new Date(oldestReading.timestamp)) / (1000 * 60 * 60 * 24)
      if (totalDays > 0) {
        avgDailyConsumption = totalConsumption / totalDays
      }
    }

    const expectedConsumption = avgDailyConsumption * daysDiff
    const isNegative = consumption < 0
    const isSpike = expectedConsumption > 0 && consumption > expectedConsumption * 3

    return {
      consumption,
      daysDiff: Math.round(daysDiff * 10) / 10,
      lastReading: lastVal,
      lastDate: lastReading.timestamp,
      isNegative,
      isSpike,
      expectedConsumption: Math.round(expectedConsumption * 100) / 100,
      avgDailyConsumption: Math.round(avgDailyConsumption * 100) / 100
    }
  }

  function handleValueChange(value) {
    setMeterValue(value)
    if (value && meterId) {
      const result = analyzeReading(value, meterId)
      setAnalysis(result)
    } else {
      setAnalysis(null)
    }
  }

  function handleMeterIdChange(id) {
    setMeterId(id)
    if (meterValue && id) {
      const result = analyzeReading(meterValue, id)
      setAnalysis(result)
    } else {
      setAnalysis(null)
    }
  }

  async function saveReading() {
    if (!meterValue || !meterId) {
      alert('Please enter both meter ID and reading value')
      return
    }

    setSaving(true)
    try {
      await db.add('meterReadings', {
        meterId: meterId.trim(),
        value: meterValue.trim(),
        image: currentImage,
        timestamp: new Date().toISOString(),
        analysis: analysis
      })

      await loadReadings()

      // Reset form
      setCurrentImage(null)
      setMeterValue('')
      setAnalysis(null)
      alert('Reading saved successfully!')
    } catch (error) {
      console.error('Error saving reading:', error)
      alert('Error saving reading')
    } finally {
      setSaving(false)
    }
  }

  async function deleteReading(id) {
    if (!confirm('Delete this reading?')) return

    try {
      await db.delete('meterReadings', id)
      await loadReadings()
    } catch (error) {
      console.error('Error deleting reading:', error)
    }
  }

  // Get unique meter IDs for dropdown
  const uniqueMeterIds = [...new Set(readings.map(r => r.meterId))]

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="mmr-page">
      <header className="mmr-header">
        <Link to="/settings" className="mmr-back">← Settings</Link>
        <h1>MMR Test</h1>
        <p className="mmr-subtitle">Meter Reading Tracker</p>
      </header>

      {!capturing && !currentImage && (
        <div className="mmr-start">
          <button className="btn btn-primary mmr-capture-btn" onClick={startCamera}>
            📷 Take Meter Photo
          </button>

          {readings.length > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'} History ({readings.length})
            </button>
          )}
        </div>
      )}

      {capturing && (
        <div className="mmr-camera">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="mmr-video"
          />
          <div className="mmr-camera-controls">
            <button className="btn btn-secondary" onClick={stopCamera}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={captureImage}>
              📸 Capture
            </button>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {currentImage && (
        <div className="mmr-review">
          <img src={currentImage} alt="Meter" className="mmr-preview" />

          <div className="mmr-form">
            <div className="form-group">
              <label>Meter ID</label>
              <input
                type="text"
                className="input"
                value={meterId}
                onChange={(e) => handleMeterIdChange(e.target.value)}
                placeholder="e.g., Unit-101, Water-Main"
                list="meter-ids"
              />
              <datalist id="meter-ids">
                {uniqueMeterIds.map(id => (
                  <option key={id} value={id} />
                ))}
              </datalist>
            </div>

            <div className="form-group">
              <label>Meter Reading</label>
              <input
                type="number"
                className="input"
                value={meterValue}
                onChange={(e) => handleValueChange(e.target.value)}
                placeholder="Enter the number shown"
                step="0.01"
              />
            </div>

            {analysis && !analysis.isFirstReading && !analysis.error && (
              <div className={`mmr-analysis ${analysis.isNegative ? 'mmr-analysis--warning' : ''} ${analysis.isSpike ? 'mmr-analysis--alert' : ''}`}>
                <h4>Analysis</h4>
                <div className="analysis-row">
                  <span>Last Reading:</span>
                  <span>{analysis.lastReading}</span>
                </div>
                <div className="analysis-row">
                  <span>Days Since:</span>
                  <span>{analysis.daysDiff} days</span>
                </div>
                <div className="analysis-row analysis-row--highlight">
                  <span>Consumption:</span>
                  <span>{analysis.consumption}</span>
                </div>

                {analysis.isNegative && (
                  <div className="mmr-alert mmr-alert--negative">
                    ⚠️ NEGATIVE READ - Meter went backwards!
                  </div>
                )}

                {analysis.isSpike && (
                  <div className="mmr-alert mmr-alert--spike">
                    📈 SPIKE DETECTED - Usage is {Math.round(analysis.consumption / analysis.expectedConsumption)}x expected!
                  </div>
                )}

                {analysis.avgDailyConsumption > 0 && (
                  <div className="analysis-row">
                    <span>Avg Daily:</span>
                    <span>{analysis.avgDailyConsumption}/day</span>
                  </div>
                )}
              </div>
            )}

            {analysis?.isFirstReading && (
              <div className="mmr-analysis mmr-analysis--info">
                First reading for this meter. Future readings will show consumption data.
              </div>
            )}

            <div className="mmr-form-actions">
              <button className="btn btn-secondary" onClick={retakePhoto}>
                Retake
              </button>
              <button
                className="btn btn-primary"
                onClick={saveReading}
                disabled={saving || !meterValue || !meterId}
              >
                {saving ? 'Saving...' : 'Save Reading'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showHistory && readings.length > 0 && (
        <div className="mmr-history">
          <h3>Reading History</h3>
          {readings.map(reading => (
            <div key={reading.id} className="mmr-history-item">
              <div className="history-item-header">
                <span className="history-meter-id">{reading.meterId}</span>
                <span className="history-value">{reading.value}</span>
              </div>
              <div className="history-item-meta">
                <span>{new Date(reading.timestamp).toLocaleString()}</span>
                <button
                  className="history-delete"
                  onClick={() => deleteReading(reading.id)}
                >
                  ×
                </button>
              </div>
              {reading.image && (
                <img
                  src={reading.image}
                  alt="Meter"
                  className="history-image"
                  onClick={() => window.open(reading.image, '_blank')}
                />
              )}
              {reading.analysis && !reading.analysis.isFirstReading && (
                <div className="history-analysis">
                  Consumption: {reading.analysis.consumption}
                  {reading.analysis.isNegative && ' ⚠️ Negative'}
                  {reading.analysis.isSpike && ' 📈 Spike'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MMRTest
