import { useState, useEffect } from 'react'
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
    examples: [
      'Salt bath with intention setting',
      'Color therapy soak (herbs, bath bombs)',
      'Cold plunge or contrast therapy'
    ]
  },
  {
    id: 'meditation',
    label: 'Meditation',
    icon: '🧘',
    description: 'Sitting, walking, visualization work',
    examples: [
      'Silent sitting meditation (10-30 min)',
      'Guided visualization journey',
      'Walking meditation in nature'
    ]
  },
  {
    id: 'vessel',
    label: 'Vessel Work',
    icon: '⚱',
    description: 'Physical practices that fortify/maintain the body (Tibetan rites, movement, embodiment)',
    examples: [
      'Five Tibetan Rites',
      'Yoga or stretching routine',
      'Qigong or tai chi practice'
    ]
  },
  {
    id: 'breathwork',
    label: 'Breathwork',
    icon: '🌬',
    description: 'Pranayama, conscious breathing',
    examples: [
      'Box breathing (4-4-4-4)',
      'Wim Hof breathing rounds',
      'Alternate nostril breathing (Nadi Shodhana)'
    ]
  },
  {
    id: 'study',
    label: 'Study/Reading',
    icon: '📖',
    description: 'Library work, spiritual texts, philosophy',
    examples: [
      'Reading sacred texts or philosophy',
      'Studying esoteric traditions',
      'Listening to spiritual teachings/lectures'
    ]
  },
  {
    id: 'journaling',
    label: 'Integration Journaling',
    icon: '✎',
    description: 'Documenting insights, stumbles, breakthroughs',
    examples: [
      'Morning pages or stream of consciousness',
      'Dream journaling upon waking',
      'Reflecting on synchronicities or insights'
    ]
  },
  {
    id: 'union',
    label: 'Sacred Union',
    icon: 'shatkona',
    description: 'Care for relationship, from thoughtful gestures to sex magic',
    examples: [
      'Quality time with deep presence',
      'Acts of service or thoughtful gestures',
      'Tantric or energetic intimacy practices'
    ]
  },
  {
    id: 'tending',
    label: 'Tending',
    icon: '🌱',
    description: 'Embodied service to others (animals, land, home, people)',
    examples: [
      'Gardening or caring for plants',
      'Preparing nourishing food for others',
      'Caring for animals or land'
    ]
  },
  {
    id: 'tarot',
    label: 'Tarot/Divination',
    icon: '🎴',
    description: 'Guidance, symbol work',
    examples: [
      'Daily single-card pull with reflection',
      'Three-card spread for guidance',
      'I Ching or rune consultation'
    ]
  },
  {
    id: 'ceremony',
    label: 'Ceremonial Work',
    icon: '🕯',
    description: 'Quarterly ceremonies, moon rituals, magical operations',
    examples: [
      'New/full moon ritual',
      'Candle magic or intention setting',
      'Altar work or offerings'
    ]
  }
]

function DailyLog() {
  const [todayLog, setTodayLog] = useState(null)
  const [practices, setPractices] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTip, setActiveTip] = useState(null)
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(0)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [usedStoredToday, setUsedStoredToday] = useState(false)
  const [autoUsedNotification, setAutoUsedNotification] = useState(null)
  const [detailPractice, setDetailPractice] = useState(null)
  const [showExamples, setShowExamples] = useState(false)
  const [lastTap, setLastTap] = useState({ id: null, time: 0 })
  const [historyStats, setHistoryStats] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState(30)

  const today = getLocalDateString()
  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  useEffect(() => {
    async function init() {
      // Check for missed days and auto-use stored practices first
      const autoUseResult = await queries.checkAndAutoUseStoredPractice()
      if (autoUseResult.autoUsed) {
        setAutoUsedNotification(`Stored practice auto-used for ${new Date(autoUseResult.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to maintain your streak!`)
        // Clear notification after 5 seconds
        setTimeout(() => setAutoUsedNotification(null), 5000)
      }

      await loadTodayLog()
      await loadStats()
      await loadHistoryStats()
    }
    init()
  }, [])

  async function loadHistoryStats() {
    try {
      const allStats = await queries.getPracticeCompletionStats([7, 30, 60, 180, 360])
      setHistoryStats(allStats)
    } catch (error) {
      console.error('Error loading history stats:', error)
    }
  }

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

  async function loadStats() {
    try {
      const practiceStats = await queries.getPracticeStats()
      const currentStreak = await queries.getPracticeStreak()
      setStats(practiceStats)
      setStreak(currentStreak)

      // Check if stored practice was used today
      if (practiceStats.storedPracticeUses?.includes(today)) {
        setUsedStoredToday(true)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
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

  function handlePracticeTap(practiceId) {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300

    if (lastTap.id === practiceId && now - lastTap.time < DOUBLE_TAP_DELAY) {
      // Double tap detected - show detail modal
      const practice = PRACTICES.find(p => p.id === practiceId)
      setDetailPractice(practice)
      setShowExamples(false)
      setLastTap({ id: null, time: 0 })
    } else {
      // Single tap - toggle practice and record tap
      setLastTap({ id: practiceId, time: now })
      // Delay toggle to allow for double-tap detection
      setTimeout(() => {
        setLastTap(current => {
          if (current.id === practiceId && Date.now() - current.time >= DOUBLE_TAP_DELAY) {
            togglePractice(practiceId)
          }
          return current
        })
      }, DOUBLE_TAP_DELAY)
    }
  }

  function closeDetailModal() {
    setDetailPractice(null)
    setShowExamples(false)
  }

  // Calculate bonus points for current practice count
  function getTodayBonusPoints() {
    return queries.calculateBonusPoints(practices.length)
  }

  async function saveLog() {
    setSaving(true)
    try {
      const previousPracticeCount = todayLog?.practices?.length || 0
      const newPracticeCount = practices.length

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

      // Calculate bonus points difference and update stats
      const previousBonus = queries.calculateBonusPoints(previousPracticeCount)
      const newBonus = queries.calculateBonusPoints(newPracticeCount)
      const bonusDiff = newBonus - previousBonus

      if (bonusDiff !== 0 && stats) {
        const newTotalBonus = Math.max(0, stats.bonusPoints + bonusDiff)
        await queries.updatePracticeStats({ bonusPoints: newTotalBonus })
      }

      // Update longest streak if needed
      const currentStreak = await queries.getPracticeStreak()
      if (stats && currentStreak > stats.longestStreak) {
        await queries.updatePracticeStats({ longestStreak: currentStreak })
      }

      await loadStats()
    } catch (error) {
      console.error('Error saving log:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleUseStoredPractice() {
    if (!stats || stats.storedPractices <= 0 || practices.length > 0 || usedStoredToday) return

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

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  const todayBonusPoints = getTodayBonusPoints()
  const hasPracticedToday = practices.length > 0 || usedStoredToday
  const canUseStoredPractice = stats && stats.storedPractices > 0 && practices.length === 0 && !usedStoredToday

  return (
    <div className="daily-log">
      <div className="log-header">
        <h2>{displayDate}</h2>
        <p className="log-subtitle">Track your daily practices</p>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-value">{stats.bonusPoints}</span>
            <span className="stat-label">Bonus</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏦</span>
            <span className="stat-value">{stats.storedPractices}</span>
            <span className="stat-label">Stored</span>
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
          <p>Haven't practiced today? Use banked energy to maintain your streak.</p>
          <button onClick={handleUseStoredPractice} className="btn btn-secondary use-stored-btn">
            Use a Stored Practice
          </button>
        </div>
      )}

      {usedStoredToday && practices.length === 0 && (
        <div className="stored-practice-used">
          <span className="used-icon">✓</span>
          <span>Stored Practice used today - streak maintained!</span>
        </div>
      )}

      <section className="practices-section">
        <h3 className="section-title">Practices</h3>
        <div className="practices-grid">
          {PRACTICES.map(practice => (
            <div key={practice.id} className="practice-wrapper">
              <button
                onClick={() => handlePracticeTap(practice.id)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  handlePracticeLongPress(practice.id)
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
        <p className="practices-hint">Tap to toggle • Double-tap for details</p>
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

      {/* Today's Summary */}
      <section className="summary-section">
        <h3 className="section-title">Today's Progress</h3>
        <div className="progress-summary">
          <span className="progress-count">{practices.length}</span>
          <span className="progress-label">of {PRACTICES.length} practices</span>
        </div>

        {/* Bonus Points Today */}
        <div className="bonus-display">
          <div className="bonus-today">
            <span className="bonus-label">Bonus earned today:</span>
            <span className="bonus-value">+{todayBonusPoints} points</span>
          </div>
          <div className="bonus-scale">
            <span className={practices.length >= 2 ? 'bonus-milestone achieved' : 'bonus-milestone'}>2</span>
            <span className={practices.length >= 4 ? 'bonus-milestone achieved' : 'bonus-milestone'}>4</span>
            <span className={practices.length >= 6 ? 'bonus-milestone achieved' : 'bonus-milestone'}>6</span>
            <span className={practices.length >= 8 ? 'bonus-milestone achieved' : 'bonus-milestone'}>8</span>
            <span className={practices.length >= 10 ? 'bonus-milestone achieved' : 'bonus-milestone'}>10</span>
          </div>
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

      {/* Bonus Points Conversion */}
      {stats && stats.bonusPoints >= 10 && (
        <section className="conversion-section">
          <div className="conversion-card">
            <div className="conversion-info">
              <h4>Convert Bonus Points</h4>
              <p>You have enough points to bank more energy!</p>
            </div>
            <button
              onClick={() => setShowConvertModal(true)}
              className="btn btn-secondary convert-btn"
            >
              10 Points → 1 Stored Practice
            </button>
          </div>
        </section>
      )}

      {/* Practice History Stats */}
      <section className="history-section">
        <button
          className={`history-toggle ${showHistory ? 'history-toggle--active' : ''}`}
          onClick={() => setShowHistory(!showHistory)}
        >
          <span className="history-toggle-icon">{showHistory ? '▼' : '▶'}</span>
          <span>Practice History</span>
        </button>

        {showHistory && historyStats && (
          <div className="history-content">
            <div className="period-selector">
              {[7, 30, 60, 180, 360].map(days => (
                <button
                  key={days}
                  className={`period-btn ${selectedPeriod === days ? 'period-btn--active' : ''}`}
                  onClick={() => setSelectedPeriod(days)}
                >
                  {days}d
                </button>
              ))}
            </div>

            {historyStats[selectedPeriod] && (
              <>
                <div className="history-summary">
                  <div className="history-stat">
                    <span className="history-stat-value">
                      {historyStats[selectedPeriod].daysWithPractice}
                    </span>
                    <span className="history-stat-label">
                      of {selectedPeriod} days practiced
                    </span>
                  </div>
                  <div className="history-stat">
                    <span className="history-stat-value">
                      {Math.round((historyStats[selectedPeriod].daysWithPractice / selectedPeriod) * 100)}%
                    </span>
                    <span className="history-stat-label">
                      completion rate
                    </span>
                  </div>
                </div>

                <div className="practice-history-grid">
                  {PRACTICES.map(practice => {
                    const count = historyStats[selectedPeriod].practiceCounts[practice.id] || 0
                    const percentage = Math.round((count / selectedPeriod) * 100)
                    return (
                      <div key={practice.id} className="practice-history-item">
                        <div className="practice-history-header">
                          <span className="practice-history-icon">
                            {practice.icon === 'shatkona' ? <ShaktonaIcon size={16} /> : practice.icon}
                          </span>
                          <span className="practice-history-label">{practice.label}</span>
                        </div>
                        <div className="practice-history-bar">
                          <div
                            className="practice-history-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="practice-history-count">{count} days ({percentage}%)</span>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Stored Practices Info */}
      <section className="info-section">
        <div className="info-card">
          <h4>About Stored Practices</h4>
          <p>You've banked energy through consistent practice. Use what you built to protect your streak on rest days.</p>
          <ul className="info-list">
            <li>1 Stored Practice added on the 1st of each month</li>
            <li>Convert 10 bonus points into 1 additional Stored Practice</li>
            <li>Bonus points: +1 at 2, 4, 6, 8, and 10 practices per day</li>
          </ul>
          <p className="info-note">More uses for bonus points coming soon!</p>
        </div>
      </section>

      {/* Conversion Modal */}
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
              <button onClick={handleConvertToStored} className="btn btn-primary">
                Convert
              </button>
              <button onClick={() => setShowConvertModal(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Practice Detail Modal */}
      {detailPractice && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className={`practice-detail-modal ${showExamples ? 'practice-detail-modal--expanded' : ''}`} onClick={e => e.stopPropagation()}>
            <button className="detail-close" onClick={closeDetailModal} aria-label="Close">×</button>

            <div className="detail-header">
              <span className="detail-icon">
                {detailPractice.icon === 'shatkona' ? <ShaktonaIcon size={32} /> : detailPractice.icon}
              </span>
              <h3>{detailPractice.label}</h3>
            </div>

            <p className="detail-description">{detailPractice.description}</p>

            {!showExamples ? (
              <button
                className="examples-toggle"
                onClick={() => setShowExamples(true)}
              >
                View Examples →
              </button>
            ) : (
              <div className="examples-section">
                <h4>Examples</h4>
                <ul className="examples-list">
                  {detailPractice.examples.map((example, idx) => (
                    <li key={idx}>{example}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className={`btn ${practices.includes(detailPractice.id) ? 'btn-secondary' : 'btn-primary'} detail-toggle-btn`}
              onClick={() => {
                togglePractice(detailPractice.id)
              }}
            >
              {practices.includes(detailPractice.id) ? 'Remove from Today' : 'Add to Today'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyLog
