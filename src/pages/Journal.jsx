import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, queries } from '../db'
import { getLocalDateString } from '../utils/dateUtils'
import { getTraditionSettings } from '../components/TraditionSettings'
import { AVAILABLE_TRADITIONS } from '../data/traditions'
import './Journal.css'

const DEFAULT_ENTRY_TYPES = [
  { id: 'insight', label: 'Insight', icon: '💡' },
  { id: 'breakthrough', label: 'Breakthrough', icon: '⚡' },
  { id: 'stumble', label: 'Stumble', icon: '🌑' },
  { id: 'dream', label: 'Dream', icon: '🌙' },
  { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
  { id: 'reflection', label: 'Reflection', icon: '🔮' }
]

const STORAGE_KEY = 'sanctum-journal-entry-types'

function loadEntryTypes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading entry types:', e)
  }
  return DEFAULT_ENTRY_TYPES
}

function saveEntryTypes(types) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(types))
}

function getTraditionInfo() {
  const settings = getTraditionSettings()
  if (!settings.traditionId) return null
  const tradition = AVAILABLE_TRADITIONS.find(t => t.id === settings.traditionId)
  return tradition
}

function Journal() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [entryType, setEntryType] = useState('insight')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [promptMode, setPromptMode] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')

  // Entry types customization
  const [entryTypes, setEntryTypes] = useState(loadEntryTypes)
  const [showSettings, setShowSettings] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [newTypeLabel, setNewTypeLabel] = useState('')
  const [newTypeIcon, setNewTypeIcon] = useState('')

  // Double-click detection for tradition button
  const lastTraditionClickRef = useRef(0)

  const traditionInfo = getTraditionInfo()

  useEffect(() => {
    loadEntries()
  }, [])

  function startPromptEntry() {
    if (!traditionInfo?.journalingPrompts?.length) return
    const prompts = traditionInfo.journalingPrompts
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    setCurrentPrompt(randomPrompt)
    setPromptMode(true)
    setTitle(randomPrompt)
    setEntryType('reflection')
    setShowForm(true)
  }

  function getNewPrompt() {
    if (!traditionInfo?.journalingPrompts?.length) return
    const prompts = traditionInfo.journalingPrompts
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    setCurrentPrompt(randomPrompt)
    setTitle(randomPrompt)
  }

  async function loadEntries() {
    try {
      const allEntries = await queries.getRecentJournalEntries(50)
      setEntries(allEntries)
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveEntry() {
    if (!content.trim()) return

    setSaving(true)
    try {
      const entry = {
        type: entryType,
        title: title.trim(),
        content: content.trim(),
        date: getLocalDateString()
      }

      await db.add('journal', entry)

      // Auto-log journaling practice to daily log
      const typeInfo = getTypeInfo(entryType)
      const autoNotes = `${typeInfo.label} entry${title.trim() ? ': ' + title.trim() : ''}`
      await queries.autoLogPractice('journaling', autoNotes)

      await loadEntries()
      resetForm()
    } catch (error) {
      console.error('Error saving entry:', error)
    } finally {
      setSaving(false)
    }
  }

  async function deleteEntry(id) {
    if (confirm('Delete this entry?')) {
      try {
        await db.delete('journal', id)
        setEntries(prev => prev.filter(e => e.id !== id))
      } catch (error) {
        console.error('Error deleting entry:', error)
      }
    }
  }

  function resetForm() {
    setShowForm(false)
    setEntryType('insight')
    setTitle('')
    setContent('')
    setPromptMode(false)
    setCurrentPrompt('')
  }

  function getTypeInfo(typeId) {
    return entryTypes.find(t => t.id === typeId) || entryTypes[0] || { id: typeId, label: typeId, icon: '📝' }
  }

  function addEntryType() {
    if (!newTypeLabel.trim()) return
    const id = newTypeLabel.toLowerCase().replace(/\s+/g, '-')
    const newType = {
      id,
      label: newTypeLabel.trim(),
      icon: newTypeIcon.trim() || '📝'
    }
    const updated = [...entryTypes, newType]
    setEntryTypes(updated)
    saveEntryTypes(updated)
    setNewTypeLabel('')
    setNewTypeIcon('')
  }

  function updateEntryType(id, updates) {
    const updated = entryTypes.map(t =>
      t.id === id ? { ...t, ...updates } : t
    )
    setEntryTypes(updated)
    saveEntryTypes(updated)
    setEditingType(null)
  }

  function removeEntryType(id) {
    if (entryTypes.length <= 1) {
      alert('You must have at least one entry type.')
      return
    }
    const updated = entryTypes.filter(t => t.id !== id)
    setEntryTypes(updated)
    saveEntryTypes(updated)
  }

  function resetEntryTypes() {
    if (confirm('Reset to default entry types?')) {
      setEntryTypes(DEFAULT_ENTRY_TYPES)
      saveEntryTypes(DEFAULT_ENTRY_TYPES)
    }
  }

  function handleTraditionButtonClick() {
    const now = Date.now()
    const timeSinceLastClick = now - lastTraditionClickRef.current

    if (timeSinceLastClick < 300) {
      // Double-click: navigate to settings to change tradition
      navigate('/settings')
    } else {
      // Single click: start a prompt entry
      startPromptEntry()
    }

    lastTraditionClickRef.current = now
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="journal">
      {!showForm ? (
        <>
          <div className="journal-buttons">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary new-entry-btn"
            >
              + New Entry
            </button>
            <button
              onClick={traditionInfo?.journalingPrompts?.length > 0 ? handleTraditionButtonClick : () => navigate('/settings')}
              className="btn btn-secondary prompt-entry-btn"
              title={traditionInfo ? "Click for prompt, double-click to change tradition" : "Select a tradition for prompts"}
            >
              {traditionInfo ? `${traditionInfo.icon} ${traditionInfo.name} Prompt` : '✨ Select Tradition'}
            </button>
          </div>

          {entries.length === 0 ? (
            <div className="empty-state">
              <p>No journal entries yet.</p>
              <p className="empty-hint">Start documenting your journey.</p>
            </div>
          ) : (
            <div className="entries-list">
              {entries.map(entry => {
                const typeInfo = getTypeInfo(entry.type)
                return (
                  <article key={entry.id} className="entry-card">
                    <div className="entry-header">
                      <span className="entry-type-badge">
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className="entry-date">{formatDate(entry.createdAt)}</span>
                    </div>
                    {entry.title && (
                      <h3 className="entry-title">{entry.title}</h3>
                    )}
                    <p className="entry-content">{entry.content}</p>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="entry-delete"
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </>
      ) : (
        <div className="entry-form">
          <h2 className="form-title">
            {promptMode ? `${traditionInfo?.name} Prompt` : 'New Journal Entry'}
          </h2>

          {promptMode && (
            <div className="prompt-display">
              <p className="prompt-text">{currentPrompt}</p>
              <button
                type="button"
                onClick={getNewPrompt}
                className="btn btn-small btn-secondary"
              >
                Different Prompt
              </button>
            </div>
          )}

          {!promptMode && (
            <div className="type-selector-wrapper">
              <div className="type-selector">
                {entryTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setEntryType(type.id)}
                    className={`type-btn ${entryType === type.id ? 'type-btn--active' : ''}`}
                  >
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="type-settings-btn"
                title="Customize entry types"
              >
                ⚙
              </button>
            </div>
          )}

          {!promptMode && (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="input"
            />
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            className="input content-textarea"
            rows={8}
            autoFocus
          />

          <div className="form-actions">
            <button
              onClick={saveEntry}
              disabled={!content.trim() || saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save Entry'}
            </button>
            <button onClick={resetForm} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Entry Types Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content entry-types-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Entry Types</h3>
              <button className="modal-close" onClick={() => setShowSettings(false)}>×</button>
            </div>

            <div className="entry-types-list">
              {entryTypes.map(type => (
                <div key={type.id} className="entry-type-item">
                  {editingType === type.id ? (
                    <>
                      <input
                        type="text"
                        value={type.icon}
                        onChange={(e) => updateEntryType(type.id, { icon: e.target.value })}
                        className="input entry-type-icon-input"
                        placeholder="Icon"
                        maxLength={4}
                      />
                      <input
                        type="text"
                        value={type.label}
                        onChange={(e) => updateEntryType(type.id, { label: e.target.value })}
                        className="input entry-type-label-input"
                        placeholder="Label"
                      />
                      <button
                        className="entry-type-action-btn"
                        onClick={() => setEditingType(null)}
                      >
                        ✓
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="entry-type-preview">
                        <span className="entry-type-icon">{type.icon}</span>
                        <span className="entry-type-label">{type.label}</span>
                      </span>
                      <div className="entry-type-actions">
                        <button
                          className="entry-type-action-btn"
                          onClick={() => setEditingType(type.id)}
                          title="Edit"
                        >
                          ✎
                        </button>
                        <button
                          className="entry-type-action-btn entry-type-delete-btn"
                          onClick={() => removeEntryType(type.id)}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="add-entry-type">
              <input
                type="text"
                value={newTypeIcon}
                onChange={(e) => setNewTypeIcon(e.target.value)}
                className="input entry-type-icon-input"
                placeholder="📝"
                maxLength={4}
              />
              <input
                type="text"
                value={newTypeLabel}
                onChange={(e) => setNewTypeLabel(e.target.value)}
                className="input entry-type-label-input"
                placeholder="New type name..."
                onKeyDown={(e) => e.key === 'Enter' && addEntryType()}
              />
              <button
                className="btn btn-primary btn-small"
                onClick={addEntryType}
                disabled={!newTypeLabel.trim()}
              >
                Add
              </button>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary btn-small" onClick={resetEntryTypes}>
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Journal
