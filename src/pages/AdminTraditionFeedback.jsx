import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  isUserAdmin,
  getAllTraditionFeedback,
  updateTraditionFeedbackStatus,
  deleteTraditionFeedback
} from '../services/adminService'
import './AdminWhispers.css'

const STATUS_OPTIONS = [
  { id: 'new', label: 'New', color: '#3498db' },
  { id: 'reviewing', label: 'Reviewing', color: '#f39c12' },
  { id: 'implemented', label: 'Implemented', color: '#27ae60' },
  { id: 'rejected', label: 'Rejected', color: '#95a5a6' }
]

const TYPE_LABELS = {
  practice: 'Practice',
  prompt: 'Journaling Prompt',
  calendar: 'Calendar',
  terminology: 'Terminology',
  missing: 'Missing Content',
  accuracy: 'Accuracy',
  other: 'Other'
}

function AdminTraditionFeedback() {
  const { user, isAuthenticated } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterTradition, setFilterTradition] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    checkAdminAndLoad()
  }, [user])

  async function checkAdminAndLoad() {
    if (!user) {
      setLoading(false)
      return
    }

    const adminStatus = await isUserAdmin(user.uid)
    setIsAdmin(adminStatus)

    if (adminStatus) {
      await loadFeedback()
    }
    setLoading(false)
  }

  async function loadFeedback() {
    const all = await getAllTraditionFeedback()
    setFeedback(all)
  }

  async function handleStatusChange(id, newStatus) {
    await updateTraditionFeedbackStatus(id, newStatus)
    setFeedback(prev =>
      prev.map(f => f.id === id ? { ...f, status: newStatus } : f)
    )
  }

  async function handleDelete(id) {
    if (!confirm('Delete this feedback permanently?')) return
    await deleteTraditionFeedback(id)
    setFeedback(prev => prev.filter(f => f.id !== id))
  }

  async function handleRefresh() {
    setLoading(true)
    await loadFeedback()
    setLoading(false)
  }

  const filteredFeedback = feedback.filter(f => {
    if (filterTradition !== 'all' && f.traditionId !== filterTradition) return false
    if (filterType !== 'all' && f.contentType !== filterType) return false
    if (filterStatus !== 'all' && (f.status || 'new') !== filterStatus) return false
    return true
  })

  const traditions = [...new Set(feedback.map(f => f.traditionId).filter(Boolean))]
  const types = [...new Set(feedback.map(f => f.contentType).filter(Boolean))]

  // Stats
  const stats = {
    total: feedback.length,
    new: feedback.filter(f => !f.status || f.status === 'new').length,
    reviewing: feedback.filter(f => f.status === 'reviewing').length,
    implemented: feedback.filter(f => f.status === 'implemented').length
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="admin-denied">
          <h2>Sign In Required</h2>
          <p>Please sign in to access the admin panel.</p>
          <Link to="/settings" className="btn btn-primary">Go to Settings</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-denied">
          <h2>Access Denied</h2>
          <p>You don't have admin privileges.</p>
          <p className="admin-user-id">Your User ID: {user?.uid}</p>
          <Link to="/settings" className="btn btn-secondary">Back to Settings</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/settings" className="admin-back">&larr; Settings</Link>
        <h1>Tradition Feedback</h1>
        <p className="admin-subtitle">
          {stats.total} submissions ({stats.new} new)
        </p>
      </header>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-value">{stats.new}</span>
          <span className="admin-stat-label">New</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{stats.reviewing}</span>
          <span className="admin-stat-label">Reviewing</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-value">{stats.implemented}</span>
          <span className="admin-stat-label">Implemented</span>
        </div>
      </div>

      <div className="admin-filters">
        <select
          value={filterTradition}
          onChange={e => setFilterTradition(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Traditions</option>
          {traditions.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Types</option>
          {types.map(t => (
            <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Status</option>
          {STATUS_OPTIONS.map(s => (
            <option key={s.id} value={s.id}>{s.label}</option>
          ))}
        </select>

        <button onClick={handleRefresh} className="admin-refresh-btn">
          ↻ Refresh
        </button>
      </div>

      <div className="whispers-list">
        {filteredFeedback.length === 0 ? (
          <div className="admin-empty">
            <p>No feedback found matching the current filters.</p>
          </div>
        ) : (
          filteredFeedback.map(item => (
            <div key={item.id} className="whisper-card">
              <div className="whisper-header">
                <span className="whisper-from">
                  {item.traditionName || item.traditionId || 'Unknown Tradition'}
                </span>
                <span className="whisper-section">
                  {TYPE_LABELS[item.contentType] || item.contentType || 'General'}
                </span>
              </div>

              {item.contentText && (
                <div className="feedback-context-quote">
                  <span className="quote-label">Re:</span>
                  <span className="quote-text">{item.contentText}</span>
                </div>
              )}

              <div className="whisper-message">{item.message}</div>

              <div className="whisper-meta">
                <span>
                  {item.timestamp?.toDate
                    ? item.timestamp.toDate().toLocaleString()
                    : new Date(item.timestamp).toLocaleString()}
                </span>
                {item.userEmail && <span>{item.userEmail}</span>}
                {item.userDisplayName && <span>({item.userDisplayName})</span>}
              </div>

              <div className="whisper-actions">
                <select
                  value={item.status || 'new'}
                  onChange={e => handleStatusChange(item.id, e.target.value)}
                  className="status-select"
                  style={{
                    borderColor: STATUS_OPTIONS.find(s => s.id === (item.status || 'new'))?.color
                  }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>

                <button
                  className="whisper-action whisper-action--delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminTraditionFeedback
