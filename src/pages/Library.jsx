import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { db } from '../db'
import './Library.css'

const TRADITIONS = [
  { id: 'all', label: 'All' },
  { id: 'BOTA', label: 'BOTA' },
  { id: 'Kabbalah', label: 'Kabbalah' },
  { id: 'Buddhism', label: 'Buddhism' },
  { id: 'Alchemy', label: 'Alchemy' },
  { id: 'Philosophy', label: 'Philosophy' },
  { id: 'Jedi', label: 'Jedi/Metaphor' }
]

function Library() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [documents, setDocuments] = useState([])
  const [filter, setFilter] = useState(searchParams.get('tradition') || 'all')
  const [showForm, setShowForm] = useState(false)
  const [editDoc, setEditDoc] = useState(null)
  const [loading, setLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState('')
  const [tradition, setTradition] = useState('BOTA')
  const [content, setContent] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    loadDocuments()
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
        tradition,
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

  const filteredDocs = filter === 'all'
    ? documents
    : documents.filter(d => d.tradition === filter)

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
          </div>

          <div className="tradition-tabs">
            {TRADITIONS.map(t => (
              <button
                key={t.id}
                onClick={() => handleFilterChange(t.id)}
                className={`tab-btn ${filter === t.id ? 'tab-btn--active' : ''}`}
              >
                {t.label}
              </button>
            ))}
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
                    <span className="doc-tradition">{doc.tradition}</span>
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
            <label className="form-label">Tradition</label>
            <select
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
              className="input"
            >
              {TRADITIONS.filter(t => t.id !== 'all').map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
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
