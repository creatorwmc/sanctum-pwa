import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import ShaktonaIcon from '../components/ShaktonaIcon'
import './DailyLog.css'

const PRACTICES = [
  {
    id: 'bath',
    label: 'Ritual Bath',
    icon: '💧',
    description: 'Alchemical work, color therapy, integration',
    examples: ['Salt bath with intention setting', 'Color therapy soak', 'Cold plunge']
  },
  {
    id: 'meditation',
    label: 'Meditation',
    icon: '🧘',
    description: 'Sitting, walking, visualization work',
    examples: ['Silent sitting (10-30 min)', 'Guided visualization', 'Walking meditation']
  },
  {
    id: 'vessel',
    label: 'Vessel Work',
    icon: '⚱',
    description: 'Physical practices that fortify the body',
    examples: ['Five Tibetan Rites', 'Yoga or stretching', 'Qigong or tai chi']
  },
  {
    id: 'breathwork',
    label: 'Breathwork',
    icon: '🌬',
    description: 'Pranayama, conscious breathing',
    examples: ['Box breathing', 'Wim Hof rounds', 'Alternate nostril breathing']
  },
  {
    id: 'study',
    label: 'Study/Reading',
    icon: '📖',
    description: 'Library work, spiritual texts, philosophy',
    examples: ['Sacred texts', 'Esoteric traditions', 'Spiritual teachings']
  },
  {
    id: 'journaling',
    label: 'Integration Journaling',
    icon: '✎',
    description: 'Documenting insights, stumbles, breakthroughs',
    examples: ['Morning pages', 'Dream journaling', 'Reflecting on synchronicities']
  },
  {
    id: 'union',
    label: 'Sacred Union',
    icon: 'shatkona',
    description: 'Care for relationship, from gestures to intimacy',
    examples: ['Quality time', 'Acts of service', 'Tantric practices']
  },
  {
    id: 'tending',
    label: 'Tending',
    icon: '🌱',
    description: 'Embodied service to others',
    examples: ['Gardening', 'Preparing food', 'Caring for animals']
  },
  {
    id: 'tarot',
    label: 'Tarot/Divination',
    icon: '🎴',
    description: 'Guidance, symbol work',
    examples: ['Daily card pull', 'Three-card spread', 'I Ching consultation']
  },
  {
    id: 'ceremony',
    label: 'Ceremonial Work',
    icon: '🕯',
    description: 'Rituals, moon ceremonies, magical operations',
    examples: ['Moon ritual', 'Candle magic', 'Altar work']
  }
]

function DailyLog() {
  const [todayLog, setTodayLog] = useState(null)
  const [selectedPractices, setSelectedPractices] = useState([])
  const [entryNotes, setEntryNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(0)
  const [usedStoredToday, setUsedStoredToday] = useState(false)
  const [autoUsedNotification, setAutoUsedNotification] = useState(null)

  // Edit state
  const [editingEntry, setEditingEntry] = useState(null)
  const [editPractice, setEditPractice] = useState('')
  const [editNotes, setEditNotes] = useState('')

  // Notes view state
  const [viewingNotes, setViewingNotes] = useState(null)

  // Convert modal
  const [showConvertModal, setShowConvertModal] = useState(false)

  // Practice detail modal
  const [detailPractice, setDetailPractice] = useState(null)

  const today = getLocalDateString()
  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  useEffect(() => {
    async function init() {
      const autoUseResult = await queries.checkAndAutoUseStoredPractice()
      if (autoUseResult.autoUsed) {
        setAutoUsedNotification(`Stored practice auto-used for ${new Date(autoUseResult.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to maintain your streak!`)
        setTimeout(() => setAutoUsedNotification(null), 5000)
      }

      await loadTodayLog()
      await loadStats()
    }
    init()
  }, [])

  async function loadTodayLog() {
    try {
      const log = await queries.getTodayLog()
      if (log) {
        // Migrate old format to new format if needed
        if (log.practices && !log.entries) {
          log.entries = log.practices.map((practiceId, idx) => ({
            id: `migrated-${idx}`,
            practiceId,
            timestamp: log.createdAt || new Date().toISOString(),
            notes: idx === 0 ? (log.notes || '') : ''
          }))
        }
        setTodayLog(log)
      }
    } catch (error) {
      console.error('Error loading today log:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    try {
      const practiceStats = await queries.getPracticeStats()
      const currentStreak = await queries.getPracticeStreak()
      setStats(practiceStats)
      setStreak(currentStreak)

      if (practiceStats.storedPracticeUses?.includes(today)) {
        setUsedStoredToday(true)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  function togglePractice(practiceId) {
    setSelectedPractices(prev => {
      if (prev.includes(practiceId)) {
        return prev.filter(p => p !== practiceId)
      }
      return [...prev, practiceId]
    })
  }

  // Get unique practice IDs from entries
  function getUniquePractices() {
    if (!todayLog?.entries) return []
    return [...new Set(todayLog.entries.map(e => e.practiceId))]
  }

  // Calculate bonus points based on unique practices
  function calculateBonusPoints(uniqueCount) {
    if (uniqueCount < 2) return 0
    return Math.min(Math.floor(uniqueCount / 2), 5)
  }

  async function logPractices() {
    if (selectedPractices.length === 0) return
    setSaving(true)

    try {
      const previousUnique = getUniquePractices().length
      const timestamp = new Date().toISOString()

      // Create new entries for each selected practice
      const newEntries = selectedPractices.map((practiceId, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
        practiceId,
        timestamp,
        notes: idx === 0 ? entryNotes.trim() : '' // Only first practice gets the notes
      }))

      const existingEntries = todayLog?.entries || []
      const allEntries = [...existingEntries, ...newEntries]

      const logData = {
        date: today,
        entries: allEntries,
        // Keep practices array for backwards compatibility with history queries
        practices: [...new Set(allEntries.map(e => e.practiceId))],
        updatedAt: new Date().toISOString()
      }

      if (todayLog) {
        await db.update('dailyLogs', { ...todayLog, ...logData })
        setTodayLog({ ...todayLog, ...logData })
      } else {
        const newLog = await db.add('dailyLogs', logData)
        setTodayLog(newLog)
      }

      // Update bonus points
      const newUnique = [...new Set(allEntries.map(e => e.practiceId))].length
      const previousBonus = calculateBonusPoints(previousUnique)
      const newBonus = calculateBonusPoints(newUnique)
      const bonusDiff = newBonus - previousBonus

      if (bonusDiff !== 0 && stats) {
        await queries.updatePracticeStats({ bonusPoints: Math.max(0, stats.bonusPoints + bonusDiff) })
      }

      // Update streak if needed
      const currentStreak = await queries.getPracticeStreak()
      if (stats && currentStreak > stats.longestStreak) {
        await queries.updatePracticeStats({ longestStreak: currentStreak })
      }

      // Clear form
      setSelectedPractices([])
      setEntryNotes('')
      await loadStats()
    } catch (error) {
      console.error('Error logging practices:', error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteEntry(entryId) {
    if (!todayLog?.entries) return

    const previousUnique = getUniquePractices().length
    const updatedEntries = todayLog.entries.filter(e => e.id !== entryId)

    const logData = {
      ...todayLog,
      entries: updatedEntries,
      practices: [...new Set(updatedEntries.map(e => e.practiceId))],
      updatedAt: new Date().toISOString()
    }

    await db.update('dailyLogs', logData)
    setTodayLog(logData)

    // Update bonus points
    const newUnique = [...new Set(updatedEntries.map(e => e.practiceId))].length
    const previousBonus = calculateBonusPoints(previousUnique)
    const newBonus = calculateBonusPoints(newUnique)
    const bonusDiff = newBonus - previousBonus

    if (bonusDiff !== 0 && stats) {
      await queries.updatePracticeStats({ bonusPoints: Math.max(0, stats.bonusPoints + bonusDiff) })
    }

    await loadStats()
  }

  function startEditEntry(entry) {
    setEditingEntry(entry)
    setEditPractice(entry.practiceId)
    setEditNotes(entry.notes || '')
  }

  async function saveEditEntry() {
    if (!editingEntry || !editPractice) return

    const previousUnique = getUniquePractices().length
    const updatedEntries = todayLog.entries.map(e =>
      e.id === editingEntry.id
        ? { ...e, practiceId: editPractice, notes: editNotes.trim() }
        : e
    )

    const logData = {
      ...todayLog,
      entries: updatedEntries,
      practices: [...new Set(updatedEntries.map(e => e.practiceId))],
      updatedAt: new Date().toISOString()
    }

    await db.update('dailyLogs', logData)
    setTodayLog(logData)

    // Update bonus points if unique count changed
    const newUnique = [...new Set(updatedEntries.map(e => e.practiceId))].length
    const previousBonus = calculateBonusPoints(previousUnique)
    const newBonus = calculateBonusPoints(newUnique)
    const bonusDiff = newBonus - previousBonus

    if (bonusDiff !== 0 && stats) {
      await queries.updatePracticeStats({ bonusPoints: Math.max(0, stats.bonusPoints + bonusDiff) })
    }

    setEditingEntry(null)
    setEditPractice('')
    setEditNotes('')
    await loadStats()
  }

  async function handleUseStoredPractice() {
    if (!stats || stats.storedPractices <= 0 || getUniquePractices().length > 0 || usedStoredToday) return

    const success = await queries.useStoredPractice()
    if (success) {
      setUsedStoredToday(true)
      await loadStats()
    }
  }

  async function handleConvertToStored() {
    if (!stats || stats.bonusPoints < 10) return

    const success = await queries.convertBonusToStored()
    if (success) {
      await loadStats()
      setShowConvertModal(false)
    }
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  function getPracticeInfo(practiceId) {
    return PRACTICES.find(p => p.id === practiceId) || { label: practiceId, icon: '?' }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  const entries = todayLog?.entries || []
  const uniquePractices = getUniquePractices()
  const todayBonusPoints = calculateBonusPoints(uniquePractices.length)
  const canUseStoredPractice = stats && stats.storedPractices > 0 && uniquePractices.length === 0 && !usedStoredToday

  return (
    <div className="daily-log">
      {/* 1. HEADER SECTION */}
      <div className="log-header">
        <h2>{displayDate}</h2>
        <p className="log-subtitle">Track your daily practices</p>
        <Link to="/practice-history" className="btn btn-secondary history-link">
          View Practice History
        </Link>
      </div>

      {/* 2. STATS SECTION */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">day streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.bonusPoints}</span>
            <span className="stat-label">bonus pts</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.storedPractices}</span>
            <span className="stat-label">stored</span>
          </div>
        </div>
      )}

      {/* Auto-use Notification */}
      {autoUsedNotification && (
        <div className="auto-used-notification">
          <span className="auto-used-icon">🔄</span>
          <span>{autoUsedNotification}</span>
        </div>
      )}

      {/* Stored Practice Action */}
      {canUseStoredPractice && (
        <div className="stored-practice-banner">
          <p>No practices logged. Use stored energy to maintain your streak.</p>
          <button onClick={handleUseStoredPractice} className="btn btn-secondary use-stored-btn">
            Use Stored Practice
          </button>
        </div>
      )}

      {usedStoredToday && entries.length === 0 && (
        <div className="stored-practice-used">
          <span className="used-icon">✓</span>
          <span>Stored Practice used - streak maintained!</span>
        </div>
      )}

      {/* 3. PRACTICE SELECTION SECTION */}
      <section className="practices-section">
        <h3 className="section-title">Log Practice</h3>
        <div className="practices-grid">
          {PRACTICES.map(practice => (
            <button
              key={practice.id}
              onClick={() => togglePractice(practice.id)}
              onDoubleClick={() => setDetailPractice(practice)}
              className={`practice-btn ${selectedPractices.includes(practice.id) ? 'practice-btn--active' : ''}`}
              title={practice.description}
            >
              <span className="practice-icon">
                {practice.icon === 'shatkona' ? <ShaktonaIcon size={20} /> : practice.icon}
              </span>
              <span className="practice-label">{practice.label}</span>
            </button>
          ))}
        </div>

        <div className="log-form">
          <textarea
            value={entryNotes}
            onChange={(e) => setEntryNotes(e.target.value)}
            placeholder="Add notes (optional)..."
            className="input notes-input"
            rows={2}
          />
          <button
            onClick={logPractices}
            disabled={saving || selectedPractices.length === 0}
            className="btn btn-primary log-btn"
          >
            {saving ? 'Logging...' : `Log ${selectedPractices.length > 0 ? `(${selectedPractices.length})` : 'Practice'}`}
          </button>
        </div>

        {/* Bonus indicator */}
        <div className="bonus-indicator">
          <span className="bonus-label">Today's bonus:</span>
          <span className="bonus-value">+{todayBonusPoints}</span>
          <div className="bonus-dots">
            {[2, 4, 6, 8, 10].map(n => (
              <span
                key={n}
                className={`bonus-dot ${uniquePractices.length >= n ? 'bonus-dot--active' : ''}`}
                title={`${n} unique practices`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TODAY'S LOG SECTION */}
      <section className="todays-log-section">
        <h3 className="section-title">Today's Log</h3>

        {entries.length === 0 ? (
          <div className="empty-log">
            <p>No practices logged yet today</p>
            <p className="empty-hint">Select practices above and click "Log Practice"</p>
          </div>
        ) : (
          <div className="entries-list">
            {[...entries].reverse().map(entry => {
              const practice = getPracticeInfo(entry.practiceId)
              return (
                <div key={entry.id} className="entry-card">
                  <div className="entry-main">
                    <span className="entry-icon">
                      {practice.icon === 'shatkona' ? <ShaktonaIcon size={18} /> : practice.icon}
                    </span>
                    <div className="entry-info">
                      <span className="entry-name">{practice.label}</span>
                      <span className="entry-time">{formatTime(entry.timestamp)}</span>
                    </div>
                    {entry.notes && (
                      <button
                        className="entry-notes-btn"
                        onClick={() => setViewingNotes(entry)}
                      >
                        Notes
                      </button>
                    )}
                  </div>
                  <div className="entry-actions">
                    <button
                      className="entry-edit-btn"
                      onClick={() => startEditEntry(entry)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="entry-delete-btn"
                      onClick={() => deleteEntry(entry.id)}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {entries.length > 0 && (
          <div className="log-summary">
            <span>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
            <span className="summary-divider">•</span>
            <span>{uniquePractices.length} unique {uniquePractices.length === 1 ? 'practice' : 'practices'}</span>
          </div>
        )}
      </section>

      {/* Bonus Points Conversion */}
      {stats && stats.bonusPoints >= 10 && (
        <section className="conversion-section">
          <div className="conversion-card">
            <div className="conversion-info">
              <h4>Convert Bonus Points</h4>
              <p>Exchange 10 points for 1 stored practice</p>
            </div>
            <button
              onClick={() => setShowConvertModal(true)}
              className="btn btn-secondary convert-btn"
            >
              Convert
            </button>
          </div>
        </section>
      )}

      {/* Edit Entry Modal */}
      {editingEntry && (
        <div className="modal-overlay" onClick={() => setEditingEntry(null)}>
          <div className="modal-content edit-modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Entry</h3>
            <div className="edit-form">
              <label className="edit-label">Practice</label>
              <select
                value={editPractice}
                onChange={(e) => setEditPractice(e.target.value)}
                className="input"
              >
                {PRACTICES.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>

              <label className="edit-label">Notes</label>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes..."
                className="input"
                rows={3}
              />
            </div>
            <div className="modal-actions">
              <button onClick={saveEditEntry} className="btn btn-primary">Save</button>
              <button onClick={() => setEditingEntry(null)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* View Notes Modal */}
      {viewingNotes && (
        <div className="modal-overlay" onClick={() => setViewingNotes(null)}>
          <div className="modal-content notes-modal" onClick={e => e.stopPropagation()}>
            <div className="notes-modal-header">
              <span className="notes-modal-icon">
                {getPracticeInfo(viewingNotes.practiceId).icon === 'shatkona'
                  ? <ShaktonaIcon size={20} />
                  : getPracticeInfo(viewingNotes.practiceId).icon}
              </span>
              <h3>{getPracticeInfo(viewingNotes.practiceId).label}</h3>
              <span className="notes-modal-time">{formatTime(viewingNotes.timestamp)}</span>
            </div>
            <div className="notes-modal-content">
              {viewingNotes.notes}
            </div>
            <div className="modal-actions">
              <button
                onClick={() => {
                  startEditEntry(viewingNotes)
                  setViewingNotes(null)
                }}
                className="btn btn-secondary"
              >
                Edit
              </button>
              <button onClick={() => setViewingNotes(null)} className="btn btn-primary">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="modal-overlay" onClick={() => setShowConvertModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Convert Bonus Points</h3>
            <p>Exchange 10 bonus points for 1 Stored Practice?</p>
            <div className="modal-stats">
              <div>Current Bonus: {stats.bonusPoints} points</div>
              <div>Current Stored: {stats.storedPractices}</div>
            </div>
            <div className="modal-actions">
              <button onClick={handleConvertToStored} className="btn btn-primary">Convert</button>
              <button onClick={() => setShowConvertModal(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Practice Detail Modal */}
      {detailPractice && (
        <div className="modal-overlay" onClick={() => setDetailPractice(null)}>
          <div className="modal-content practice-detail-modal" onClick={e => e.stopPropagation()}>
            <button className="detail-close" onClick={() => setDetailPractice(null)}>×</button>
            <div className="detail-header">
              <span className="detail-icon">
                {detailPractice.icon === 'shatkona' ? <ShaktonaIcon size={32} /> : detailPractice.icon}
              </span>
              <h3>{detailPractice.label}</h3>
            </div>
            <p className="detail-description">{detailPractice.description}</p>
            <div className="detail-examples">
              <h4>Examples</h4>
              <ul>
                {detailPractice.examples.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyLog
