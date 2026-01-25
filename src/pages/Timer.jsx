import { useState, useEffect, useRef } from 'react'
import { db } from '../db'
import './Timer.css'

const PRACTICE_TYPES = [
  'Meditation',
  'Breathwork',
  'Visualization',
  'Ritual',
  'Study',
  'Contemplation',
  'Other'
]

const MAX_MINUTES = 90

function Timer() {
  const [durationMinutes, setDurationMinutes] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [practiceType, setPracticeType] = useState('Meditation')
  const [notes, setNotes] = useState('')
  const [inputMode, setInputMode] = useState('buttons') // 'buttons', 'manual', 'dial'
  const [manualInput, setManualInput] = useState('')
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const dialRef = useRef(null)

  const duration = durationMinutes * 60

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            setIsComplete(true)
            playCompletionSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning])

  function playCompletionSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 528
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 2)
    } catch (e) {
      console.log('Audio not supported')
    }
  }

  function addMinutes(mins) {
    setDurationMinutes(prev => Math.min(prev + mins, MAX_MINUTES))
  }

  function clearDuration() {
    setDurationMinutes(0)
    setManualInput('')
  }

  function handleManualInputChange(e) {
    const value = e.target.value
    setManualInput(value)

    const parsed = parseInt(value, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      setDurationMinutes(Math.min(parsed, MAX_MINUTES))
    } else if (value === '') {
      setDurationMinutes(0)
    }
  }

  function handleDialInteraction(e) {
    if (isRunning || hasStarted) return

    const dial = dialRef.current
    if (!dial) return

    const rect = dial.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY

    const angle = Math.atan2(clientY - centerY, clientX - centerX)
    // Convert angle to minutes (0-90), starting from top (-π/2)
    let normalizedAngle = angle + Math.PI / 2
    if (normalizedAngle < 0) normalizedAngle += Math.PI * 2

    const minutes = Math.round((normalizedAngle / (Math.PI * 2)) * MAX_MINUTES)
    setDurationMinutes(Math.min(Math.max(0, minutes), MAX_MINUTES))
  }

  function handleStart() {
    if (durationMinutes === 0) return
    setTimeLeft(duration)
    setIsRunning(true)
    setHasStarted(true)
    startTimeRef.current = new Date()
  }

  function handlePause() {
    setIsRunning(false)
  }

  function handleResume() {
    setIsRunning(true)
  }

  function handleStop() {
    setIsRunning(false)
    setHasStarted(false)
    setTimeLeft(0)
  }

  function handleFullReset() {
    setIsRunning(false)
    setIsComplete(false)
    setHasStarted(false)
    setDurationMinutes(0)
    setTimeLeft(0)
    setNotes('')
    setManualInput('')
    startTimeRef.current = null
  }

  async function handleSaveSession() {
    const session = {
      type: practiceType,
      duration: duration - timeLeft,
      actualDuration: duration,
      date: new Date().toISOString().split('T')[0],
      startTime: startTimeRef.current?.toISOString(),
      endTime: new Date().toISOString(),
      notes: notes.trim(),
      completed: timeLeft === 0
    }

    try {
      await db.add('sessions', session)
      handleFullReset()
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = hasStarted && duration > 0 ? ((duration - timeLeft) / duration) * 100 : 0
  const dialAngle = (durationMinutes / MAX_MINUTES) * 360
  const isSessionActive = isRunning || hasStarted

  return (
    <div className="timer-page">
      {!isComplete ? (
        <>
          {/* Timer Display */}
          <div
            className={`timer-display ${inputMode === 'dial' && !isSessionActive ? 'timer-display--interactive' : ''}`}
            ref={dialRef}
            onMouseDown={inputMode === 'dial' ? handleDialInteraction : undefined}
            onMouseMove={inputMode === 'dial' && !isSessionActive ? (e) => e.buttons === 1 && handleDialInteraction(e) : undefined}
            onTouchStart={inputMode === 'dial' ? handleDialInteraction : undefined}
            onTouchMove={inputMode === 'dial' ? handleDialInteraction : undefined}
          >
            <svg className="timer-ring" viewBox="0 0 100 100">
              <circle className="timer-ring-bg" cx="50" cy="50" r="45" />
              {hasStarted ? (
                <circle
                  className="timer-ring-progress"
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray={`${progress * 2.83} 283`}
                />
              ) : (
                <circle
                  className="timer-ring-selection"
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray={`${(dialAngle / 360) * 283} 283`}
                />
              )}
              {inputMode === 'dial' && !isSessionActive && (
                <circle
                  className="timer-dial-handle"
                  cx={50 + 45 * Math.sin((dialAngle * Math.PI) / 180)}
                  cy={50 - 45 * Math.cos((dialAngle * Math.PI) / 180)}
                  r="4"
                />
              )}
            </svg>
            <div className="timer-time">
              {hasStarted ? formatTime(timeLeft) : formatTime(duration)}
            </div>
            {!hasStarted && (
              <div className="timer-label">
                {durationMinutes === 0 ? 'Set duration' : `${durationMinutes} min`}
              </div>
            )}
          </div>

          {/* Input Mode Tabs */}
          {!isSessionActive && (
            <div className="input-mode-tabs">
              <button
                onClick={() => setInputMode('buttons')}
                className={`mode-tab ${inputMode === 'buttons' ? 'mode-tab--active' : ''}`}
              >
                Quick Add
              </button>
              <button
                onClick={() => setInputMode('manual')}
                className={`mode-tab ${inputMode === 'manual' ? 'mode-tab--active' : ''}`}
              >
                Type
              </button>
              <button
                onClick={() => setInputMode('dial')}
                className={`mode-tab ${inputMode === 'dial' ? 'mode-tab--active' : ''}`}
              >
                Dial
              </button>
            </div>
          )}

          {/* Quick Add Buttons */}
          <div className={`duration-controls ${isSessionActive ? 'duration-controls--disabled' : ''}`}>
            <div className="quick-add-buttons">
              <button
                onClick={() => addMinutes(1)}
                className="add-btn"
                disabled={isSessionActive || durationMinutes >= MAX_MINUTES}
              >
                +1
              </button>
              <button
                onClick={() => addMinutes(5)}
                className="add-btn"
                disabled={isSessionActive || durationMinutes >= MAX_MINUTES}
              >
                +5
              </button>
              <button
                onClick={() => addMinutes(10)}
                className="add-btn"
                disabled={isSessionActive || durationMinutes >= MAX_MINUTES}
              >
                +10
              </button>
              <button
                onClick={clearDuration}
                className="clear-btn"
                disabled={isSessionActive || durationMinutes === 0}
              >
                Clear
              </button>
            </div>

            {/* Manual Input (visible when in manual mode and not running) */}
            {inputMode === 'manual' && !isSessionActive && (
              <div className="manual-input-section">
                <input
                  type="number"
                  value={manualInput}
                  onChange={handleManualInputChange}
                  placeholder="Minutes"
                  min="0"
                  max={MAX_MINUTES}
                  className="input manual-input"
                />
                <span className="max-label">max {MAX_MINUTES} min</span>
              </div>
            )}

            {/* Dial Instructions */}
            {inputMode === 'dial' && !isSessionActive && (
              <p className="dial-hint">Drag around the circle to set duration</p>
            )}
          </div>

          {/* Practice Type */}
          <div className="practice-select">
            <select
              value={practiceType}
              onChange={(e) => setPracticeType(e.target.value)}
              className="input"
              disabled={isRunning}
            >
              {PRACTICE_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Timer Controls */}
          <div className="timer-controls">
            {!hasStarted ? (
              <button
                onClick={handleStart}
                className="btn btn-primary control-btn"
                disabled={durationMinutes === 0}
              >
                Begin
              </button>
            ) : (
              <>
                {isRunning ? (
                  <button onClick={handlePause} className="btn btn-secondary control-btn">
                    Pause
                  </button>
                ) : (
                  <button onClick={handleResume} className="btn btn-primary control-btn">
                    Resume
                  </button>
                )}
                <button onClick={handleStop} className="btn btn-secondary control-btn">
                  Stop
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="completion-screen">
          <div className="completion-icon">✓</div>
          <h2>Practice Complete</h2>
          <p className="completion-duration">
            {formatTime(duration)} of {practiceType}
          </p>

          <div className="notes-section">
            <label className="notes-label">Post-session notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was your practice? Any insights?"
              className="input notes-input"
              rows={4}
            />
          </div>

          <div className="completion-actions">
            <button onClick={handleSaveSession} className="btn btn-primary">
              Save Session
            </button>
            <button onClick={handleFullReset} className="btn btn-secondary">
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timer
