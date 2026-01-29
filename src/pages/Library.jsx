import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { db } from '../db'
import { getTraditionSettings } from '../components/TraditionSettings'
import { AVAILABLE_TRADITIONS } from '../data/traditions'
import './Library.css'

const DEFAULT_TRADITIONS = [
  { id: 'all', label: 'All' },
  { id: 'BOTA', label: 'BOTA' },
  { id: 'Kabbalah', label: 'Kabbalah' },
  { id: 'Buddhism', label: 'Buddhism' },
  { id: 'Alchemy', label: 'Alchemy' },
  { id: 'Philosophy', label: 'Philosophy' },
  { id: 'Jedi', label: 'Jedi/Metaphor' }
]

const DEFAULT_LABELS = DEFAULT_TRADITIONS.reduce((acc, t) => {
  acc[t.id] = t.label
  return acc
}, {})

function getSelectedTraditionInfo() {
  const settings = getTraditionSettings()
  if (!settings.traditionId) return null
  const tradition = AVAILABLE_TRADITIONS.find(t => t.id === settings.traditionId)
  return tradition
}

function Library() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [documents, setDocuments] = useState([])
  const [filter, setFilter] = useState(searchParams.get('tradition') || 'all')
  const [showForm, setShowForm] = useState(false)
  const [editDoc, setEditDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  // Custom labels state
  const [customLabels, setCustomLabels] = useState(DEFAULT_LABELS)
  const [editingLabels, setEditingLabels] = useState(false)
  const [useTraditionCategories, setUseTraditionCategories] = useState(false)

  // Double-click detection for tradition button
  const lastTraditionClickRef = useRef(0)

  const selectedTradition = getSelectedTraditionInfo()
  const traditionCategories = selectedTradition?.libraryCategories || []

  // Build categories based on mode
  const activeCategories = useTraditionCategories && traditionCategories.length > 0
    ? [{ id: 'all', label: 'All' }, ...traditionCategories.map(cat => ({ id: cat, label: cat }))]
    : DEFAULT_TRADITIONS

  // Form state
  const [title, setTitle] = useState('')
  const [tradition, setTradition] = useState('BOTA')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    loadDocuments()
    // Load custom labels from localStorage
    const savedLabels = localStorage.getItem('sanctum-tradition-labels')
    if (savedLabels) {
      try {
        const parsed = JSON.parse(savedLabels)
        setCustomLabels({ ...DEFAULT_LABELS, ...parsed })
      } catch (e) {
        console.error('Error loading tradition labels:', e)
      }
    }
  }, [])

  useEffect(() => {
    const traditionParam = searchParams.get('tradition')
    if (traditionParam) {
      setFilter(traditionParam)
    }
  }, [searchParams])

  async function loadDocuments() {
    try {
      const docs = await db.getAll('documents')
      setDocuments(docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveDocument() {
    if (!title.trim() || !content.trim()) return

    try {
      const docData = {
        title: title.trim(),
        tradition: useTraditionCategories ? selectedTradition?.id || 'custom' : tradition,
        category: useTraditionCategories ? tradition : null,
        description: description.trim(),
        content: content.trim()
      }

      if (editDoc) {
        await db.update('documents', { ...editDoc, ...docData })
      } else {
        await db.add('documents', docData)
      }

      await loadDocuments()
      resetForm()
    } catch (error) {
      console.error('Error saving document:', error)
    }
  }

  async function deleteDocument(id) {
    if (confirm('Delete this document?')) {
      try {
        await db.delete('documents', id)
        setDocuments(prev => prev.filter(d => d.id !== id))
      } catch (error) {
        console.error('Error deleting document:', error)
      }
    }
  }

  function startEdit(doc) {
    setEditDoc(doc)
    setTitle(doc.title)
    setTradition(doc.tradition)
    setDescription(doc.description || '')
    setContent(doc.content)
    setShowForm(true)
  }

  function resetForm() {
    setShowForm(false)
    setEditDoc(null)
    setTitle('')
    setTradition('BOTA')
    setDescription('')
    setContent('')
  }

  function handleFilterChange(traditionId) {
    setFilter(traditionId)
    if (traditionId === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ tradition: traditionId })
    }
  }

  function getLabel(id) {
    return customLabels[id] || DEFAULT_LABELS[id]
  }

  function updateLabel(id, newLabel) {
    const updated = { ...customLabels, [id]: newLabel || DEFAULT_LABELS[id] }
    setCustomLabels(updated)
    localStorage.setItem('sanctum-tradition-labels', JSON.stringify(updated))
  }

  function resetLabels() {
    setCustomLabels(DEFAULT_LABELS)
    localStorage.removeItem('sanctum-tradition-labels')
  }

  const filteredDocs = filter === 'all'
    ? documents
    : documents.filter(d => d.tradition === filter || d.category === filter)

  function handleTraditionToggle() {
    setUseTraditionCategories(!useTraditionCategories)
    setFilter('all') // Reset filter when switching modes
  }

  function handleTraditionButtonClick() {
    const now = Date.now()
    const timeSinceLastClick = now - lastTraditionClickRef.current

    if (timeSinceLastClick < 300) {
      // Double-click: navigate to settings to change tradition
      navigate('/settings')
    } else {
      // Single click: toggle tradition categories mode
      if (selectedTradition?.libraryCategories?.length > 0) {
        handleTraditionToggle()
      }
    }

    lastTraditionClickRef.current = now
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="library">
      {!showForm ? (
        <>
          <div className="library-header">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              + Add Document
            </button>
            <button
              onClick={selectedTradition ? handleTraditionButtonClick : () => navigate('/settings')}
              className={`btn ${useTraditionCategories ? 'btn-primary' : 'btn-secondary'} tradition-btn`}
              title={selectedTradition ? "Click to toggle categories, double-click to change tradition" : "Select a tradition"}
            >
              {selectedTradition ? `${selectedTradition.icon} ${selectedTradition.name}` : '✨ Select Tradition'}
            </button>
          </div>

          <div className="tradition-header">
            <div className="tradition-tabs">
              {activeCategories.map(t => (
                editingLabels && t.id !== 'all' && !useTraditionCategories ? (
                  <input
                    key={t.id}
                    type="text"
                    className="tab-input"
                    value={getLabel(t.id)}
                    onChange={(e) => updateLabel(t.id, e.target.value)}
                    placeholder={DEFAULT_LABELS[t.id]}
                    maxLength={15}
                  />
                ) : (
                  <button
                    key={t.id}
                    onClick={() => !editingLabels && handleFilterChange(t.id)}
                    className={`tab-btn ${filter === t.id ? 'tab-btn--active' : ''} ${editingLabels ? 'tab-btn--disabled' : ''}`}
                  >
                    {useTraditionCategories ? t.label : getLabel(t.id)}
                  </button>
                )
              ))}
            </div>
            {!useTraditionCategories && (
              <div className="tradition-actions">
                {editingLabels && (
                  <button className="edit-btn" onClick={resetLabels}>
                    Reset
                  </button>
                )}
                <button
                  className="edit-btn"
                  onClick={() => setEditingLabels(!editingLabels)}
                >
                  {editingLabels ? 'Done' : 'Edit'}
                </button>
              </div>
            )}
          </div>

          {filteredDocs.length === 0 ? (
            <div className="empty-state">
              <p>No documents in this category.</p>
            </div>
          ) : (
            <div className="documents-list">
              {filteredDocs.map(doc => (
                <article key={doc.id} className="doc-card" onClick={() => startEdit(doc)}>
                  <div className="doc-header">
                    <span className="doc-tradition">{getLabel(doc.tradition)}</span>
                    <span className="doc-date">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="doc-title">{doc.title}</h3>
                  {doc.description && (
                    <p className="doc-description">{doc.description}</p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDocument(doc.id)
                    }}
                    className="doc-delete"
                    aria-label="Delete document"
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="doc-form">
          <h2 className="form-title">{editDoc ? 'Edit Document' : 'New Document'}</h2>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {useTraditionCategories ? 'Category' : 'Tradition'}
            </label>
            <select
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
              className="input"
            >
              {activeCategories.filter(t => t.id !== 'all').map(t => (
                <option key={t.id} value={t.id}>
                  {useTraditionCategories ? t.label : getLabel(t.id)}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Document content, notes, excerpts..."
              className="input content-textarea"
              rows={12}
            />
          </div>

          <div className="form-actions">
            <button
              onClick={saveDocument}
              disabled={!title.trim() || !content.trim()}
              className="btn btn-primary"
            >
              {editDoc ? 'Update' : 'Save'}
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

export default Library
