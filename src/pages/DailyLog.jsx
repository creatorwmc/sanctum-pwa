import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import { getTraditionSettings, saveTraditionSettings, APPLY_LEVELS, shouldApplyBranding } from '../components/TraditionSettings'
import { AVAILABLE_TRADITIONS, hasSubgroups, getSubgroups, getSubgroup, translateTerm } from '../data/traditions'
import { getStreakSettings, hasBeenAskedAboutStreaks } from '../utils/streakSettings'
import StreakOptInModal from '../components/StreakOptInModal'
import ShaktonaIcon from '../components/ShaktonaIcon'
import './DailyLog.css'


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

function DailyLog() {
  const navigate = useNavigate()
  const [practices, setPractices] = useState([])
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

  // Tradition
  const [traditionSettings, setTraditionSettings] = useState(getTraditionSettings)
  const selectedTradition = AVAILABLE_TRADITIONS.find(t => t.id === traditionSettings.traditionId)
  const selectedSubgroup = traditionSettings.subgroupId ? getSubgroup(traditionSettings.traditionId, traditionSettings.subgroupId) : null
  const lastTraditionClickRef = useRef(0)

  // Tradition picker modal
  const [showTraditionPicker, setShowTraditionPicker] = useState(false)
  const [expandedSubgroups, setExpandedSubgroups] = useState(null)

  // Practice detail modal
  const [detailPractice, setDetailPractice] = useState(null)

  // Streak settings
  const [streakEnabled, setStreakEnabled] = useState(getStreakSettings().enabled)
  const [showStreakModal, setShowStreakModal] = useState(false)

  const today = getLocalDateString()
  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  useEffect(() => {
    async function init() {
      try {
        // Load practices first
        const enabledPractices = await queries.getEnabledPractices()
        setPractices(enabledPractices)

        const autoUseResult = await queries.checkAndAutoUseStoredPractice()
        if (autoUseResult.autoUsed) {
          setAutoUsedNotification(`Stored practice auto-used for ${new Date(autoUseResult.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} to maintain your streak!`)
          setTimeout(() => setAutoUsedNotification(null), 5000)
        }

        await loadTodayLog()
        await loadStats()
      } catch (error) {
        console.error('Error initializing DailyLog:', error)
        setLoading(false)
      }
    }
    init()

    // Listen for streak settings changes
    function handleStreakChange(e) {
      setStreakEnabled(e.detail.enabled)
    }
    window.addEventListener('streak-settings-changed', handleStreakChange)
    return () => window.removeEventListener('streak-settings-changed', handleStreakChange)
  }, [])

  // Show streak opt-in modal for users who haven't been asked
  useEffect(() => {
    if (!loading && !hasBeenAskedAboutStreaks()) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setShowStreakModal(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [loading])

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
    return practices.find(p => p.id === practiceId) || { label: practiceId, icon: '?' }
  }

  function handleTraditionClick() {
    const now = Date.now()
    const timeSinceLastClick = now - lastTraditionClickRef.current

    if (timeSinceLastClick < 300) {
      // Double-click: navigate to settings for full tradition settings
      navigate('/settings')
    } else {
      // Single click: open tradition picker
      setShowTraditionPicker(true)
    }

    lastTraditionClickRef.current = now
  }

  function handleSelectTradition(traditionId) {
    // If this tradition has subgroups, expand/collapse them
    if (hasSubgroups(traditionId)) {
      setExpandedSubgroups(expandedSubgroups === traditionId ? null : traditionId)
      return
    }

    const tradition = AVAILABLE_TRADITIONS.find(t => t.id === traditionId)
    const newSettings = {
      ...traditionSettings,
      traditionId,
      subgroupId: null,
      applyLevel: traditionSettings.applyLevel || (tradition?.hasPreset ? 'full' : 'identity'),
      customName: ''
    }
    setTraditionSettings(newSettings)
    saveTraditionSettings(newSettings)
    setShowTraditionPicker(false)
    setExpandedSubgroups(null)
  }

  function handleSelectSubgroup(traditionId, subgroupId) {
    const subgroup = getSubgroup(traditionId, subgroupId)
    const newSettings = {
      ...traditionSettings,
      traditionId,
      subgroupId,
      applyLevel: traditionSettings.applyLevel || (subgroup?.hasPreset ? 'full' : 'identity'),
      customName: ''
    }
    setTraditionSettings(newSettings)
    saveTraditionSettings(newSettings)
    setShowTraditionPicker(false)
    setExpandedSubgroups(null)
  }

  function handleSelectGenericTradition(traditionId) {
    const tradition = AVAILABLE_TRADITIONS.find(t => t.id === traditionId)
    const newSettings = {
      ...traditionSettings,
      traditionId,
      subgroupId: null,
      applyLevel: traditionSettings.applyLevel || (tradition?.hasPreset ? 'full' : 'identity'),
      customName: ''
    }
    setTraditionSettings(newSettings)
    saveTraditionSettings(newSettings)
    setShowTraditionPicker(false)
    setExpandedSubgroups(null)
  }

  function handleClearTradition() {
    const newSettings = {
      applyLevel: null,
      traditionId: null,
      subgroupId: null,
      customName: ''
    }
    setTraditionSettings(newSettings)
    saveTraditionSettings(newSettings)
    setShowTraditionPicker(false)
    setExpandedSubgroups(null)
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
        <p className="log-subtitle">Track your daily {getTranslatedTerm('Practices').toLowerCase()}</p>
        <Link to="/practice-history" className="btn btn-secondary history-link">
          View Practice History
        </Link>
      </div>

      {/* 2. STATS SECTION */}
      {stats && (
        <div className="stats-bar">
          {streakEnabled === true && (
            <div className="stat-item">
              <span className="stat-value">{streak}</span>
              <span className="stat-label">day streak</span>
            </div>
          )}
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
        <div className="section-header">
          <h3 className="section-title">{getTranslatedTerm('Log Practice')}</h3>
          <div className="section-header-actions">
            <button
              onClick={handleTraditionClick}
              className="tradition-btn-small"
              title={selectedTradition ? "Click to change, double-click for settings" : "Select a tradition"}
            >
              {selectedTradition
                ? `${selectedSubgroup?.icon || selectedTradition.icon} ${selectedSubgroup ? selectedSubgroup.name : selectedTradition.name}`
                : '✨ Select Tradition'}
            </button>
            <Link to="/practices" className="practices-settings-btn" title="Manage Practices">
              ⚙
            </Link>
          </div>
        </div>
        <div className="practices-grid">
          {practices.map(practice => (
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
            {saving ? 'Logging...' : `Log ${selectedPractices.length > 0 ? `(${selectedPractices.length})` : getTranslatedTerm('Practice')}`}
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
                {practices.map(p => (
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

      {/* Tradition Picker Modal */}
      {showTraditionPicker && (
        <div className="modal-overlay" onClick={() => setShowTraditionPicker(false)}>
          <div className="modal-content tradition-picker-modal" onClick={e => e.stopPropagation()}>
            <h3>Choose Tradition</h3>
            <div className="tradition-picker-grid">
              {AVAILABLE_TRADITIONS.map(tradition => (
                <div key={tradition.id} className="tradition-picker-wrapper">
                  <button
                    className={`tradition-picker-option ${traditionSettings.traditionId === tradition.id && !traditionSettings.subgroupId ? 'tradition-picker-option--selected' : ''} ${hasSubgroups(tradition.id) ? 'tradition-picker-option--expandable' : ''} ${expandedSubgroups === tradition.id ? 'tradition-picker-option--expanded' : ''}`}
                    onClick={() => handleSelectTradition(tradition.id)}
                    style={{ '--tradition-color': tradition.color }}
                  >
                    <span className="tradition-picker-icon">{tradition.icon}</span>
                    <span className="tradition-picker-name">{tradition.name}</span>
                    {hasSubgroups(tradition.id) && (
                      <span className="tradition-picker-expand">{expandedSubgroups === tradition.id ? '▼' : '▶'}</span>
                    )}
                  </button>

                  {/* Subgroups */}
                  {expandedSubgroups === tradition.id && (
                    <div className="tradition-picker-subgroups">
                      <button
                        className={`tradition-picker-subgroup tradition-picker-subgroup--general ${traditionSettings.traditionId === tradition.id && !traditionSettings.subgroupId ? 'tradition-picker-subgroup--selected' : ''}`}
                        onClick={() => handleSelectGenericTradition(tradition.id)}
                        style={{ '--tradition-color': tradition.color }}
                      >
                        <span className="tradition-picker-subicon">{tradition.icon}</span>
                        <span>{tradition.name} (General)</span>
                      </button>
                      {getSubgroups(tradition.id).map(subgroup => (
                        <button
                          key={subgroup.id}
                          className={`tradition-picker-subgroup ${traditionSettings.traditionId === tradition.id && traditionSettings.subgroupId === subgroup.id ? 'tradition-picker-subgroup--selected' : ''}`}
                          onClick={() => handleSelectSubgroup(tradition.id, subgroup.id)}
                          style={{ '--tradition-color': subgroup.color }}
                        >
                          <span className="tradition-picker-subicon">{subgroup.icon}</span>
                          <span>{subgroup.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="tradition-picker-hint">Double-click the tradition button to access full settings</p>
            <div className="tradition-picker-actions">
              {traditionSettings.traditionId && (
                <button
                  onClick={handleClearTradition}
                  className="btn btn-secondary tradition-picker-reset"
                >
                  Reset to Default
                </button>
              )}
              <button
                onClick={() => setShowTraditionPicker(false)}
                className="btn btn-secondary tradition-picker-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Streak Opt-In Modal */}
      <StreakOptInModal
        isOpen={showStreakModal}
        onClose={(enabled) => {
          setShowStreakModal(false)
          if (enabled !== null) {
            setStreakEnabled(enabled)
          }
        }}
        currentStreak={streak}
      />
    </div>
  )
}

export default DailyLog
