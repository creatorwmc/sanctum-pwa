import { useState, useEffect } from 'react'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import { getMonthLunarData, getDayLunarData } from '../utils/lunar'
import { CALENDAR_TYPES, getHolidaysForMonth, getHolidaysForDate, getCalendarColor } from '../data/religiousCalendars'
import './Calendar.css'

const CEREMONY_TYPES = [
  { id: 'quarterly', label: 'Quarterly Ceremony', color: '#d4a259' },
  { id: 'moon', label: 'Moon Phase', color: '#a8b4c4' },
  { id: 'milestone', label: 'Personal Milestone', color: '#8b9b7a' },
  { id: 'holiday', label: 'Holiday/Festival', color: '#c9a227' },
  { id: 'other', label: 'Other', color: '#8b7bb5' }
]

// Practice types (mirrors DailyLog)
const PRACTICE_TYPES = {
  bath: { label: 'Ritual Bath', icon: '💧' },
  meditation: { label: 'Meditation', icon: '🧘' },
  vessel: { label: 'Vessel Work', icon: '⚱' },
  breathwork: { label: 'Breathwork', icon: '🌬' },
  study: { label: 'Study/Reading', icon: '📖' },
  journaling: { label: 'Integration Journaling', icon: '✎' },
  union: { label: 'Sacred Union', icon: '✡' },
  tending: { label: 'Tending', icon: '🌱' },
  tarot: { label: 'Tarot/Divination', icon: '🎴' },
  ceremony: { label: 'Ceremonial Work', icon: '🕯' }
}

const CALENDAR_PREFS_KEY = 'sanctum-calendar-prefs'
const DEFAULT_ENABLED = ['moon', 'moonSign']

// Holiday detail card with expandable traditions
function HolidayDetailCard({ holiday }) {
  const [showTraditions, setShowTraditions] = useState(false)

  return (
    <div className="holiday-item-detailed">
      <div className="holiday-header">
        <div className="holiday-color" style={{ backgroundColor: getCalendarColor(holiday.type) }} />
        <span className="holiday-icon">
          {CALENDAR_TYPES.find(c => c.id === holiday.type)?.icon}
        </span>
        <span className="holiday-name">{holiday.name}</span>
      </div>
      {holiday.description && (
        <p className="holiday-description">{holiday.description}</p>
      )}
      {holiday.dateRule && (
        <p className="holiday-date-rule">{holiday.dateRule}</p>
      )}
      {holiday.traditions && holiday.traditions.length > 0 && (
        <div className="holiday-traditions-section">
          <button
            className={`traditions-toggle ${showTraditions ? 'traditions-toggle--active' : ''}`}
            onClick={() => setShowTraditions(!showTraditions)}
          >
            <span className="traditions-toggle-icon">{showTraditions ? '▼' : '▶'}</span>
            <span>Traditions</span>
            <span className="traditions-count">({holiday.traditions.length})</span>
          </button>
          {showTraditions && (
            <div className="traditions-list">
              {holiday.traditions.map((tradition, idx) => (
                <span key={idx} className="tradition-tag">{tradition}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [ceremonies, setCeremonies] = useState([])
  const [milestones, setMilestones] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDayDetail, setShowDayDetail] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [lunarData, setLunarData] = useState({})
  const [religiousHolidays, setReligiousHolidays] = useState([])
  const [practiceLogsByDate, setPracticeLogsByDate] = useState({})

  // Calendar preferences
  const [enabledCalendars, setEnabledCalendars] = useState(() => {
    try {
      const saved = localStorage.getItem(CALENDAR_PREFS_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_ENABLED
    } catch {
      return DEFAULT_ENABLED
    }
  })

  // Form state
  const [title, setTitle] = useState('')
  const [type, setType] = useState('quarterly')
  const [notes, setNotes] = useState('')
  const [editCeremony, setEditCeremony] = useState(null)
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    loadCeremonies()
    loadMilestones()
    loadLunarData()
    loadReligiousHolidays()
    loadPracticeLogs()
  }, [currentDate, enabledCalendars])

  async function loadCeremonies() {
    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const monthCeremonies = await queries.getCeremoniesForMonth(year, month)
      setCeremonies(monthCeremonies)
    } catch (error) {
      console.error('Error loading ceremonies:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadMilestones() {
    try {
      const allMilestones = await db.getAll('milestones')
      setMilestones(allMilestones || [])
    } catch (error) {
      // Milestones store might not exist yet
      setMilestones([])
    }
  }

  function loadLunarData() {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const { data } = getMonthLunarData(year, month)
    setLunarData(data)
  }

  function loadReligiousHolidays() {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const religiousTypes = enabledCalendars.filter(c => !['moon', 'moonSign', 'dailyPractices'].includes(c))
    const holidays = getHolidaysForMonth(year, month, religiousTypes)
    setReligiousHolidays(holidays)
  }

  async function loadPracticeLogs() {
    if (!enabledCalendars.includes('dailyPractices')) {
      setPracticeLogsByDate({})
      return
    }

    try {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()
      const logs = await queries.getPracticeLogsForMonth(year, month)

      // Convert to map by date
      const logMap = {}
      logs.forEach(log => {
        logMap[log.date] = log
      })
      setPracticeLogsByDate(logMap)
    } catch (error) {
      console.error('Error loading practice logs:', error)
    }
  }

  function toggleCalendar(calendarId) {
    setEnabledCalendars(prev => {
      const newEnabled = prev.includes(calendarId)
        ? prev.filter(c => c !== calendarId)
        : [...prev, calendarId]
      localStorage.setItem(CALENDAR_PREFS_KEY, JSON.stringify(newEnabled))
      return newEnabled
    })
  }

  function generateCalendarDays() {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()

    const days = []

    // Add padding for days before month starts
    for (let i = 0; i < startPadding; i++) {
      days.push({ day: null, date: null })
    }

    // Add days of the month
    const todayStr = getLocalDateString()
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateStr = getLocalDateString(date)
      const dayCeremonies = ceremonies.filter(c => c.date === dateStr)

      // Check for annual milestones
      const monthDay = dateStr.slice(5) // MM-DD
      const dayMilestones = milestones.filter(m => {
        if (m.annual) {
          return m.date.slice(5) === monthDay
        }
        return m.date === dateStr
      })

      // Get religious holidays for this day
      const dayHolidays = religiousHolidays.filter(h => h.day === day)

      // Get practice log for this day
      const practiceLog = enabledCalendars.includes('dailyPractices') ? practiceLogsByDate[dateStr] : null

      days.push({
        day,
        date: dateStr,
        ceremonies: dayCeremonies,
        milestones: dayMilestones,
        holidays: dayHolidays,
        practiceLog,
        lunar: enabledCalendars.includes('moon') ? (lunarData[dateStr] || null) : null,
        showMoonSign: enabledCalendars.includes('moonSign'),
        isToday: dateStr === todayStr
      })
    }

    return days
  }

  function navigateMonth(direction) {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  function handleDayClick(dateStr) {
    setSelectedDate(dateStr)
    setShowDayDetail(true)
  }

  function openAddForm() {
    setShowDayDetail(false)
    setShowForm(true)
  }

  async function saveCeremony() {
    if (!title.trim() || !selectedDate) return

    try {
      const ceremonyData = {
        date: selectedDate,
        title: title.trim(),
        type,
        notes: notes.trim()
      }

      if (type === 'milestone' && isAnnual) {
        // Save as milestone instead
        await saveMilestone(ceremonyData)
      } else if (editCeremony) {
        await db.update('ceremonies', { ...editCeremony, ...ceremonyData })
      } else {
        await db.add('ceremonies', ceremonyData)
      }

      await loadCeremonies()
      await loadMilestones()
      resetForm()
    } catch (error) {
      console.error('Error saving ceremony:', error)
    }
  }

  async function saveMilestone(data) {
    try {
      const milestoneData = {
        date: data.date,
        title: data.title,
        notes: data.notes,
        annual: true,
        createdAt: new Date().toISOString()
      }
      await db.add('milestones', milestoneData)
    } catch (error) {
      console.error('Error saving milestone:', error)
    }
  }

  async function deleteCeremony(id) {
    if (confirm('Delete this ceremony?')) {
      try {
        await db.delete('ceremonies', id)
        await loadCeremonies()
      } catch (error) {
        console.error('Error deleting ceremony:', error)
      }
    }
  }

  async function deleteMilestone(id) {
    if (confirm('Delete this milestone?')) {
      try {
        await db.delete('milestones', id)
        await loadMilestones()
      } catch (error) {
        console.error('Error deleting milestone:', error)
      }
    }
  }

  function startEdit(ceremony) {
    setShowDayDetail(false)
    setEditCeremony(ceremony)
    setSelectedDate(ceremony.date)
    setTitle(ceremony.title)
    setType(ceremony.type)
    setNotes(ceremony.notes || '')
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setShowDayDetail(false)
    setSelectedDate(null)
    setEditCeremony(null)
    setTitle('')
    setType('quarterly')
    setNotes('')
    setIsAnnual(false)
  }

  function getTypeColor(typeId) {
    return CEREMONY_TYPES.find(t => t.id === typeId)?.color || '#6b7280'
  }

  // Get selected day data
  function getSelectedDayData() {
    if (!selectedDate) return null
    const date = new Date(selectedDate + 'T12:00:00')
    return getDayLunarData(date)
  }

  // Get ceremonies, milestones, holidays, and practices for selected date
  function getSelectedDayEvents() {
    if (!selectedDate) return { ceremonies: [], milestones: [], holidays: [], practices: [] }
    const monthDay = selectedDate.slice(5)
    const [year, month, day] = selectedDate.split('-').map(Number)
    const religiousTypes = enabledCalendars.filter(c => !['moon', 'moonSign', 'dailyPractices'].includes(c))
    const practiceLog = practiceLogsByDate[selectedDate]
    return {
      ceremonies: ceremonies.filter(c => c.date === selectedDate),
      milestones: milestones.filter(m => m.annual ? m.date.slice(5) === monthDay : m.date === selectedDate),
      holidays: getHolidaysForDate(year, month - 1, day, religiousTypes),
      practices: practiceLog?.practices || []
    }
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const days = generateCalendarDays()
  const selectedDayData = getSelectedDayData()
  const selectedDayEvents = getSelectedDayEvents()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Day Detail Modal
  if (showDayDetail && selectedDate) {
    return (
      <div className="calendar-page">
        <div className="day-detail">
          <div className="day-detail-header">
            <button className="back-btn" onClick={() => setShowDayDetail(false)}>← Back</button>
            <h2 className="day-detail-date">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
          </div>

          {selectedDayData && (
            <div className="lunar-detail-card">
              <div className="lunar-main">
                <span className="lunar-phase-large">{selectedDayData.phaseIcon}</span>
                <div className="lunar-info">
                  <h3 className="lunar-phase-name">{selectedDayData.phaseName}</h3>
                  <p className="lunar-illumination">{selectedDayData.illumination}% illuminated</p>
                  <p className="lunar-waxwane">{selectedDayData.isWaxing ? 'Waxing' : 'Waning'}</p>
                </div>
              </div>

              <div className="lunar-sign-detail">
                <span className="zodiac-symbol-large">{selectedDayData.moonSign.symbol}</span>
                <div className="zodiac-info">
                  <h4>Moon in {selectedDayData.moonSign.name}</h4>
                  <p className="zodiac-element">{selectedDayData.moonSign.element} sign, {selectedDayData.moonSign.quality}</p>
                  <p className="zodiac-description">{selectedDayData.moonSign.description}</p>
                </div>
              </div>

              {selectedDayData.eclipse && (
                <div className="special-event special-event--eclipse">
                  <span className="special-icon">{selectedDayData.eclipse.type === 'solar' ? '🌑' : '🌒'}</span>
                  <span>{selectedDayData.eclipse.name}</span>
                </div>
              )}

              {selectedDayData.blueMoon && (
                <div className="special-event special-event--blue">
                  <span className="special-icon">🌕</span>
                  <span>Blue Moon (rare!)</span>
                </div>
              )}

              {selectedDayData.seasonalEvent && (
                <div className="special-event special-event--season">
                  <span className="special-icon">
                    {selectedDayData.seasonalEvent.type === 'solstice' ? '☀' : '🌗'}
                  </span>
                  <div>
                    <span className="event-name">{selectedDayData.seasonalEvent.name}</span>
                    <span className="event-ceremony">{selectedDayData.seasonalEvent.ceremony}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Religious Holidays */}
          {selectedDayEvents.holidays.length > 0 && (
            <div className="day-holidays-section">
              <h3 className="section-title">Religious Observances</h3>
              <div className="holiday-list">
                {selectedDayEvents.holidays.map((holiday, idx) => (
                  <HolidayDetailCard key={idx} holiday={holiday} />
                ))}
              </div>
            </div>
          )}

          {/* Daily Practices */}
          {enabledCalendars.includes('dailyPractices') && selectedDayEvents.practices.length > 0 && (
            <div className="day-practices-section">
              <h3 className="section-title">Daily Practices Completed</h3>
              <div className="practices-list">
                {selectedDayEvents.practices.map(practiceId => {
                  const practice = PRACTICE_TYPES[practiceId]
                  return practice ? (
                    <span key={practiceId} className="practice-chip">
                      <span className="practice-chip-icon">{practice.icon}</span>
                      <span className="practice-chip-label">{practice.label}</span>
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}

          {/* Events for this day */}
          <div className="day-events-section">
            <div className="section-header">
              <h3 className="section-title">Your Events</h3>
              <button className="add-event-btn" onClick={openAddForm}>+ Add</button>
            </div>

            {selectedDayEvents.ceremonies.length === 0 && selectedDayEvents.milestones.length === 0 ? (
              <p className="no-events">No personal events for this day</p>
            ) : (
              <div className="event-list">
                {selectedDayEvents.ceremonies.map(ceremony => (
                  <div key={ceremony.id} className="event-item" onClick={() => startEdit(ceremony)}>
                    <div className="event-color" style={{ backgroundColor: getTypeColor(ceremony.type) }} />
                    <div className="event-info">
                      <span className="event-title">{ceremony.title}</span>
                      {ceremony.notes && <span className="event-notes">{ceremony.notes}</span>}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteCeremony(ceremony.id) }}
                      className="event-delete"
                    >×</button>
                  </div>
                ))}
                {selectedDayEvents.milestones.map(milestone => (
                  <div key={milestone.id} className="event-item event-item--milestone">
                    <div className="event-color" style={{ backgroundColor: '#8b9b7a' }} />
                    <div className="event-info">
                      <span className="event-title">{milestone.title}</span>
                      <span className="event-annual">Annual milestone</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMilestone(milestone.id) }}
                      className="event-delete"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Add/Edit Form
  if (showForm) {
    return (
      <div className="calendar-page">
        <div className="ceremony-form">
          <h2 className="form-title">
            {editCeremony ? 'Edit Event' : 'Add Event'}
          </h2>
          <p className="form-date">
            {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </p>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event name"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input"
            >
              {CEREMONY_TYPES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {type === 'milestone' && (
            <label className="annual-toggle">
              <input
                type="checkbox"
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
              />
              <span>Repeat annually (sobriety dates, tattoo dates, etc.)</span>
            </label>
          )}

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Details, preparations, intentions..."
              className="input"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              onClick={saveCeremony}
              disabled={!title.trim()}
              className="btn btn-primary"
            >
              {editCeremony ? 'Update' : 'Save'}
            </button>
            <button onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Settings Panel
  if (showSettings) {
    return (
      <div className="calendar-page">
        <div className="calendar-settings">
          <div className="settings-header">
            <button className="back-btn" onClick={() => setShowSettings(false)}>← Back</button>
            <h2>Calendar Settings</h2>
          </div>

          <p className="settings-hint">Choose which calendars to display</p>

          <div className="calendar-toggles">
            {CALENDAR_TYPES.map(cal => (
              <label key={cal.id} className="calendar-toggle">
                <input
                  type="checkbox"
                  checked={enabledCalendars.includes(cal.id)}
                  onChange={() => toggleCalendar(cal.id)}
                />
                <span className="toggle-icon" style={{ color: cal.color }}>{cal.icon}</span>
                <span className="toggle-name">{cal.name}</span>
                <span
                  className="toggle-indicator"
                  style={{ backgroundColor: enabledCalendars.includes(cal.id) ? cal.color : 'transparent' }}
                />
              </label>
            ))}
          </div>

          <div className="settings-note">
            <p>Religious holiday dates are approximate. Many traditions use lunar calendars that vary year to year.</p>
          </div>
        </div>
      </div>
    )
  }

  // Main Calendar View
  return (
    <div className="calendar-page">
      <div className="calendar-nav">
        <button onClick={() => navigateMonth(-1)} className="nav-btn">←</button>
        <h2 className="month-title">{monthName}</h2>
        <button onClick={() => navigateMonth(1)} className="nav-btn">→</button>
        <button onClick={() => setShowSettings(true)} className="settings-btn" title="Calendar Settings">⚙</button>
      </div>

      <div className="calendar-grid">
        <div className="weekday-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="weekday">{d}</div>
          ))}
        </div>

        <div className="days-grid">
          {days.map((dayInfo, idx) => (
            <div
              key={idx}
              className={`day-cell ${!dayInfo.day ? 'day-cell--empty' : ''} ${dayInfo.isToday ? 'day-cell--today' : ''} ${dayInfo.lunar?.majorPhase ? 'day-cell--major-phase' : ''} ${dayInfo.lunar?.eclipse ? 'day-cell--eclipse' : ''} ${dayInfo.lunar?.seasonalEvent ? 'day-cell--seasonal' : ''}`}
              onClick={() => dayInfo.day && handleDayClick(dayInfo.date)}
            >
              {dayInfo.day && (
                <>
                  <div className="day-top">
                    <span className="day-number">{dayInfo.day}</span>
                    {dayInfo.lunar && (
                      <span className="day-moon">{dayInfo.lunar.phaseIcon}</span>
                    )}
                  </div>

                  {dayInfo.showMoonSign && dayInfo.lunar?.moonSign && (
                    <span className="day-zodiac" title={`Moon in ${dayInfo.lunar.moonSign.name}`}>
                      {dayInfo.lunar.moonSign.symbol}
                    </span>
                  )}

                  <div className="day-indicators">
                    {dayInfo.practiceLog?.practices?.length > 0 && (
                      <span
                        className="indicator indicator--practice"
                        title={`${dayInfo.practiceLog.practices.length} practices`}
                      >
                        {dayInfo.practiceLog.practices.length}
                      </span>
                    )}
                    {dayInfo.lunar?.eclipse && (
                      <span className="indicator indicator--eclipse" title={dayInfo.lunar.eclipse.name}>E</span>
                    )}
                    {dayInfo.lunar?.blueMoon && (
                      <span className="indicator indicator--blue" title="Blue Moon">B</span>
                    )}
                    {dayInfo.lunar?.seasonalEvent && (
                      <span className="indicator indicator--season" title={dayInfo.lunar.seasonalEvent.name}>S</span>
                    )}
                    {dayInfo.holidays?.map((h, i) => (
                      <span
                        key={i}
                        className="indicator indicator--holiday"
                        style={{ backgroundColor: getCalendarColor(h.type) }}
                        title={h.name}
                      >
                        {CALENDAR_TYPES.find(c => c.id === h.type)?.icon?.charAt(0) || 'H'}
                      </span>
                    ))}
                    {dayInfo.ceremonies?.map(c => (
                      <span
                        key={c.id}
                        className="ceremony-dot"
                        style={{ backgroundColor: getTypeColor(c.type) }}
                        title={c.title}
                      />
                    ))}
                    {dayInfo.milestones?.map(m => (
                      <span
                        key={m.id}
                        className="ceremony-dot"
                        style={{ backgroundColor: '#8b9b7a' }}
                        title={m.title}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lunar Legend */}
      <div className="lunar-legend">
        <div className="legend-section">
          <span className="legend-title">Moon Phases</span>
          <div className="legend-items">
            <span title="New Moon">🌑</span>
            <span title="Waxing">🌒🌓🌔</span>
            <span title="Full Moon">🌕</span>
            <span title="Waning">🌖🌗🌘</span>
          </div>
        </div>
        <div className="legend-section">
          <span className="legend-title">Special</span>
          <div className="legend-items">
            <span className="indicator indicator--eclipse" title="Eclipse">E</span>
            <span className="indicator indicator--blue" title="Blue Moon">B</span>
            <span className="indicator indicator--season" title="Equinox/Solstice">S</span>
          </div>
        </div>
      </div>

      <div className="upcoming-section">
        <h3 className="section-title">This Month</h3>
        {ceremonies.length === 0 ? (
          <p className="no-ceremonies">No ceremonies scheduled</p>
        ) : (
          <div className="ceremony-list">
            {ceremonies
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(ceremony => (
                <div key={ceremony.id} className="ceremony-item" onClick={() => startEdit(ceremony)}>
                  <div
                    className="ceremony-color"
                    style={{ backgroundColor: getTypeColor(ceremony.type) }}
                  />
                  <div className="ceremony-info">
                    <span className="ceremony-title">{ceremony.title}</span>
                    <span className="ceremony-date">
                      {new Date(ceremony.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteCeremony(ceremony.id)
                    }}
                    className="ceremony-delete"
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="type-legend">
        {CEREMONY_TYPES.map(t => (
          <div key={t.id} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: t.color }} />
            <span className="legend-label">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Calendar
