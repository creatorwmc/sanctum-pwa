import { useState } from 'react'
import { getTraditionSettings, shouldApplyBranding } from '../components/TraditionSettings'
import { translateTerm } from '../data/traditions'
import './Timer.css'

const STILLPOINT_BASE = 'https://stillpoint-pwa.netlify.app/meditation'
const MAX_MINUTES = 90

const PRACTICE_TYPES = [
  'Meditation',
  'Breathwork',
  'Visualization',
  'Ritual',
  'Study',
  'Contemplation',
  'Other',
]

const BELL_OPTIONS = [
  { id: 'tibetan', label: 'Tibetan Singing Bowl' },
  { id: 'rin', label: 'Japanese Rin Gong' },
  { id: 'meditation', label: 'Meditation Bell' },
  { id: 'bell', label: 'Bell' },
  { id: 'chime', label: 'Soft Chime' },
  { id: 'chimes', label: 'Chimes' },
  { id: 'gong', label: 'Gong' },
  { id: 'tingsha', label: 'Tingsha' },
  { id: 'wood_block', label: 'Wood Block' },
  { id: 'silent', label: 'Silent' },
]

const WARMUP_OPTIONS = [0, 1, 2, 3, 5]
const INTERVAL_OPTIONS = [0, 1, 2, 5, 10, 15]
const REPEAT_OPTIONS = [1, 2, 3]
const DURATION_PRESETS = [5, 10, 15, 20, 30, 45, 60]

function getTranslatedTerm(term) {
  if (shouldApplyBranding()) {
    const settings = getTraditionSettings()
    if (settings.traditionId) {
      return translateTerm(term, settings.traditionId)
    }
  }
  return term
}

function Timer() {
  const [duration, setDuration] = useState(20)
  const [manualInput, setManualInput] = useState('')
  const [practiceType, setPracticeType] = useState('Meditation')
  const [warmup, setWarmup] = useState(0)
  const [intervals, setIntervals] = useState(0)
  const [bell, setBell] = useState('tibetan')
  const [repeats, setRepeats] = useState(1)

  function handleManualInputChange(e) {
    const value = e.target.value
    setManualInput(value)
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      setDuration(Math.min(parsed, MAX_MINUTES))
    } else if (value === '') {
      setDuration(0)
    }
  }

  function buildStillpointUrl(skipPreConfig = false) {
    if (skipPreConfig) {
      return `${STILLPOINT_BASE}?source=practice_space`
    }
    const params = new URLSearchParams({
      duration: String(duration),
      bell,
      practice_type: practiceType,
      source: 'practice_space',
    })
    if (warmup > 0) params.set('warmup', String(warmup))
    if (intervals > 0) params.set('intervals', String(intervals))
    if (repeats > 1) params.set('repeats', String(repeats))
    return `${STILLPOINT_BASE}?${params.toString()}`
  }

  function handleBegin() {
    if (duration === 0) return
    window.location.href = buildStillpointUrl()
  }

  function handleAdvanced() {
    window.location.href = buildStillpointUrl(true)
  }

  return (
    <div className="timer-page">
      <div className="stillpoint-handoff-intro">
        <h2 className="stillpoint-handoff-title">{getTranslatedTerm('Practice')} Timer</h2>
        <p className="stillpoint-handoff-subtitle">
          Configure here, then continue in Stillpoint.
        </p>
      </div>

      {/* Duration */}
      <div className="duration-controls">
        <div className="quick-add-buttons">
          {DURATION_PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setDuration(m)
                setManualInput('')
              }}
              className={`add-btn ${duration === m && !manualInput ? 'add-btn--active' : ''}`}
            >
              {m}m
            </button>
          ))}
        </div>
        <div className="manual-input-section">
          <input
            type="number"
            value={manualInput}
            onChange={handleManualInputChange}
            placeholder={`${duration}m`}
            min="1"
            max={MAX_MINUTES}
            className="input manual-input"
          />
          <span className="max-label">max {MAX_MINUTES}m</span>
        </div>
      </div>

      {/* Practice type */}
      <div className="config-section">
        <label className="interval-label">Practice type</label>
        <div className="practice-type-chips">
          {PRACTICE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setPracticeType(t)}
              className={`type-chip ${practiceType === t ? 'type-chip--active' : ''}`}
            >
              {getTranslatedTerm(t)}
            </button>
          ))}
        </div>
      </div>

      {/* Warmup */}
      <div className="config-section">
        <label className="interval-label">Warmup (silent settle)</label>
        <div className="chip-row">
          {WARMUP_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => setWarmup(m)}
              className={`interval-btn ${warmup === m ? 'interval-btn--active' : ''}`}
            >
              {m === 0 ? 'none' : `${m}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Interval bells */}
      <div className="config-section">
        <label className="interval-label">Interval bells</label>
        <div className="chip-row">
          {INTERVAL_OPTIONS.map((m) => (
            <button
              key={m}
              onClick={() => setIntervals(m)}
              className={`interval-btn ${intervals === m ? 'interval-btn--active' : ''}`}
            >
              {m === 0 ? 'none' : `every ${m}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Bell sound */}
      <div className="config-section">
        <label className="interval-label">Bell sound</label>
        <select
          value={bell}
          onChange={(e) => setBell(e.target.value)}
          className="input bell-select"
        >
          {BELL_OPTIONS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
      </div>

      {/* Bell repeats (only meaningful when intervals > 0) */}
      {intervals > 0 && (
        <div className="config-section">
          <label className="interval-label">Repeat each interval bell</label>
          <div className="chip-row">
            {REPEAT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setRepeats(n)}
                className={`repeat-btn ${repeats === n ? 'repeat-btn--active' : ''}`}
              >
                {n}×
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Begin */}
      <div className="timer-controls">
        <button
          onClick={handleBegin}
          className="btn btn-primary control-btn"
          disabled={duration === 0}
        >
          Begin in Stillpoint
        </button>
      </div>

      <button onClick={handleAdvanced} className="stillpoint-advanced-link">
        Custom schedule or saved patterns →
      </button>

      <p className="stillpoint-handoff-footer">
        Your meditation runs in Stillpoint. Sessions are saved there and shown back here in your
        practice history.
      </p>
    </div>
  )
}

export default Timer
