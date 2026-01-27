import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import ShaktonaIcon from '../components/ShaktonaIcon'
import './PracticeHistory.css'

const PRACTICES = [
  { id: 'bath', label: 'Ritual Bath', icon: '💧' },
  { id: 'meditation', label: 'Meditation', icon: '🧘' },
  { id: 'vessel', label: 'Vessel Work', icon: '⚱' },
  { id: 'breathwork', label: 'Breathwork', icon: '🌬' },
  { id: 'study', label: 'Study/Reading', icon: '📖' },
  { id: 'journaling', label: 'Journaling', icon: '✎' },
  { id: 'union', label: 'Sacred Union', icon: 'shatkona' },
  { id: 'tending', label: 'Tending', icon: '🌱' },
  { id: 'tarot', label: 'Tarot/Divination', icon: '🎴' },
  { id: 'ceremony', label: 'Ceremonial Work', icon: '🕯' }
]

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function PracticeHistory() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('history')
  const [allLogs, setAllLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  // History tab state
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [filterPractice, setFilterPractice] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Insights state
  const [showConvertModal, setShowConvertModal] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [])

  async function loadAllData() {
    try {
      const logs = await db.getAll('dailyLogs')
      const practiceStats = await queries.getPracticeStats()
      const currentStreak = await queries.getPracticeStreak()

      setAllLogs(logs || [])
      setStats(practiceStats)
      setStreak(currentStreak)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Computed data for insights
  const insights = useMemo(() => {
    if (allLogs.length === 0) return null

    // Count all practices
    const practiceCounts = {}
    const dayOfWeekCounts = {}
    const monthlyData = {}
    const comboCounts = {}
    let totalPractices = 0
    let totalBonusPoints = 0

    DAYS_OF_WEEK.forEach(day => { dayOfWeekCounts[day] = 0 })
    PRACTICES.forEach(p => { practiceCounts[p.id] = 0 })

    allLogs.forEach(log => {
      const practices = log.practices || []
      const entries = log.entries || []
      const uniquePractices = entries.length > 0
        ? [...new Set(entries.map(e => e.practiceId))]
        : practices

      if (uniquePractices.length === 0) return

      // Count practices
      uniquePractices.forEach(p => {
        practiceCounts[p] = (practiceCounts[p] || 0) + 1
        totalPractices++
      })

      // Day of week
      const date = new Date(log.date + 'T12:00:00')
      const dayName = DAYS_OF_WEEK[date.getDay()]
      dayOfWeekCounts[dayName]++

      // Monthly data
      const monthKey = log.date.slice(0, 7)
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { practices: 0, days: 0, bonus: 0 }
      }
      monthlyData[monthKey].practices += uniquePractices.length
      monthlyData[monthKey].days++
      monthlyData[monthKey].bonus += calculateBonus(uniquePractices.length)

      // Track combos (pairs of practices done together)
      if (uniquePractices.length >= 2) {
        for (let i = 0; i < uniquePractices.length; i++) {
          for (let j = i + 1; j < uniquePractices.length; j++) {
            const combo = [uniquePractices[i], uniquePractices[j]].sort().join('+')
            comboCounts[combo] = (comboCounts[combo] || 0) + 1
          }
        }
      }

      totalBonusPoints += calculateBonus(uniquePractices.length)
    })

    // Find most common day
    const mostCommonDay = Object.entries(dayOfWeekCounts)
      .sort((a, b) => b[1] - a[1])[0]

    // Find most common combo
    const topCombo = Object.entries(comboCounts)
      .sort((a, b) => b[1] - a[1])[0]

    // Sort practices by count
    const sortedPractices = Object.entries(practiceCounts)
      .map(([id, count]) => ({ id, count, ...PRACTICES.find(p => p.id === id) }))
      .sort((a, b) => b.count - a.count)

    // Current month stats
    const currentMonthKey = getLocalDateString().slice(0, 7)
    const thisMonth = monthlyData[currentMonthKey] || { practices: 0, days: 0, bonus: 0 }

    return {
      totalPractices,
      totalBonusPoints,
      practiceCounts: sortedPractices,
      mostCommonDay: mostCommonDay[1] > 0 ? mostCommonDay[0] : null,
      topCombo: topCombo ? {
        practices: topCombo[0].split('+'),
        count: topCombo[1]
      } : null,
      thisMonth,
      daysWithPractice: allLogs.filter(l =>
        (l.practices?.length > 0) || (l.entries?.length > 0)
      ).length
    }
  }, [allLogs])

  function calculateBonus(count) {
    if (count < 2) return 0
    return Math.min(Math.floor(count / 2), 5)
  }

  // Calendar data for current month view
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()

    // Create log lookup by date
    const logsByDate = {}
    allLogs.forEach(log => {
      logsByDate[log.date] = log
    })

    const days = []
    const todayStr = getLocalDateString()

    // Padding
    for (let i = 0; i < startPadding; i++) {
      days.push({ day: null })
    }

    // Days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const log = logsByDate[dateStr]

      let practices = []
      if (log) {
        if (log.entries?.length > 0) {
          practices = [...new Set(log.entries.map(e => e.practiceId))]
        } else if (log.practices?.length > 0) {
          practices = log.practices
        }
      }

      // Apply filter
      const matchesFilter = filterPractice === 'all' || practices.includes(filterPractice)

      days.push({
        day,
        date: dateStr,
        log,
        practices,
        isToday: dateStr === todayStr,
        hasPractices: practices.length > 0,
        matchesFilter
      })
    }

    return days
  }, [currentMonth, allLogs, filterPractice])

  // Selected day data
  const selectedDayData = useMemo(() => {
    if (!selectedDate) return null
    const log = allLogs.find(l => l.date === selectedDate)
    if (!log) return { date: selectedDate, entries: [], practices: [], notes: '' }

    let entries = log.entries || []
    let practices = log.practices || []

    // If old format, create pseudo-entries
    if (entries.length === 0 && practices.length > 0) {
      entries = practices.map((p, i) => ({
        id: `legacy-${i}`,
        practiceId: p,
        timestamp: log.createdAt || log.date + 'T12:00:00',
        notes: i === 0 ? (log.notes || '') : ''
      }))
    }

    const uniquePractices = [...new Set(entries.map(e => e.practiceId))]
    const bonus = calculateBonus(uniquePractices.length)

    return {
      date: selectedDate,
      entries,
      practices: uniquePractices,
      notes: log.notes || '',
      bonus
    }
  }, [selectedDate, allLogs])

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null

    const query = searchQuery.toLowerCase()
    return allLogs
      .filter(log => {
        // Search in notes
        if (log.notes?.toLowerCase().includes(query)) return true

        // Search in entry notes
        if (log.entries?.some(e => e.notes?.toLowerCase().includes(query))) return true

        // Search in practice names
        const practices = log.entries?.map(e => e.practiceId) || log.practices || []
        return practices.some(p => {
          const practice = PRACTICES.find(pr => pr.id === p)
          return practice?.label.toLowerCase().includes(query)
        })
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20)
  }, [searchQuery, allLogs])

  async function handleConvertToStored() {
    if (!stats || stats.bonusPoints < 10) return

    const success = await queries.convertBonusToStored()
    if (success) {
      await loadAllData()
      setShowConvertModal(false)
    }
  }

  function navigateMonth(direction) {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
    setSelectedDate(null)
  }

  function getPracticeInfo(practiceId) {
    return PRACTICES.find(p => p.id === practiceId) || { label: practiceId, icon: '?' }
  }

  function formatDate(dateStr) {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="practice-history">
      {/* Header */}
      <div className="ph-header">
        <button className="back-btn" onClick={() => navigate('/daily')}>
          ← Back to Daily
        </button>
        <h1>Practice History</h1>
      </div>

      {/* Tabs */}
      <div className="ph-tabs">
        <button
          className={`ph-tab ${activeTab === 'history' ? 'ph-tab--active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
        <button
          className={`ph-tab ${activeTab === 'insights' ? 'ph-tab--active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          Insights
        </button>
      </div>

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="ph-history">
          {/* Search */}
          <div className="ph-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes, practices..."
              className="input"
            />
          </div>

          {/* Search Results */}
          {searchResults && searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results ({searchResults.length})</h3>
              <div className="search-list">
                {searchResults.map(log => (
                  <button
                    key={log.date}
                    className="search-item"
                    onClick={() => {
                      setSelectedDate(log.date)
                      setSearchQuery('')
                    }}
                  >
                    <span className="search-date">
                      {new Date(log.date + 'T12:00:00').toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className="search-practices">
                      {(log.practices || []).length || (log.entries || []).length} practices
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="ph-filter">
            <label>Filter by practice:</label>
            <select
              value={filterPractice}
              onChange={(e) => setFilterPractice(e.target.value)}
              className="input"
            >
              <option value="all">All Practices</option>
              {PRACTICES.map(p => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Calendar Navigation */}
          <div className="ph-calendar-nav">
            <button onClick={() => navigateMonth(-1)} className="nav-btn">←</button>
            <h3>
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <button onClick={() => navigateMonth(1)} className="nav-btn">→</button>
          </div>

          {/* Calendar Grid */}
          <div className="ph-calendar">
            <div className="ph-weekdays">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="ph-weekday">{d}</div>
              ))}
            </div>
            <div className="ph-days">
              {calendarData.map((dayInfo, idx) => (
                <button
                  key={idx}
                  className={`ph-day ${!dayInfo.day ? 'ph-day--empty' : ''} ${dayInfo.isToday ? 'ph-day--today' : ''} ${dayInfo.hasPractices ? 'ph-day--has-practices' : ''} ${!dayInfo.matchesFilter && dayInfo.hasPractices ? 'ph-day--filtered' : ''} ${selectedDate === dayInfo.date ? 'ph-day--selected' : ''}`}
                  onClick={() => dayInfo.day && setSelectedDate(dayInfo.date)}
                  disabled={!dayInfo.day}
                >
                  {dayInfo.day && (
                    <>
                      <span className="ph-day-num">{dayInfo.day}</span>
                      {dayInfo.hasPractices && (
                        <span className="ph-day-count">{dayInfo.practices.length}</span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="ph-legend">
            <span className="legend-item">
              <span className="legend-dot legend-dot--practiced"></span>
              Practiced
            </span>
            <span className="legend-item">
              <span className="legend-dot legend-dot--today"></span>
              Today
            </span>
          </div>

          {/* Selected Day Detail */}
          {selectedDayData && (
            <div className="ph-day-detail">
              <h3>{formatDate(selectedDayData.date)}</h3>

              {selectedDayData.entries.length === 0 ? (
                <p className="no-data">No practices logged this day</p>
              ) : (
                <>
                  <div className="detail-practices">
                    {selectedDayData.entries.map((entry, idx) => {
                      const practice = getPracticeInfo(entry.practiceId)
                      return (
                        <div key={idx} className="detail-entry">
                          <span className="detail-icon">
                            {practice.icon === 'shatkona' ? <ShaktonaIcon size={16} /> : practice.icon}
                          </span>
                          <span className="detail-name">{practice.label}</span>
                          <span className="detail-time">
                            {new Date(entry.timestamp).toLocaleTimeString('en-US', {
                              hour: 'numeric', minute: '2-digit', hour12: true
                            })}
                          </span>
                          {entry.notes && (
                            <p className="detail-notes">{entry.notes}</p>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="detail-summary">
                    <span>{selectedDayData.practices.length} unique practices</span>
                    <span>+{selectedDayData.bonus} bonus points</span>
                  </div>
                </>
              )}

              <button
                className="btn btn-secondary detail-close-btn"
                onClick={() => setSelectedDate(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}

      {/* INSIGHTS TAB */}
      {activeTab === 'insights' && insights && (
        <div className="ph-insights">
          {/* Streak Section */}
          <section className="insight-card streak-card">
            <div className="streak-main">
              <div className="streak-current">
                <span className="streak-value">{streak}</span>
                <span className="streak-label">day streak</span>
              </div>
              <div className="streak-longest">
                <span className="streak-value">{stats?.longestStreak || 0}</span>
                <span className="streak-label">longest</span>
              </div>
            </div>
            <p className="streak-hint">
              {streak > 0
                ? `Keep going! You're on fire.`
                : `Start your streak by logging a practice today.`}
            </p>
          </section>

          {/* Points & Stored */}
          <section className="insight-card points-card">
            <div className="points-row">
              <div className="points-item">
                <span className="points-value">{stats?.bonusPoints || 0}</span>
                <span className="points-label">Bonus Points</span>
              </div>
              <div className="points-item">
                <span className="points-value">{stats?.storedPractices || 0}</span>
                <span className="points-label">Stored Practices</span>
              </div>
            </div>

            {stats && stats.bonusPoints >= 10 && (
              <button
                className="btn btn-primary convert-btn"
                onClick={() => setShowConvertModal(true)}
              >
                Convert 10 pts → 1 Stored
              </button>
            )}

            <p className="points-hint">
              Total bonus earned all-time: ~{insights.totalBonusPoints} points
            </p>
          </section>

          {/* Practice Frequency */}
          <section className="insight-card frequency-card">
            <h3>Practice Frequency</h3>
            <p className="frequency-total">{insights.daysWithPractice} days practiced total</p>

            <div className="frequency-list">
              {insights.practiceCounts.map(practice => {
                const maxCount = insights.practiceCounts[0]?.count || 1
                const percentage = Math.round((practice.count / maxCount) * 100)
                return (
                  <div key={practice.id} className="frequency-item">
                    <div className="frequency-header">
                      <span className="frequency-icon">
                        {practice.icon === 'shatkona' ? <ShaktonaIcon size={14} /> : practice.icon}
                      </span>
                      <span className="frequency-name">{practice.label}</span>
                      <span className="frequency-count">{practice.count}</span>
                    </div>
                    <div className="frequency-bar">
                      <div
                        className="frequency-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Patterns */}
          <section className="insight-card patterns-card">
            <h3>Patterns</h3>
            <div className="patterns-list">
              {insights.mostCommonDay && (
                <div className="pattern-item">
                  <span className="pattern-icon">📅</span>
                  <span>You practice most on <strong>{insights.mostCommonDay}s</strong></span>
                </div>
              )}

              {insights.topCombo && insights.topCombo.count >= 3 && (
                <div className="pattern-item">
                  <span className="pattern-icon">🔗</span>
                  <span>
                    Favorite combo: <strong>
                      {getPracticeInfo(insights.topCombo.practices[0]).label} + {getPracticeInfo(insights.topCombo.practices[1]).label}
                    </strong> ({insights.topCombo.count} times)
                  </span>
                </div>
              )}

              {insights.practiceCounts[0] && (
                <div className="pattern-item">
                  <span className="pattern-icon">⭐</span>
                  <span>
                    Most practiced: <strong>{insights.practiceCounts[0].label}</strong> ({insights.practiceCounts[0].count} times)
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* This Month */}
          <section className="insight-card month-card">
            <h3>This Month</h3>
            <div className="month-stats">
              <div className="month-stat">
                <span className="month-value">{insights.thisMonth.days}</span>
                <span className="month-label">days practiced</span>
              </div>
              <div className="month-stat">
                <span className="month-value">{insights.thisMonth.practices}</span>
                <span className="month-label">total practices</span>
              </div>
              <div className="month-stat">
                <span className="month-value">+{insights.thisMonth.bonus}</span>
                <span className="month-label">bonus points</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Empty state for insights */}
      {activeTab === 'insights' && !insights && (
        <div className="empty-insights">
          <p>No practice data yet.</p>
          <p>Start logging practices to see your insights!</p>
          <button className="btn btn-primary" onClick={() => navigate('/daily')}>
            Go to Daily Log
          </button>
        </div>
      )}

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="modal-overlay" onClick={() => setShowConvertModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Convert Bonus Points</h3>
            <p>Exchange 10 bonus points for 1 Stored Practice?</p>
            <div className="modal-stats">
              <div>Current Bonus: {stats?.bonusPoints} points</div>
              <div>Current Stored: {stats?.storedPractices}</div>
            </div>
            <div className="modal-actions">
              <button onClick={handleConvertToStored} className="btn btn-primary">Convert</button>
              <button onClick={() => setShowConvertModal(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PracticeHistory
