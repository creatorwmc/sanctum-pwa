import { useState, useEffect } from 'react'
import { db, queries } from '../db'
import ShaktonaIcon from '../components/ShaktonaIcon'
import './DailyLog.css'

const PRACTICES = [
  {
    id: 'bath',
    label: 'Ritual Bath',
    icon: '💧',
    description: 'Alchemical work, color therapy, integration'
  },
  {
    id: 'meditation',
    label: 'Meditation',
    icon: '🧘',
    description: 'Sitting, walking, visualization work'
  },
  {
    id: 'vessel',
    label: 'Vessel Work',
    icon: '⚱',
    description: 'Physical practices that fortify/maintain the body (Tibetan rites, movement, embodiment)'
  },
  {
    id: 'breathwork',
    label: 'Breathwork',
    icon: '🌬',
    description: 'Pranayama, conscious breathing'
  },
  {
    id: 'study',
    label: 'Study/Reading',
    icon: '📖',
    description: 'Library work, spiritual texts, philosophy'
  },
  {
    id: 'journaling',
    label: 'Integration Journaling',
    icon: '✎',
    description: 'Documenting insights, stumbles, breakthroughs'
  },
  {
    id: 'union',
    label: 'Sacred Union',
    icon: 'shatkona',
    description: 'Care for relationship, from thoughtful gestures to sex magic'
  },
  {
    id: 'tending',
    label: 'Tending',
    icon: '🌱',
    description: 'Embodied service to others (animals, land, home, people)'
  },
  {
    id: 'tarot',
    label: 'Tarot/Divination',
    icon: '🎴',
    description: 'Guidance, symbol work'
  },
  {
    id: 'ceremony',
    label: 'Ceremonial Work',
    icon: '🕯',
    description: 'Quarterly ceremonies, moon rituals, magical operations'
  }
]

function DailyLog() {
  const [todayLog, setTodayLog] = useState(null)
  const [practices, setPractices] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTip, setActiveTip] = useState(null)

  const today = new Date().toISOString().split('T')[0]
  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  useEffect(() => {
    loadTodayLog()
  }, [])

  async function loadTodayLog() {
    try {
      const log = await queries.getTodayLog()
      if (log) {
        setTodayLog(log)
        setPractices(log.practices || [])
        setNotes(log.notes || '')
      }
    } catch (error) {
      console.error('Error loading today log:', error)
    } finally {
      setLoading(false)
    }
  }

  function togglePractice(practiceId) {
    setPractices(prev => {
      if (prev.includes(practiceId)) {
        return prev.filter(p => p !== practiceId)
      }
      return [...prev, practiceId]
    })
  }

  function handlePracticeLongPress(practiceId) {
    setActiveTip(activeTip === practiceId ? null : practiceId)
  }

  async function saveLog() {
    setSaving(true)
    try {
      const logData = {
        date: today,
        practices,
        notes: notes.trim(),
        updatedAt: new Date().toISOString()
      }

      if (todayLog) {
        await db.update('dailyLogs', { ...todayLog, ...logData })
      } else {
        const newLog = await db.add('dailyLogs', logData)
        setTodayLog(newLog)
      }
    } catch (error) {
      console.error('Error saving log:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="daily-log">
      <div className="log-header">
        <h2>{displayDate}</h2>
        <p className="log-subtitle">Track your daily practices</p>
      </div>

      <section className="practices-section">
        <h3 className="section-title">Practices</h3>
        <div className="practices-grid">
          {PRACTICES.map(practice => (
            <div key={practice.id} className="practice-wrapper">
              <button
                onClick={() => togglePractice(practice.id)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handlePracticeLongPress(practice.id)
                }}
                onTouchStart={() => {
                  const timer = setTimeout(() => handlePracticeLongPress(practice.id), 500)
                  practice._timer = timer
                }}
                onTouchEnd={() => {
                  if (practice._timer) clearTimeout(practice._timer)
                }}
                className={`practice-btn ${practices.includes(practice.id) ? 'practice-btn--active' : ''}`}
                title={practice.description}
              >
                <span className="practice-icon">
                  {practice.icon === 'shatkona' ? <ShaktonaIcon size={22} /> : practice.icon}
                </span>
                <span className="practice-label">{practice.label}</span>
              </button>
              <div className={`practice-tooltip ${activeTip === practice.id ? 'practice-tooltip--visible' : ''}`}>
                {practice.description}
              </div>
            </div>
          ))}
        </div>
        <p className="practices-hint">Long-press or right-click for description</p>
      </section>

      <section className="notes-section">
        <h3 className="section-title">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How was your day? Any observations?"
          className="input notes-textarea"
          rows={4}
        />
      </section>

      <div className="log-footer">
        <button
          onClick={saveLog}
          disabled={saving}
          className="btn btn-primary save-btn"
        >
          {saving ? 'Saving...' : todayLog ? 'Update Log' : 'Save Log'}
        </button>
        {todayLog && (
          <p className="last-saved">
            Last saved: {new Date(todayLog.updatedAt || todayLog.createdAt).toLocaleTimeString()}
          </p>
        )}
      </div>

      <section className="summary-section">
        <h3 className="section-title">Today's Progress</h3>
        <div className="progress-summary">
          <span className="progress-count">{practices.length}</span>
          <span className="progress-label">of {PRACTICES.length} practices</span>
        </div>
        {practices.length > 0 && (
          <div className="completed-list">
            {practices.map(p => {
              const practice = PRACTICES.find(dp => dp.id === p)
              return practice ? (
                <span key={p} className="completed-chip">
                  {practice.icon === 'shatkona' ? <ShaktonaIcon size={14} /> : practice.icon} {practice.label}
                </span>
              ) : null
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default DailyLog
