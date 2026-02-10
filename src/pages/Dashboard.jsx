import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db, queries } from '../db'
import RatingPrompt, { shouldShowRatingPrompt, markRatingShown } from '../components/RatingPrompt'
import FeedbackModal from '../components/FeedbackModal'
import { getStreakSettings } from '../utils/streakSettings'
import { getTraditionSettings, shouldApplyBranding } from '../components/TraditionSettings'
import { translateTerm } from '../data/traditions'
import './Dashboard.css'

// Translate a term if branding is enabled
function getTranslatedTerm(term) {
  if (shouldApplyBranding()) {
    const settings = getTraditionSettings()
    if (settings.traditionId) {
      return translateTerm(term, settings.traditionId)
    }
  }
  return term
}

function Dashboard() {
  const [stats, setStats] = useState({
    streak: 0,
    longestStreak: 0,
    bonusPoints: 0,
    storedPractices: 0,
    todayLogged: false,
    todayPracticeCount: 0,
    totalSessions: 0,
    recentEntries: []
  })
  const [loading, setLoading] = useState(true)
  const [showRating, setShowRating] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [streakEnabled, setStreakEnabled] = useState(getStreakSettings().enabled)

  useEffect(() => {
    loadDashboardData()

    // Listen for streak settings changes
    function handleStreakChange(e) {
      setStreakEnabled(e.detail.enabled)
    }
    window.addEventListener('streak-settings-changed', handleStreakChange)
    return () => window.removeEventListener('streak-settings-changed', handleStreakChange)
  }, [])

  // Check if we should show rating prompt after data loads
  useEffect(() => {
    if (!loading && shouldShowRatingPrompt()) {
      // Small delay so it doesn't feel abrupt
      const timer = setTimeout(() => {
        markRatingShown()
        setShowRating(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [loading])

  async function loadDashboardData() {
    try {
      const [streak, todayLog, sessions, recentEntries, practiceStats] = await Promise.all([
        queries.getPracticeStreak(),
        queries.getTodayLog(),
        db.getAll('sessions'),
        queries.getRecentJournalEntries(3),
        queries.getPracticeStats()
      ])

      setStats({
        streak,
        longestStreak: practiceStats.longestStreak || 0,
        bonusPoints: practiceStats.bonusPoints || 0,
        storedPractices: practiceStats.storedPractices || 0,
        todayLogged: !!todayLog,
        todayPracticeCount: todayLog?.practices?.length || 0,
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
        <h1 className="app-title">Practice Space</h1>
        <p className="app-subtitle">Your Sacred Place</p>
        <p className="date">{today}</p>
        <h2>Welcome back</h2>
      </div>

      <div className="quick-actions">
        <Link to="/timer" className="action-card action-card--primary">
          <span className="action-icon">◷</span>
          <span className="action-label">{getTranslatedTerm('Start Practice')}</span>
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

      {/* Main Stats */}
      <div className="stats-grid">
        {streakEnabled === true && (
          <>
            <div className="stat-card stat-card--streak">
              <span className="stat-icon">🔥</span>
              <span className="stat-value">{stats.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏆</span>
              <span className="stat-value">{stats.longestStreak}</span>
              <span className="stat-label">Best Streak</span>
            </div>
          </>
        )}
        <div className="stat-card">
          <span className={`stat-indicator ${stats.todayLogged ? 'stat-indicator--complete' : ''}`}>
            {stats.todayLogged ? '✓' : '○'}
          </span>
          <span className="stat-label">Today</span>
        </div>
      </div>

      {/* Resources */}
      <div className="resources-section">
        <h3 className="section-title">Your Resources</h3>
        <div className="resources-grid">
          <div className="resource-card">
            <div className="resource-header">
              <span className="resource-icon">⭐</span>
              <span className="resource-value">{stats.bonusPoints}</span>
            </div>
            <span className="resource-label">Bonus Points</span>
            <p className="resource-hint">Earned through extra practices</p>
          </div>
          <div className="resource-card">
            <div className="resource-header">
              <span className="resource-icon">🏦</span>
              <span className="resource-value">{stats.storedPractices}</span>
            </div>
            <span className="resource-label">Stored Practices</span>
            <p className="resource-hint">Banked energy for rest days</p>
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      {stats.todayLogged && (
        <div className="today-progress">
          <div className="progress-info">
            <span className="progress-number">{stats.todayPracticeCount}</span>
            <span className="progress-text">practices today</span>
          </div>
          <div className="progress-bonus">
            +{queries.calculateBonusPoints(stats.todayPracticeCount)} bonus earned
          </div>
        </div>
      )}

      <div className="stats-row">
        <div className="stat-mini">
          <span className="stat-mini-value">{stats.totalSessions}</span>
          <span className="stat-mini-label">Total Sessions</span>
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

      <RatingPrompt
        isOpen={showRating}
        onClose={() => setShowRating(false)}
        onOpenFeedback={() => setShowFeedback(true)}
      />

      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  )
}

export default Dashboard
