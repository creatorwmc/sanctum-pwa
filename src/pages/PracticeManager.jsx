import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { queries } from '../db'
import ShaktonaIcon from '../components/ShaktonaIcon'
import './PracticeManager.css'

// Common emoji options for practice icons
const EMOJI_OPTIONS = [
  '💧', '🧘', '⚱', '🌬', '📖', '✎', '🌱', '🎴', '🕯',
  '🔥', '🌙', '☀', '⭐', '🌿', '🍃', '🌸', '💎', '🔮',
  '🎵', '🎨', '💪', '🧠', '❤️', '🙏', '✨', '🌊', '⚡'
]

function PracticeManager() {
  const [practices, setPractices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPractice, setEditingPractice] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    label: '',
    icon: '✨',
    description: '',
    examples: ['', '', '']
  })

  useEffect(() => {
    loadPractices()
  }, [])

  async function loadPractices() {
    try {
      const data = await queries.getPractices()
      setPractices(data)
    } catch (error) {
      console.error('Error loading practices:', error)
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      label: '',
      icon: '✨',
      description: '',
      examples: ['', '', '']
    })
  }

  function openAddModal() {
    resetForm()
    setEditingPractice(null)
    setShowAddModal(true)
  }

  function openEditModal(practice) {
    setFormData({
      label: practice.label,
      icon: practice.icon,
      description: practice.description || '',
      examples: practice.examples?.length ? [...practice.examples, '', '', ''].slice(0, 3) : ['', '', '']
    })
    setEditingPractice(practice)
    setShowAddModal(true)
  }

  function closeModal() {
    setShowAddModal(false)
    setEditingPractice(null)
    resetForm()
  }

  async function handleSave() {
    const trimmedExamples = formData.examples.filter(e => e.trim())

    if (!formData.label.trim()) {
      alert('Please enter a practice name')
      return
    }

    try {
      if (editingPractice) {
        await queries.updatePractice(editingPractice.id, {
          label: formData.label.trim(),
          icon: formData.icon,
          description: formData.description.trim(),
          examples: trimmedExamples
        })
      } else {
        await queries.addPractice({
          label: formData.label.trim(),
          icon: formData.icon,
          description: formData.description.trim(),
          examples: trimmedExamples
        })
      }

      await loadPractices()
      closeModal()
    } catch (error) {
      console.error('Error saving practice:', error)
    }
  }

  async function handleToggle(practice) {
    try {
      await queries.togglePractice(practice.id)
      await loadPractices()
    } catch (error) {
      console.error('Error toggling practice:', error)
    }
  }

  async function handleDelete(practice) {
    const message = practice.isDefault
      ? `Disable "${practice.label}"? You can re-enable it later.`
      : `Delete "${practice.label}"? This cannot be undone.`

    if (!confirm(message)) return

    try {
      await queries.deletePractice(practice.id)
      await loadPractices()
    } catch (error) {
      console.error('Error deleting practice:', error)
    }
  }

  async function handleReset() {
    if (!confirm('Reset all practices to defaults? This will remove any custom practices.')) return

    try {
      await queries.resetPractices()
      await loadPractices()
    } catch (error) {
      console.error('Error resetting practices:', error)
    }
  }

  // Drag and drop handlers
  function handleDragStart(e, practice) {
    setDraggedItem(practice)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  async function handleDrop(e, targetPractice) {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetPractice.id) return

    const newOrder = practices.map(p => p.id)
    const draggedIdx = newOrder.indexOf(draggedItem.id)
    const targetIdx = newOrder.indexOf(targetPractice.id)

    newOrder.splice(draggedIdx, 1)
    newOrder.splice(targetIdx, 0, draggedItem.id)

    try {
      await queries.reorderPractices(newOrder)
      await loadPractices()
    } catch (error) {
      console.error('Error reordering practices:', error)
    }

    setDraggedItem(null)
  }

  function handleDragEnd() {
    setDraggedItem(null)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  const enabledCount = practices.filter(p => p.enabled !== false).length

  return (
    <div className="practice-manager">
      <header className="pm-header">
        <Link to="/settings" className="pm-back">← Settings</Link>
        <h1>Manage Practices</h1>
        <p className="pm-subtitle">
          {enabledCount} of {practices.length} practices enabled
        </p>
      </header>

      <div className="pm-actions">
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Practice
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>

      <div className="pm-list">
        {practices.map(practice => (
          <div
            key={practice.id}
            className={`pm-item ${practice.enabled === false ? 'pm-item--disabled' : ''} ${draggedItem?.id === practice.id ? 'pm-item--dragging' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, practice)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, practice)}
            onDragEnd={handleDragEnd}
          >
            <div className="pm-item-drag">⋮⋮</div>

            <div className="pm-item-icon">
              {practice.icon === 'shatkona' ? <ShaktonaIcon size={24} /> : practice.icon}
            </div>

            <div className="pm-item-content">
              <div className="pm-item-label">
                {practice.label}
                {practice.isDefault && <span className="pm-badge">Default</span>}
                {!practice.isDefault && <span className="pm-badge pm-badge--custom">Custom</span>}
              </div>
              {practice.description && (
                <div className="pm-item-desc">{practice.description}</div>
              )}
            </div>

            <div className="pm-item-actions">
              <button
                className={`pm-toggle ${practice.enabled !== false ? 'pm-toggle--on' : ''}`}
                onClick={() => handleToggle(practice)}
                title={practice.enabled !== false ? 'Disable' : 'Enable'}
              >
                {practice.enabled !== false ? '✓' : '○'}
              </button>

              <button
                className="pm-edit"
                onClick={() => openEditModal(practice)}
                title="Edit"
              >
                ✎
              </button>

              <button
                className="pm-delete"
                onClick={() => handleDelete(practice)}
                title={practice.isDefault ? 'Disable' : 'Delete'}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="pm-hint">
        Drag practices to reorder. Disabled practices won't appear in your daily log.
      </p>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content pm-modal" onClick={e => e.stopPropagation()}>
            <h3>{editingPractice ? 'Edit Practice' : 'Add Practice'}</h3>

            <div className="pm-form">
              <label className="pm-label">Name</label>
              <input
                type="text"
                className="input"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Morning Ritual"
              />

              <label className="pm-label">Icon</label>
              <div className="pm-icon-picker">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className={`pm-icon-option ${formData.icon === emoji ? 'pm-icon-option--selected' : ''}`}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <label className="pm-label">Description (optional)</label>
              <input
                type="text"
                className="input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this practice"
              />

              <label className="pm-label">Examples (optional)</label>
              {formData.examples.map((example, idx) => (
                <input
                  key={idx}
                  type="text"
                  className="input pm-example-input"
                  value={example}
                  onChange={(e) => {
                    const newExamples = [...formData.examples]
                    newExamples[idx] = e.target.value
                    setFormData({ ...formData, examples: newExamples })
                  }}
                  placeholder={`Example ${idx + 1}`}
                />
              ))}
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleSave}>
                {editingPractice ? 'Save Changes' : 'Add Practice'}
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default PracticeManager
