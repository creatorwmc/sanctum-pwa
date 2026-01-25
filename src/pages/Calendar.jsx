import { useState, useEffect } from 'react'
import { db, queries } from '../db'
import './Calendar.css'

const CEREMONY_TYPES = [
  { id: 'quarterly', label: 'Quarterly Ceremony', color: '#d4a259' },
  { id: 'moon', label: 'Moon Phase', color: '#a8b4c4' },
  { id: 'milestone', label: 'Personal Milestone', color: '#8b9b7a' },
  { id: 'holiday', label: 'Holiday/Festival', color: '#c9a227' },
  { id: 'other', label: 'Other', color: '#8b7bb5' }
]

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [ceremonies, setCeremonies] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState('')
  const [type, setType] = useState('quarterly')
  const [notes, setNotes] = useState('')
  const [editCeremony, setEditCeremony] = useState(null)

  useEffect(() => {
    loadCeremonies()
  }, [currentDate])

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
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateStr = date.toISOString().split('T')[0]
      const dayCeremonies = ceremonies.filter(c => c.date === dateStr)

      days.push({
        day,
        date: dateStr,
        ceremonies: dayCeremonies,
        isToday: dateStr === new Date().toISOString().split('T')[0]
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

      if (editCeremony) {
        await db.update('ceremonies', { ...editCeremony, ...ceremonyData })
      } else {
        await db.add('ceremonies', ceremonyData)
      }

      await loadCeremonies()
      resetForm()
    } catch (error) {
      console.error('Error saving ceremony:', error)
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

  function startEdit(ceremony) {
    setEditCeremony(ceremony)
    setSelectedDate(ceremony.date)
    setTitle(ceremony.title)
    setType(ceremony.type)
    setNotes(ceremony.notes || '')
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setSelectedDate(null)
    setEditCeremony(null)
    setTitle('')
    setType('quarterly')
    setNotes('')
  }

  function getTypeColor(typeId) {
    return CEREMONY_TYPES.find(t => t.id === typeId)?.color || '#6b7280'
  }

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const days = generateCalendarDays()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="calendar-page">
      {!showForm ? (
        <>
          <div className="calendar-nav">
            <button onClick={() => navigateMonth(-1)} className="nav-btn">←</button>
            <h2 className="month-title">{monthName}</h2>
            <button onClick={() => navigateMonth(1)} className="nav-btn">→</button>
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
                  className={`day-cell ${!dayInfo.day ? 'day-cell--empty' : ''} ${dayInfo.isToday ? 'day-cell--today' : ''}`}
                  onClick={() => dayInfo.day && handleDayClick(dayInfo.date)}
                >
                  {dayInfo.day && (
                    <>
                      <span className="day-number">{dayInfo.day}</span>
                      {dayInfo.ceremonies?.length > 0 && (
                        <div className="day-indicators">
                          {dayInfo.ceremonies.map(c => (
                            <span
                              key={c.id}
                              className="ceremony-dot"
                              style={{ backgroundColor: getTypeColor(c.type) }}
                              title={c.title}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
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
        </>
      ) : (
        <div className="ceremony-form">
          <h2 className="form-title">
            {editCeremony ? 'Edit Ceremony' : 'Add Ceremony'}
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
              placeholder="Ceremony name"
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
      )}
    </div>
  )
}

export default Calendar
