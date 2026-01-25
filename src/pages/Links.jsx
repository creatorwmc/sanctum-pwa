import { useState, useEffect } from 'react'
import { db } from '../db'
import './Links.css'

function Links() {
  const [links, setLinks] = useState([])
  const [allTags, setAllTags] = useState([])
  const [filterTag, setFilterTag] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form state
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    loadLinks()
  }, [])

  async function loadLinks() {
    try {
      const allLinks = await db.getAll('links')
      const sorted = allLinks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setLinks(sorted)

      // Extract all unique tags
      const tagSet = new Set()
      sorted.forEach(link => {
        link.tags?.forEach(tag => tagSet.add(tag))
      })
      setAllTags(Array.from(tagSet).sort())
    } catch (error) {
      console.error('Error loading links:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveLink() {
    if (!url.trim() || !title.trim()) return

    try {
      const tagArray = tags
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(t => t)

      await db.add('links', {
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
        tags: tagArray
      })

      await loadLinks()
      resetForm()
    } catch (error) {
      console.error('Error saving link:', error)
    }
  }

  async function deleteLink(id) {
    if (confirm('Delete this link?')) {
      try {
        await db.delete('links', id)
        await loadLinks()
      } catch (error) {
        console.error('Error deleting link:', error)
      }
    }
  }

  function resetForm() {
    setShowForm(false)
    setUrl('')
    setTitle('')
    setDescription('')
    setTags('')
  }

  const filteredLinks = filterTag
    ? links.filter(l => l.tags?.includes(filterTag))
    : links

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="links-page">
      {!showForm ? (
        <>
          <div className="links-header">
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              + Add Link
            </button>
          </div>

          {allTags.length > 0 && (
            <div className="tags-filter">
              <button
                onClick={() => setFilterTag(null)}
                className={`tag-btn ${!filterTag ? 'tag-btn--active' : ''}`}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setFilterTag(tag)}
                  className={`tag-btn ${filterTag === tag ? 'tag-btn--active' : ''}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {filteredLinks.length === 0 ? (
            <div className="empty-state">
              <p>No links saved yet.</p>
              <p className="empty-hint">Add research links and resources.</p>
            </div>
          ) : (
            <div className="links-list">
              {filteredLinks.map(link => (
                <article key={link.id} className="link-card">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-title"
                  >
                    {link.title}
                  </a>
                  <span className="link-url">{new URL(link.url).hostname}</span>
                  {link.description && (
                    <p className="link-description">{link.description}</p>
                  )}
                  {link.tags?.length > 0 && (
                    <div className="link-tags">
                      {link.tags.map(tag => (
                        <span
                          key={tag}
                          className="link-tag"
                          onClick={() => setFilterTag(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="link-delete"
                    aria-label="Delete link"
                  >
                    ×
                  </button>
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="link-form">
          <h2 className="form-title">Add Link</h2>

          <div className="form-group">
            <label className="form-label">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Link title"
              className="input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why is this useful?"
              className="input"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="kabbalah, tree of life, meditation"
              className="input"
            />
          </div>

          <div className="form-actions">
            <button
              onClick={saveLink}
              disabled={!url.trim() || !title.trim()}
              className="btn btn-primary"
            >
              Save Link
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

export default Links
