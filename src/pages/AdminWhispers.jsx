import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  isUserAdmin,
  getAllWhispers,
  markWhisperRead,
  deleteWhisper
} from '../services/adminService'
import './AdminWhispers.css'

function AdminWhispers() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [whispers, setWhispers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, read

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
      await loadWhispers()
    }

    setLoading(false)
  }

  async function loadWhispers() {
    const allWhispers = await getAllWhispers()
    setWhispers(allWhispers)
  }

  async function handleMarkRead(whisperId, read) {
    await markWhisperRead(whisperId, read)
    setWhispers(prev =>
      prev.map(w => w.id === whisperId ? { ...w, read } : w)
    )
  }

  async function handleDelete(whisperId) {
    if (!confirm('Delete this whisper permanently?')) return

    await deleteWhisper(whisperId)
    setWhispers(prev => prev.filter(w => w.id !== whisperId))
  }

  const filteredWhispers = whispers.filter(w => {
    if (filter === 'unread') return !w.read
    if (filter === 'read') return w.read
    return true
  })

  const unreadCount = whispers.filter(w => !w.read).length

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <header className="admin-header">
          <Link to="/settings" className="admin-back">← Settings</Link>
          <h1>Admin Access Required</h1>
        </header>
        <div className="admin-message">
          <p>Please sign in to access the admin panel.</p>
          <Link to="/settings" className="btn btn-primary">Go to Settings</Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="admin-page">
        <header className="admin-header">
          <Link to="/settings" className="admin-back">← Settings</Link>
          <h1>Access Denied</h1>
        </header>
        <div className="admin-message">
          <p>You don't have admin privileges.</p>
          <p className="admin-hint">
            If you should have admin access, ask an existing admin to add your user ID:
          </p>
          <code className="user-id">{user.uid}</code>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link to="/settings" className="admin-back">← Settings</Link>
        <h1>Whispers</h1>
        <p className="admin-subtitle">
          {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        </p>
      </header>

      <div className="admin-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({whispers.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'filter-btn--active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({whispers.length - unreadCount})
        </button>
      </div>

      {filteredWhispers.length === 0 ? (
        <div className="admin-empty">
          <p>No whispers {filter !== 'all' ? `(${filter})` : 'yet'}</p>
        </div>
      ) : (
        <div className="whispers-list">
          {filteredWhispers.map(whisper => (
            <div
              key={whisper.id}
              className={`whisper-card ${!whisper.read ? 'whisper-card--unread' : ''}`}
            >
              <div className="whisper-header">
                <span className="whisper-from">
                  {whisper.name || whisper.userName || 'Anonymous'}
                </span>
                <span className="whisper-section">
                  {whisper.section || 'General'}
                </span>
              </div>

              <div className="whisper-message">
                {whisper.message}
              </div>

              <div className="whisper-meta">
                <span className="whisper-time">
                  {whisper.timestamp?.toDate
                    ? whisper.timestamp.toDate().toLocaleString()
                    : new Date(whisper.timestamp).toLocaleString()}
                </span>
                {whisper.userEmail && (
                  <span className="whisper-email">{whisper.userEmail}</span>
                )}
              </div>

              <div className="whisper-actions">
                <button
                  className="whisper-action"
                  onClick={() => handleMarkRead(whisper.id, !whisper.read)}
                >
                  {whisper.read ? 'Mark Unread' : 'Mark Read'}
                </button>
                <button
                  className="whisper-action whisper-action--delete"
                  onClick={() => handleDelete(whisper.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-refresh">
        <button className="btn btn-secondary" onClick={loadWhispers}>
          Refresh
        </button>
      </div>
    </div>
  )
}

export default AdminWhispers
