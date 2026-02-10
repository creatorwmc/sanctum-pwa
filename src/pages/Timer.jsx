import { useState, useEffect, useRef } from 'react'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import { SOUNDS, playSoundRepeated, resumeAudio } from '../utils/sounds'
import { getTraditionSettings, shouldApplyBranding } from '../components/TraditionSettings'
import { translateTerm } from '../data/traditions'
import './Timer.css'

const BASE_PRACTICE_TYPES = [
  'Meditation',
  'Breathwork',
  'Visualization',
  'Ritual',
  'Study',
  'Contemplation',
  'Other'
]

// Translate a term if branding is enabled
function getTranslatedTerm(term) {
  if (shouldApplyBranding()) {
    const settings = getTraditionSettings()
    if (settings.traditionId) {
      return translateTerm(term, settings.traditionId)
    }
  }
  return term
}

// Get practice types with tradition-specific translations
function getPracticeTypes() {
  return BASE_PRACTICE_TYPES.map(type => ({
    value: type,
    label: getTranslatedTerm(type)
  }))
}

const MAX_MINUTES = 90

const INTERVAL_OPTIONS = [
  { value: 0, label: 'Off' },
  { value: 1, label: '1 min' },
  { value: 2, label: '2 min' },
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' }
]

const REPEAT_OPTIONS = [1, 2, 3]

const STORAGE_KEY = 'sanctum-sound-patterns'

const DEFAULT_PATTERNS = [
  {
    name: 'Opening & Closing Bell',
    events: [
      { minute: 0, sound: 'bell', repeats: 3 },
      { minute: -1, sound: 'bell', repeats: 3 } // -1 means "at end"
    ]
  },
  {
    name: 'Breath Intervals',
    events: [
      { minute: 5, sound: 'tingsha', repeats: 1 },
      { minute: 10, sound: 'tingsha', repeats: 1 },
      { minute: 15, sound: 'tingsha', repeats: 1 },
      { minute: 20, sound: 'tingsha', repeats: 1 }
    ]
  },
  {
    name: 'Deepening Journey',
    events: [
      { minute: 0, sound: 'singing_bowl', repeats: 1 },
      { minute: 5, sound: 'chimes', repeats: 1 },
      { minute: 15, sound: 'gong', repeats: 1 },
      { minute: -1, sound: 'singing_bowl', repeats: 3 }
    ]
  }
]

function loadSavedPatterns() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function savePatterns(patterns) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patterns))
}

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
  const [showSoundSettings, setShowSoundSettings] = useState(false)
  const [intervalSound, setIntervalSound] = useState('singing_bowl')
  const [intervalMinutes, setIntervalMinutes] = useState(0)
  const [intervalRepeats, setIntervalRepeats] = useState(1)
  // Custom schedule state
  const [soundMode, setSoundMode] = useState('simple') // 'simple' | 'custom'
  const [customEvents, setCustomEvents] = useState([])
  const [savedPatterns, setSavedPatterns] = useState(loadSavedPatterns)
  const [newPatternName, setNewPatternName] = useState('')
  const [showSaveInput, setShowSaveInput] = useState(false)
  const [editingEventIndex, setEditingEventIndex] = useState(null)
  const [newEventMinute, setNewEventMinute] = useState('')
  const [newEventSound, setNewEventSound] = useState('bell')
  const [newEventRepeats, setNewEventRepeats] = useState(1)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)
  const dialRef = useRef(null)
  const lastIntervalPlayedRef = useRef(-1)
  const playedCustomEventsRef = useRef(new Set())

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

  // Handle interval sounds - Simple mode
  useEffect(() => {
    if (!isRunning || !hasStarted || soundMode !== 'simple' || intervalMinutes === 0) return

    const elapsedSeconds = duration - timeLeft
    const intervalSeconds = intervalMinutes * 60

    // Calculate which interval we're at
    const currentInterval = Math.floor(elapsedSeconds / intervalSeconds)

    // Play sound if we've crossed into a new interval (but not at start)
    if (currentInterval > 0 && currentInterval !== lastIntervalPlayedRef.current && elapsedSeconds > 0) {
      // Don't play if we're at the very end (within last second)
      if (timeLeft > 1) {
        playSoundRepeated(intervalSound, intervalRepeats, 800)
      }
      lastIntervalPlayedRef.current = currentInterval
    }
  }, [timeLeft, isRunning, intervalMinutes, intervalSound, intervalRepeats, duration, hasStarted, soundMode])

  // Handle custom schedule sounds
  useEffect(() => {
    if (!isRunning || !hasStarted || soundMode !== 'custom' || customEvents.length === 0) return

    const elapsedSeconds = duration - timeLeft
    const elapsedMinutes = Math.floor(elapsedSeconds / 60)

    customEvents.forEach((event, index) => {
      const eventKey = `${index}-${event.minute}`

      // Handle "at end" events (minute === -1)
      if (event.minute === -1) {
        // Play when we're in the last second
        if (timeLeft <= 1 && timeLeft > 0 && !playedCustomEventsRef.current.has(eventKey)) {
          playSoundRepeated(event.sound, event.repeats, 800)
          playedCustomEventsRef.current.add(eventKey)
        }
        return
      }

      // Handle start event (minute === 0)
      if (event.minute === 0) {
        if (elapsedSeconds >= 0 && elapsedSeconds < 2 && !playedCustomEventsRef.current.has(eventKey)) {
          playSoundRepeated(event.sound, event.repeats, 800)
          playedCustomEventsRef.current.add(eventKey)
        }
        return
      }

      // Handle regular minute markers
      const targetSeconds = event.minute * 60
      if (elapsedSeconds >= targetSeconds && elapsedSeconds < targetSeconds + 2 && !playedCustomEventsRef.current.has(eventKey)) {
        playSoundRepeated(event.sound, event.repeats, 800)
        playedCustomEventsRef.current.add(eventKey)
      }
    })
  }, [timeLeft, isRunning, hasStarted, soundMode, customEvents, duration])

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
    resumeAudio() // Ensure audio context is active
    lastIntervalPlayedRef.current = -1 // Reset interval tracking
    playedCustomEventsRef.current = new Set() // Reset custom events tracking
    setTimeLeft(duration)
    setIsRunning(true)
    setHasStarted(true)
    startTimeRef.current = new Date()
  }

  // Custom event management
  function addCustomEvent() {
    const minute = newEventMinute === 'end' ? -1 : parseInt(newEventMinute, 10)
    if (isNaN(minute) && newEventMinute !== 'end') return
    if (minute > durationMinutes && minute !== -1) return

    const newEvent = {
      minute,
      sound: newEventSound,
      repeats: newEventRepeats
    }

    if (editingEventIndex !== null) {
      setCustomEvents(prev => prev.map((e, i) => i === editingEventIndex ? newEvent : e))
      setEditingEventIndex(null)
    } else {
      setCustomEvents(prev => [...prev, newEvent].sort((a, b) => {
        if (a.minute === -1) return 1
        if (b.minute === -1) return -1
        return a.minute - b.minute
      }))
    }

    setNewEventMinute('')
    setNewEventSound('bell')
    setNewEventRepeats(1)
  }

  function editEvent(index) {
    const event = customEvents[index]
    setEditingEventIndex(index)
    setNewEventMinute(event.minute === -1 ? 'end' : String(event.minute))
    setNewEventSound(event.sound)
    setNewEventRepeats(event.repeats)
  }

  function removeEvent(index) {
    setCustomEvents(prev => prev.filter((_, i) => i !== index))
  }

  function loadPattern(pattern) {
    setCustomEvents([...pattern.events])
  }

  function saveCurrentPattern() {
    if (!newPatternName.trim() || customEvents.length === 0) return

    const newPattern = {
      name: newPatternName.trim(),
      events: [...customEvents]
    }

    const updated = [...savedPatterns, newPattern]
    setSavedPatterns(updated)
    savePatterns(updated)
    setNewPatternName('')
    setShowSaveInput(false)
  }

  function deletePattern(index) {
    const updated = savedPatterns.filter((_, i) => i !== index)
    setSavedPatterns(updated)
    savePatterns(updated)
  }

  function getEventTimeDisplay(minute) {
    if (minute === -1) return 'End'
    if (minute === 0) return 'Start'
    return `${minute}m`
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

  async function handleShareSession() {
    const durationMins = Math.round(duration / 60)
    const shareText = `I just completed a ${durationMins} minute ${practiceType.toLowerCase()} session with Practice Space! 🧘✨`
    const shareData = {
      title: 'My Practice Session',
      text: shareText,
      url: 'https://sanctum-pwa-app.netlify.app'
    }

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareText + ' ' + shareData.url)
        alert('Session details copied to clipboard!')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        try {
          await navigator.clipboard.writeText(shareText + ' ' + shareData.url)
          alert('Session details copied to clipboard!')
        } catch {
          alert(shareText)
        }
      }
    }
  }

  async function handleSaveSession() {
    const session = {
      type: practiceType,
      duration: duration - timeLeft,
      actualDuration: duration,
      date: getLocalDateString(),
      startTime: startTimeRef.current?.toISOString(),
      endTime: new Date().toISOString(),
      notes: notes.trim(),
      completed: timeLeft === 0
    }

    try {
      await db.add('sessions', session)

      // Auto-log meditation practice to daily log
      const durationMins = Math.round((duration - timeLeft) / 60)
      const autoNotes = `${practiceType} session (${durationMins} min)${notes.trim() ? ': ' + notes.trim() : ''}`
      await queries.autoLogPractice('meditation', autoNotes)

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
              {getPracticeTypes().map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Interval Sounds */}
          {!isSessionActive && (
            <div className="interval-sounds">
              <button
                className={`interval-toggle ${showSoundSettings ? 'interval-toggle--active' : ''}`}
                onClick={() => setShowSoundSettings(!showSoundSettings)}
              >
                <span className="interval-toggle-icon">♪</span>
                <span>Interval Sounds</span>
                <span className="interval-toggle-status">
                  {soundMode === 'simple'
                    ? (intervalMinutes > 0 ? `${SOUNDS[intervalSound].name} every ${intervalMinutes}m` : 'Off')
                    : (customEvents.length > 0 ? `${customEvents.length} events` : 'Custom')}
                </span>
                <span className="interval-toggle-arrow">{showSoundSettings ? '▲' : '▼'}</span>
              </button>

              {showSoundSettings && (
                <div className="interval-settings">
                  {/* Mode Toggle */}
                  <div className="sound-mode-toggle">
                    <button
                      className={`mode-toggle-btn ${soundMode === 'simple' ? 'mode-toggle-btn--active' : ''}`}
                      onClick={() => setSoundMode('simple')}
                    >
                      Simple Repeating
                    </button>
                    <button
                      className={`mode-toggle-btn ${soundMode === 'custom' ? 'mode-toggle-btn--active' : ''}`}
                      onClick={() => setSoundMode('custom')}
                    >
                      Custom Schedule
                    </button>
                  </div>

                  {soundMode === 'simple' ? (
                    <>
                      <div className="interval-row">
                        <label className="interval-label">Sound</label>
                        <div className="sound-options">
                          {Object.entries(SOUNDS).map(([key, sound]) => (
                            <button
                              key={key}
                              className={`sound-btn ${intervalSound === key ? 'sound-btn--active' : ''}`}
                              onClick={() => {
                                setIntervalSound(key)
                                resumeAudio()
                                playSoundRepeated(key, 1)
                              }}
                            >
                              {sound.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="interval-row">
                        <label className="interval-label">Play every</label>
                        <div className="interval-options">
                          {INTERVAL_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              className={`interval-btn ${intervalMinutes === opt.value ? 'interval-btn--active' : ''}`}
                              onClick={() => setIntervalMinutes(opt.value)}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="interval-row">
                        <label className="interval-label">Repeat</label>
                        <div className="repeat-options">
                          {REPEAT_OPTIONS.map(n => (
                            <button
                              key={n}
                              className={`repeat-btn ${intervalRepeats === n ? 'repeat-btn--active' : ''}`}
                              onClick={() => setIntervalRepeats(n)}
                            >
                              {n}×
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Custom Schedule UI */}
                      {/* Load Pattern */}
                      <div className="interval-row">
                        <label className="interval-label">Load Pattern</label>
                        <div className="pattern-list">
                          {DEFAULT_PATTERNS.map((pattern, index) => (
                            <button
                              key={`default-${index}`}
                              className="pattern-btn"
                              onClick={() => loadPattern(pattern)}
                            >
                              {pattern.name}
                            </button>
                          ))}
                          {savedPatterns.map((pattern, index) => (
                            <div key={`saved-${index}`} className="pattern-item">
                              <button
                                className="pattern-btn pattern-btn--saved"
                                onClick={() => loadPattern(pattern)}
                              >
                                {pattern.name}
                              </button>
                              <button
                                className="pattern-delete-btn"
                                onClick={() => deletePattern(index)}
                                title="Delete pattern"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Current Events */}
                      <div className="interval-row">
                        <label className="interval-label">Sound Events</label>
                        {customEvents.length > 0 ? (
                          <div className="custom-events-list">
                            {customEvents.map((event, index) => (
                              <div key={index} className="custom-event">
                                <span className="event-time">{getEventTimeDisplay(event.minute)}</span>
                                <span className="event-sound">{SOUNDS[event.sound]?.name}</span>
                                <span className="event-repeats">×{event.repeats}</span>
                                <button
                                  className="event-edit-btn"
                                  onClick={() => editEvent(index)}
                                  title="Edit"
                                >
                                  ✎
                                </button>
                                <button
                                  className="event-delete-btn"
                                  onClick={() => removeEvent(index)}
                                  title="Remove"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-events-hint">No events added yet</p>
                        )}
                      </div>

                      {/* Add/Edit Event */}
                      <div className="interval-row">
                        <label className="interval-label">
                          {editingEventIndex !== null ? 'Edit Event' : 'Add Event'}
                        </label>
                        <div className="add-event-form">
                          <div className="event-form-row">
                            <label>At minute:</label>
                            <select
                              value={newEventMinute}
                              onChange={(e) => setNewEventMinute(e.target.value)}
                              className="event-select"
                            >
                              <option value="">Select...</option>
                              <option value="0">Start (0m)</option>
                              {[...Array(Math.max(1, durationMinutes))].map((_, i) => (
                                i > 0 && <option key={i} value={i}>{i}m</option>
                              ))}
                              <option value="end">At End</option>
                            </select>
                          </div>
                          <div className="event-form-row">
                            <label>Sound:</label>
                            <select
                              value={newEventSound}
                              onChange={(e) => setNewEventSound(e.target.value)}
                              className="event-select"
                            >
                              {Object.entries(SOUNDS).map(([key, sound]) => (
                                <option key={key} value={key}>{sound.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="event-form-row">
                            <label>Repeat:</label>
                            <div className="event-repeat-btns">
                              {REPEAT_OPTIONS.map(n => (
                                <button
                                  key={n}
                                  className={`repeat-btn ${newEventRepeats === n ? 'repeat-btn--active' : ''}`}
                                  onClick={() => setNewEventRepeats(n)}
                                >
                                  {n}×
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="event-form-actions">
                            <button
                              className="btn btn-secondary event-add-btn"
                              onClick={addCustomEvent}
                              disabled={!newEventMinute}
                            >
                              {editingEventIndex !== null ? 'Update' : 'Add'}
                            </button>
                            {editingEventIndex !== null && (
                              <button
                                className="btn btn-secondary"
                                onClick={() => {
                                  setEditingEventIndex(null)
                                  setNewEventMinute('')
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Preview Timeline */}
                      {durationMinutes > 0 && customEvents.length > 0 && (
                        <div className="interval-row">
                          <label className="interval-label">Preview</label>
                          <div className="timeline-preview">
                            <div className="timeline-bar">
                              {customEvents.map((event, index) => {
                                const position = event.minute === -1
                                  ? 100
                                  : (event.minute / durationMinutes) * 100
                                return (
                                  <div
                                    key={index}
                                    className="timeline-marker"
                                    style={{ left: `${position}%` }}
                                    title={`${getEventTimeDisplay(event.minute)}: ${SOUNDS[event.sound]?.name} ×${event.repeats}`}
                                  >
                                    <span className="timeline-dot" />
                                  </div>
                                )
                              })}
                            </div>
                            <div className="timeline-labels">
                              <span>0</span>
                              <span>{durationMinutes}m</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Save Pattern */}
                      {customEvents.length > 0 && (
                        <div className="interval-row">
                          {showSaveInput ? (
                            <div className="save-pattern-form">
                              <input
                                type="text"
                                value={newPatternName}
                                onChange={(e) => setNewPatternName(e.target.value)}
                                placeholder="Pattern name"
                                className="input pattern-name-input"
                              />
                              <button
                                className="btn btn-primary"
                                onClick={saveCurrentPattern}
                                disabled={!newPatternName.trim()}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={() => setShowSaveInput(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-secondary save-pattern-btn"
                              onClick={() => setShowSaveInput(true)}
                            >
                              Save as Pattern
                            </button>
                          )}
                        </div>
                      )}

                      {/* Clear All */}
                      {customEvents.length > 0 && (
                        <button
                          className="clear-events-btn"
                          onClick={() => setCustomEvents([])}
                        >
                          Clear All Events
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}

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
          <h2>{getTranslatedTerm('Practice')} Complete</h2>
          <p className="completion-duration">
            {formatTime(duration)} of {getTranslatedTerm(practiceType)}
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

          <button
            onClick={() => handleShareSession()}
            className="share-session-btn"
          >
            <span className="share-session-icon">↗</span>
            Share My Session
          </button>
        </div>
      )}
    </div>
  )
}

export default Timer
