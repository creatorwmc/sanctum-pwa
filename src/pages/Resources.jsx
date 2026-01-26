import { useState, useEffect } from 'react'
import { db } from '../db'
import {
  isGoogleDriveConfigured,
  isConnected,
  connectGoogleDrive,
  disconnectGoogleDrive,
  listDriveFiles,
  searchDriveFiles,
  getUserEmail,
  getFileTypeIcon
} from '../services/googleDrive'
import './Resources.css'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'study', label: 'Study Materials' },
  { id: 'reference', label: 'Reference' },
  { id: 'practice', label: 'Practice Guides' },
  { id: 'media', label: 'Media' },
  { id: 'other', label: 'Other' }
]

function Resources() {
  // Resources state
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all') // 'all', 'drive', 'manual'
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date', 'title', 'category'

  // Google Drive state
  const [driveConfigured] = useState(isGoogleDriveConfigured())
  const [driveConnected, setDriveConnected] = useState(false)
  const [userEmail, setUserEmail] = useState(null)
  const [connecting, setConnecting] = useState(false)

  // Drive browser state
  const [showDriveBrowser, setShowDriveBrowser] = useState(false)
  const [driveFiles, setDriveFiles] = useState([])
  const [drivePath, setDrivePath] = useState([{ id: null, name: 'My Drive' }])
  const [driveLoading, setDriveLoading] = useState(false)
  const [driveSearch, setDriveSearch] = useState('')
  const [selectedDriveFiles, setSelectedDriveFiles] = useState([])

  // Manual link form state
  const [showManualForm, setShowManualForm] = useState(false)
  const [editResource, setEditResource] = useState(null)
  const [formTitle, setFormTitle] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formCategory, setFormCategory] = useState('study')
  const [formTags, setFormTags] = useState('')
  const [formNotes, setFormNotes] = useState('')

  // Add Drive resource modal
  const [showAddDriveModal, setShowAddDriveModal] = useState(false)
  const [driveFileToAdd, setDriveFileToAdd] = useState(null)
  const [driveCategory, setDriveCategory] = useState('study')
  const [driveTags, setDriveTags] = useState('')
  const [driveNotes, setDriveNotes] = useState('')

  useEffect(() => {
    loadResources()
    checkDriveConnection()
  }, [])

  async function checkDriveConnection() {
    const connected = isConnected()
    setDriveConnected(connected)
    if (connected) {
      const email = await getUserEmail()
      setUserEmail(email)
    }
  }

  async function loadResources() {
    try {
      const allResources = await db.getAll('resources')
      setResources(allResources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }

  // Google Drive connection
  async function handleConnectDrive() {
    setConnecting(true)
    try {
      await connectGoogleDrive()
      setDriveConnected(true)
      const email = await getUserEmail()
      setUserEmail(email)
    } catch (error) {
      console.error('Failed to connect:', error)
      alert('Failed to connect to Google Drive. Please try again.')
    } finally {
      setConnecting(false)
    }
  }

  function handleDisconnectDrive() {
    if (confirm('Disconnect from Google Drive? Your saved resources will remain.')) {
      disconnectGoogleDrive()
      setDriveConnected(false)
      setUserEmail(null)
    }
  }

  // Drive browser functions
  async function openDriveBrowser() {
    setShowDriveBrowser(true)
    setDrivePath([{ id: null, name: 'My Drive' }])
    setSelectedDriveFiles([])
    setDriveSearch('')
    await loadDriveFolder(null)
  }

  async function loadDriveFolder(folderId) {
    setDriveLoading(true)
    try {
      const result = await listDriveFiles(folderId)
      setDriveFiles(result.files)
    } catch (error) {
      console.error('Error loading Drive files:', error)
      alert('Failed to load files from Google Drive.')
    } finally {
      setDriveLoading(false)
    }
  }

  async function handleDriveSearch() {
    if (!driveSearch.trim()) {
      await loadDriveFolder(drivePath[drivePath.length - 1].id)
      return
    }

    setDriveLoading(true)
    try {
      const files = await searchDriveFiles(driveSearch.trim())
      setDriveFiles(files)
    } catch (error) {
      console.error('Error searching Drive:', error)
    } finally {
      setDriveLoading(false)
    }
  }

  function handleFolderClick(folder) {
    setDrivePath([...drivePath, { id: folder.id, name: folder.name }])
    setDriveSearch('')
    loadDriveFolder(folder.id)
  }

  function handleBreadcrumbClick(index) {
    const newPath = drivePath.slice(0, index + 1)
    setDrivePath(newPath)
    setDriveSearch('')
    loadDriveFolder(newPath[newPath.length - 1].id)
  }

  function toggleFileSelection(file) {
    if (file.isFolder) {
      handleFolderClick(file)
      return
    }

    setSelectedDriveFiles(prev => {
      const isSelected = prev.some(f => f.id === file.id)
      if (isSelected) {
        return prev.filter(f => f.id !== file.id)
      }
      return [...prev, file]
    })
  }

  function openAddDriveFileModal(file) {
    setDriveFileToAdd(file)
    setDriveCategory('study')
    setDriveTags('')
    setDriveNotes('')
    setShowAddDriveModal(true)
  }

  async function addDriveResource() {
    if (!driveFileToAdd) return

    try {
      const tagArray = driveTags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t)

      await db.add('resources', {
        sourceType: 'drive',
        driveId: driveFileToAdd.id,
        title: driveFileToAdd.name,
        url: driveFileToAdd.webViewLink,
        fileType: driveFileToAdd.fileType,
        mimeType: driveFileToAdd.mimeType,
        category: driveCategory,
        tags: tagArray,
        notes: driveNotes.trim()
      })

      await loadResources()
      setShowAddDriveModal(false)
      setDriveFileToAdd(null)

      // Remove from selected if it was there
      setSelectedDriveFiles(prev => prev.filter(f => f.id !== driveFileToAdd.id))
    } catch (error) {
      console.error('Error adding Drive resource:', error)
      alert('Failed to add resource.')
    }
  }

  async function addSelectedDriveFiles() {
    if (selectedDriveFiles.length === 0) return

    try {
      for (const file of selectedDriveFiles) {
        await db.add('resources', {
          sourceType: 'drive',
          driveId: file.id,
          title: file.name,
          url: file.webViewLink,
          fileType: file.fileType,
          mimeType: file.mimeType,
          category: 'study',
          tags: [],
          notes: ''
        })
      }

      await loadResources()
      setShowDriveBrowser(false)
      setSelectedDriveFiles([])
    } catch (error) {
      console.error('Error adding Drive resources:', error)
      alert('Failed to add some resources.')
    }
  }

  // Manual link functions
  function openManualForm(resource = null) {
    if (resource) {
      setEditResource(resource)
      setFormTitle(resource.title)
      setFormUrl(resource.url)
      setFormCategory(resource.category)
      setFormTags(resource.tags?.join(', ') || '')
      setFormNotes(resource.notes || '')
    } else {
      setEditResource(null)
      setFormTitle('')
      setFormUrl('')
      setFormCategory('study')
      setFormTags('')
      setFormNotes('')
    }
    setShowManualForm(true)
  }

  async function saveManualResource() {
    if (!formTitle.trim() || !formUrl.trim()) return

    try {
      const tagArray = formTags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t)

      const resourceData = {
        sourceType: 'manual',
        title: formTitle.trim(),
        url: formUrl.trim(),
        category: formCategory,
        tags: tagArray,
        notes: formNotes.trim()
      }

      if (editResource) {
        await db.update('resources', { ...editResource, ...resourceData })
      } else {
        await db.add('resources', resourceData)
      }

      await loadResources()
      setShowManualForm(false)
      resetForm()
    } catch (error) {
      console.error('Error saving resource:', error)
      alert('Failed to save resource.')
    }
  }

  function resetForm() {
    setEditResource(null)
    setFormTitle('')
    setFormUrl('')
    setFormCategory('study')
    setFormTags('')
    setFormNotes('')
  }

  async function deleteResource(id) {
    if (confirm('Delete this resource?')) {
      try {
        await db.delete('resources', id)
        setResources(prev => prev.filter(r => r.id !== id))
      } catch (error) {
        console.error('Error deleting resource:', error)
      }
    }
  }

  // Filtering and sorting
  function getFilteredResources() {
    let filtered = [...resources]

    // Category filter
    if (filter !== 'all') {
      filtered = filtered.filter(r => r.category === filter)
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(r => r.sourceType === sourceFilter)
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(term) ||
        r.notes?.toLowerCase().includes(term) ||
        r.tags?.some(t => t.includes(term))
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return filtered
  }

  // Get all unique tags
  function getAllTags() {
    const tagSet = new Set()
    resources.forEach(r => r.tags?.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }

  const filteredResources = getFilteredResources()
  const allTags = getAllTags()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Drive Browser Modal
  if (showDriveBrowser) {
    return (
      <div className="resources-page">
        <div className="drive-browser">
          <div className="drive-browser-header">
            <button className="back-btn" onClick={() => setShowDriveBrowser(false)}>
              ← Back
            </button>
            <h2>Browse Google Drive</h2>
          </div>

          <div className="drive-search">
            <input
              type="text"
              value={driveSearch}
              onChange={(e) => setDriveSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDriveSearch()}
              placeholder="Search in Drive..."
              className="input"
            />
            <button className="btn btn-secondary" onClick={handleDriveSearch}>
              Search
            </button>
          </div>

          <div className="drive-breadcrumb">
            {drivePath.map((item, index) => (
              <span key={index}>
                {index > 0 && <span className="breadcrumb-sep">/</span>}
                <button
                  className="breadcrumb-btn"
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {item.name}
                </button>
              </span>
            ))}
          </div>

          {driveLoading ? (
            <div className="drive-loading">Loading files...</div>
          ) : (
            <div className="drive-files-list">
              {driveFiles.length === 0 ? (
                <p className="empty-folder">No files found</p>
              ) : (
                driveFiles.map(file => (
                  <div
                    key={file.id}
                    className={`drive-file-item ${selectedDriveFiles.some(f => f.id === file.id) ? 'drive-file-item--selected' : ''}`}
                  >
                    <div
                      className="drive-file-main"
                      onClick={() => toggleFileSelection(file)}
                    >
                      <span className="drive-file-icon">
                        {getFileTypeIcon(file.fileType)}
                      </span>
                      <span className="drive-file-name">{file.name}</span>
                      {file.isFolder && <span className="folder-arrow">→</span>}
                    </div>
                    {!file.isFolder && (
                      <button
                        className="drive-file-add"
                        onClick={(e) => {
                          e.stopPropagation()
                          openAddDriveFileModal(file)
                        }}
                        title="Add with details"
                      >
                        +
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {selectedDriveFiles.length > 0 && (
            <div className="drive-selection-bar">
              <span>{selectedDriveFiles.length} file(s) selected</span>
              <button className="btn btn-primary" onClick={addSelectedDriveFiles}>
                Add Selected
              </button>
            </div>
          )}
        </div>

        {/* Add Drive File Modal */}
        {showAddDriveModal && driveFileToAdd && (
          <div className="modal-overlay" onClick={() => setShowAddDriveModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Add to Resources</h3>
              <div className="file-preview">
                <span className="file-icon">{getFileTypeIcon(driveFileToAdd.fileType)}</span>
                <span className="file-name">{driveFileToAdd.name}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={driveCategory}
                  onChange={(e) => setDriveCategory(e.target.value)}
                  className="input"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={driveTags}
                  onChange={(e) => setDriveTags(e.target.value)}
                  placeholder="kabbalah, meditation, beginner"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  value={driveNotes}
                  onChange={(e) => setDriveNotes(e.target.value)}
                  placeholder="What is this resource about?"
                  className="input"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button className="btn btn-primary" onClick={addDriveResource}>
                  Add Resource
                </button>
                <button className="btn btn-secondary" onClick={() => setShowAddDriveModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Manual Link Form
  if (showManualForm) {
    return (
      <div className="resources-page">
        <div className="resource-form">
          <h2 className="form-title">{editResource ? 'Edit Resource' : 'Add Manual Link'}</h2>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Resource title"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL</label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="input"
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              placeholder="kabbalah, video, beginner"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="What is this resource about? Why is it useful?"
              className="input"
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button
              onClick={saveManualResource}
              disabled={!formTitle.trim() || !formUrl.trim()}
              className="btn btn-primary"
            >
              {editResource ? 'Update' : 'Save'}
            </button>
            <button
              onClick={() => {
                setShowManualForm(false)
                resetForm()
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Resource Library View
  return (
    <div className="resources-page">
      {/* Add Options */}
      <div className="add-options">
        <button className="btn btn-primary" onClick={() => openManualForm()}>
          + Add Link
        </button>
        {driveConfigured && driveConnected && (
          <button className="btn btn-secondary" onClick={openDriveBrowser}>
            📁 Browse Drive
          </button>
        )}
      </div>

      {/* Drive Connection Status */}
      {driveConfigured && (
        <div className={`drive-status ${driveConnected ? 'drive-status--connected' : ''}`}>
          {driveConnected ? (
            <>
              <span className="drive-status-icon">☁</span>
              <div className="drive-status-info">
                <span className="drive-status-label">Google Drive connected</span>
                {userEmail && <span className="drive-status-email">{userEmail}</span>}
              </div>
              <button className="drive-disconnect-btn" onClick={handleDisconnectDrive}>
                Disconnect
              </button>
            </>
          ) : (
            <>
              <span className="drive-status-icon">☁</span>
              <div className="drive-status-info">
                <span className="drive-status-label">Connect Google Drive</span>
                <span className="drive-status-hint">Browse and add files directly</span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={handleConnectDrive}
                disabled={connecting}
              >
                {connecting ? 'Connecting...' : 'Connect'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="resource-filters">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search resources..."
          className="input search-input"
        />

        <div className="filter-row">
          <div className="category-tabs">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                className={`filter-tab ${filter === c.id ? 'filter-tab--active' : ''}`}
                onClick={() => setFilter(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <div className="source-tabs">
            <button
              className={`source-tab ${sourceFilter === 'all' ? 'source-tab--active' : ''}`}
              onClick={() => setSourceFilter('all')}
            >
              All Sources
            </button>
            <button
              className={`source-tab ${sourceFilter === 'drive' ? 'source-tab--active' : ''}`}
              onClick={() => setSourceFilter('drive')}
            >
              ☁ Drive
            </button>
            <button
              className={`source-tab ${sourceFilter === 'manual' ? 'source-tab--active' : ''}`}
              onClick={() => setSourceFilter('manual')}
            >
              🔗 Links
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Newest First</option>
            <option value="title">By Title</option>
            <option value="category">By Category</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="tags-row">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-chip ${searchTerm === tag ? 'tag-chip--active' : ''}`}
              onClick={() => setSearchTerm(searchTerm === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Resource List */}
      {filteredResources.length === 0 ? (
        <div className="empty-state">
          <p>No resources found.</p>
          <p className="empty-hint">
            {resources.length === 0
              ? 'Add links manually or connect Google Drive to browse files.'
              : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <div className="resources-list">
          {filteredResources.map(resource => (
            <article key={resource.id} className="resource-card">
              <div className="resource-main">
                <span className="resource-source-icon">
                  {resource.sourceType === 'drive' ? '☁' : '🔗'}
                </span>
                <div className="resource-content">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-title"
                  >
                    {resource.title}
                  </a>
                  <span className="resource-category">
                    {CATEGORIES.find(c => c.id === resource.category)?.label || resource.category}
                  </span>
                  {resource.notes && (
                    <p className="resource-notes">{resource.notes}</p>
                  )}
                  {resource.tags?.length > 0 && (
                    <div className="resource-tags">
                      {resource.tags.map(tag => (
                        <span
                          key={tag}
                          className="resource-tag"
                          onClick={() => setSearchTerm(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="resource-actions">
                <button
                  className="resource-edit-btn"
                  onClick={() => openManualForm(resource)}
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  className="resource-delete-btn"
                  onClick={() => deleteResource(resource.id)}
                  title="Delete"
                >
                  ×
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Info footer */}
      <div className="resources-footer">
        <p>
          {driveConfigured
            ? 'Connect Drive for easy browsing, or add links manually. Both work equally well.'
            : 'Add links to any resource: websites, PDFs, cloud files, videos, and more.'}
        </p>
      </div>
    </div>
  )
}

export default Resources
