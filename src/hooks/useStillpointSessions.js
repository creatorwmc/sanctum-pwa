import { useEffect, useState, useCallback } from 'react'
import { auth } from '../config/firebase'

// Fetches Stillpoint meditation sessions for the authenticated PS user
// (where source_app === 'practice_space'). Joins by email, since Firebase
// Auth UIDs are scoped per-project. Hits /.netlify/functions/sync-stillpoint-sessions.
//
// Optional `since` is an ISO string; only sessions with started_at > since are returned.
export function useStillpointSessions({ enabled = true, since = null } = {}) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    if (!auth?.currentUser) {
      setError('not_signed_in')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const idToken = await auth.currentUser.getIdToken()
      const url = since
        ? `/.netlify/functions/sync-stillpoint-sessions?since=${encodeURIComponent(since)}`
        : '/.netlify/functions/sync-stillpoint-sessions'
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (err) {
      console.error('useStillpointSessions:', err)
      setError(err.message || 'sync_failed')
    } finally {
      setLoading(false)
    }
  }, [since])

  useEffect(() => {
    if (enabled) refresh()
  }, [enabled, refresh])

  return { sessions, loading, error, refresh }
}
