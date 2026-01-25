import { useState, useEffect } from 'react'
import { db, queries } from '../db'
import './Journal.css'

const ENTRY_TYPES = [
  { id: 'insight', label: 'Insight', icon: '💡' },
  { id: 'breakthrough', label: 'Breakthrough', icon: '⚡' },
  { id: 'stumble', label: 'Stumble', icon: '🌑' },
  { id: 'dream', label: 'Dream', icon: '🌙' },
  { id: 'gratitude', label: 'Gratitude', icon: '🙏' },
  { id: 'reflection', label: 'Reflection', icon: '🔮' }
]

function Journal() {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [entryType, setEntryType] = useState('insight')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [])

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
        date: new Date().toISOString().split('T')[0]
      }

      await db.add('journal', entry)
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
  }

  function getTypeInfo(typeId) {
    return ENTRY_TYPES.find(t => t.id === typeId) || ENTRY_TYPES[0]
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
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary new-entry-btn"
          >
            + New Entry
          </button>

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
          <h2 className="form-title">New Journal Entry</h2>

          <div className="type-selector">
            {ENTRY_TYPES.map(type => (
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

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="input"
          />

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
    </div>
  )
}

export default Journal
