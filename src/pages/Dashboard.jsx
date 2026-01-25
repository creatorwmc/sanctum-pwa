import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db, queries } from '../db'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    streak: 0,
    todayLogged: false,
    totalSessions: 0,
    recentEntries: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    try {
      const [streak, todayLog, sessions, recentEntries] = await Promise.all([
        queries.getPracticeStreak(),
        queries.getTodayLog(),
        db.getAll('sessions'),
        queries.getRecentJournalEntries(3)
      ])

      setStats({
        streak,
        todayLogged: !!todayLog,
        totalSessions: sessions.length,
        recentEntries
      })
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="dashboard">
      <div className="greeting">
        <p className="date">{today}</p>
        <h2>Welcome back</h2>
      </div>

      <div className="quick-actions">
        <Link to="/timer" className="action-card action-card--primary">
          <span className="action-icon">◷</span>
          <span className="action-label">Start Practice</span>
        </Link>
        <Link to="/daily" className="action-card">
          <span className="action-icon">☀</span>
          <span className="action-label">
            {stats.todayLogged ? 'View Today' : 'Log Today'}
          </span>
        </Link>
        <Link to="/journal" className="action-card">
          <span className="action-icon">✎</span>
          <span className="action-label">New Entry</span>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.streak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalSessions}</span>
          <span className="stat-label">Sessions</span>
        </div>
        <div className="stat-card">
          <span className={`stat-indicator ${stats.todayLogged ? 'stat-indicator--complete' : ''}`}>
            {stats.todayLogged ? '✓' : '○'}
          </span>
          <span className="stat-label">Today</span>
        </div>
      </div>

      {stats.recentEntries.length > 0 && (
        <section className="recent-section">
          <h3 className="section-title">Recent Journal</h3>
          <div className="recent-entries">
            {stats.recentEntries.map(entry => (
              <div key={entry.id} className="entry-preview">
                <span className="entry-type">{entry.type || 'Note'}</span>
                <p className="entry-excerpt">
                  {entry.content?.substring(0, 100)}
                  {entry.content?.length > 100 ? '...' : ''}
                </p>
                <span className="entry-date">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="traditions-section">
        <h3 className="section-title">Quick Access</h3>
        <div className="tradition-links">
          <Link to="/library?tradition=BOTA" className="tradition-chip">BOTA</Link>
          <Link to="/library?tradition=Kabbalah" className="tradition-chip">Kabbalah</Link>
          <Link to="/library?tradition=Buddhism" className="tradition-chip">Buddhism</Link>
          <Link to="/library?tradition=Alchemy" className="tradition-chip">Alchemy</Link>
          <Link to="/library?tradition=Philosophy" className="tradition-chip">Philosophy</Link>
          <Link to="/library?tradition=Jedi" className="tradition-chip">Jedi</Link>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
