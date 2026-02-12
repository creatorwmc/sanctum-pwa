import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { db } from '../db'
import { getTraditionSettings } from '../components/TraditionSettings'
import { AVAILABLE_TRADITIONS } from '../data/traditions'
import {
  isGoogleDriveConfigured,
  isConnected as isDriveConnected,
  connectGoogleDrive,
  uploadBinaryToGoogleDrive,
  deleteFromGoogleDrive,
  MAX_FILE_SIZE,
  ALLOWED_MIME_TYPES
} from '../services/googleDrive'
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

  // File upload state
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle') // idle, uploading, error
  const [uploadError, setUploadError] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadTradition, setUploadTradition] = useState('BOTA')
  const [uploadDescription, setUploadDescription] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [driveConnected, setDriveConnected] = useState(isDriveConnected())
  const [connecting, setConnecting] = useState(false)
  const fileInputRef = useRef(null)

  // File info modal state
  const [showFileInfo, setShowFileInfo] = useState(null) // holds the file doc or null
  const [fileInfoDescription, setFileInfoDescription] = useState('')

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
      let docs = await db.getAll('documents')
      // Migration: add documentType field to existing docs
      docs = docs.map(doc => ({
        ...doc,
        documentType: doc.documentType || 'text'
      }))
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
        documentType: 'text',
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

  async function deleteDocument(id, driveId = null) {
    if (confirm('Delete this document?')) {
      try {
        // If it's a file document, also delete from Google Drive
        if (driveId) {
          try {
            await deleteFromGoogleDrive(driveId)
          } catch (driveError) {
            console.error('Error deleting from Drive:', driveError)
            // Continue with local deletion even if Drive deletion fails
          }
        }
        await db.delete('documents', id)
        setDocuments(prev => prev.filter(d => d.id !== id))
        setShowFileInfo(null)
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

  // File upload functions
  function resetUploadForm() {
    setShowUploadForm(false)
    setSelectedFile(null)
    setUploadStatus('idle')
    setUploadError('')
    setUploadTitle('')
    setUploadTradition('BOTA')
    setUploadDescription('')
    setIsDragOver(false)
  }

  function handleFileSelect(file) {
    if (!file) return

    // Validate file type
    if (!ALLOWED_MIME_TYPES[file.type]) {
      setUploadError('Only PDF and Word documents are supported')
      setSelectedFile(null)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File exceeds 5MB limit')
      setSelectedFile(null)
      return
    }

    setUploadError('')
    setSelectedFile(file)
    // Auto-fill title from filename (without extension)
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
    setUploadTitle(nameWithoutExt)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setIsDragOver(false)
  }

  async function handleUpload() {
    if (!selectedFile || !uploadTitle.trim()) return

    // Check if connected to Google Drive
    if (!driveConnected) {
      setUploadError('Connect to Google Drive to upload files')
      return
    }

    setUploadStatus('uploading')
    setUploadError('')

    try {
      // Upload to Google Drive
      const driveResult = await uploadBinaryToGoogleDrive(selectedFile)

      // Save metadata to IndexedDB
      const docData = {
        documentType: 'file',
        title: uploadTitle.trim(),
        tradition: useTraditionCategories ? selectedTradition?.id || 'custom' : uploadTradition,
        category: useTraditionCategories ? uploadTradition : null,
        description: uploadDescription.trim(),
        driveId: driveResult.id,
        webViewLink: driveResult.webViewLink,
        fileName: selectedFile.name,
        fileType: ALLOWED_MIME_TYPES[selectedFile.type],
        mimeType: selectedFile.type,
        fileSize: selectedFile.size
      }

      await db.add('documents', docData)
      await loadDocuments()
      resetUploadForm()
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('error')
      setUploadError(error.message || 'Upload failed. Check connection and retry.')
    }
  }

  async function handleConnectDrive() {
    setConnecting(true)
    setUploadError('')
    try {
      await connectGoogleDrive()
      setDriveConnected(true)
    } catch (error) {
      console.error('Failed to connect to Google Drive:', error)
      setUploadError(error.message || 'Failed to connect to Google Drive')
    } finally {
      setConnecting(false)
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  function getFileTypeIcon(fileType) {
    const icons = {
      pdf: '📕',
      doc: '📄',
      docx: '📄'
    }
    return icons[fileType] || '📎'
  }

  // File info modal functions
  function openFileInfo(doc) {
    setShowFileInfo(doc)
    setFileInfoDescription(doc.description || '')
  }

  function closeFileInfo() {
    setShowFileInfo(null)
    setFileInfoDescription('')
  }

  async function saveFileDescription() {
    if (!showFileInfo) return

    try {
      await db.update('documents', { ...showFileInfo, description: fileInfoDescription.trim() })
      await loadDocuments()
      closeFileInfo()
    } catch (error) {
      console.error('Error saving description:', error)
    }
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
      {!showForm && !showUploadForm ? (
        <>
          <div className="library-header">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              + Add Document
            </button>
{isGoogleDriveConfigured() && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="btn btn-secondary"
              >
                📎 Upload PDF/Word
              </button>
            )}
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
                <article
                  key={doc.id}
                  className={`doc-card ${doc.documentType === 'file' ? 'doc-card--file' : ''}`}
                  onClick={() => doc.documentType === 'file' ? openFileInfo(doc) : startEdit(doc)}
                >
                  <div className="doc-header">
                    <span className="doc-tradition">
                      {doc.documentType === 'file' && (
                        <span className="doc-file-type">{getFileTypeIcon(doc.fileType)}</span>
                      )}
                      {getLabel(doc.tradition)}
                    </span>
                    <span className="doc-date">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="doc-title">{doc.title}</h3>
                  {doc.description && (
                    <p className="doc-description">{doc.description}</p>
                  )}
                  {doc.documentType === 'file' && (
                    <div className="doc-file-info">
                      <span className="doc-file-size">{formatFileSize(doc.fileSize)}</span>
                      <a
                        href={doc.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-file-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Open in Drive
                      </a>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDocument(doc.id, doc.driveId)
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

          {/* File Info Modal */}
          {showFileInfo && (
            <div className="modal-overlay" onClick={closeFileInfo}>
              <div className="modal file-info-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeFileInfo}>×</button>
                <h2 className="modal-title">
                  {getFileTypeIcon(showFileInfo.fileType)} {showFileInfo.title}
                </h2>
                <div className="file-info-details">
                  <p><strong>File:</strong> {showFileInfo.fileName}</p>
                  <p><strong>Size:</strong> {formatFileSize(showFileInfo.fileSize)}</p>
                  <p><strong>Uploaded:</strong> {new Date(showFileInfo.createdAt).toLocaleDateString()}</p>
                  <p><strong>Tradition:</strong> {getLabel(showFileInfo.tradition)}</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={fileInfoDescription}
                    onChange={(e) => setFileInfoDescription(e.target.value)}
                    placeholder="Add a description..."
                    className="input"
                    rows={3}
                  />
                </div>
                <div className="file-info-actions">
                  <a
                    href={showFileInfo.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Open in Drive
                  </a>
                  <button
                    onClick={saveFileDescription}
                    className="btn btn-secondary"
                  >
                    Save Description
                  </button>
                  <button
                    onClick={() => deleteDocument(showFileInfo.id, showFileInfo.driveId)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : showUploadForm ? (
        <div className="doc-form upload-form">
          <h2 className="form-title">Upload PDF/Word Document</h2>

          {!driveConnected ? (
            <div className="drive-connect-prompt">
              <p>Connect to Google Drive to upload files</p>
              <button
                onClick={handleConnectDrive}
                className="btn btn-primary"
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : 'Connect Google Drive'}
              </button>
              {uploadError && <p className="upload-error">{uploadError}</p>}
              <button onClick={resetUploadForm} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div
                className={`drop-zone ${isDragOver ? 'drop-zone--active' : ''} ${selectedFile ? 'drop-zone--has-file' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  style={{ display: 'none' }}
                />
                {selectedFile ? (
                  <div className="drop-zone-file">
                    <span className="drop-zone-icon">{getFileTypeIcon(ALLOWED_MIME_TYPES[selectedFile.type])}</span>
                    <span className="drop-zone-filename">{selectedFile.name}</span>
                    <span className="drop-zone-size">{formatFileSize(selectedFile.size)}</span>
                  </div>
                ) : (
                  <div className="drop-zone-prompt">
                    <span className="drop-zone-icon">📎</span>
                    <p>Drop a file here or click to browse</p>
                    <p className="drop-zone-hint">PDF, DOC, or DOCX (max 5MB)</p>
                  </div>
                )}
              </div>

              {uploadError && <p className="upload-error">{uploadError}</p>}

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Document title"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  {useTraditionCategories ? 'Category' : 'Tradition'}
                </label>
                <select
                  value={uploadTradition}
                  onChange={(e) => setUploadTradition(e.target.value)}
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
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Brief description"
                  className="input"
                />
              </div>

              <div className="form-actions">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || !uploadTitle.trim() || uploadStatus === 'uploading'}
                  className="btn btn-primary"
                >
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={resetUploadForm}
                  disabled={uploadStatus === 'uploading'}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>

              {uploadStatus === 'uploading' && (
                <div className="upload-progress">
                  <div className="upload-progress-bar"></div>
                </div>
              )}
            </>
          )}
        </div>
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
