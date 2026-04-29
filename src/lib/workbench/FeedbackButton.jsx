// The Workbench — Tell Zach about this
//
// Vendored React component for ecosystem apps. Drops a floating
// "Tell Zach about this" button into the bottom-right of the host app.
// On submit, POSTs to a server-side endpoint (typically Kairos's
// /.netlify/functions/workbench-submit) which writes to the-workbench
// Firestore via service account.
//
// Host integration:
//   <FeedbackButton
//     appId="kairos"
//     appName="Kairos"
//     getIdToken={() => auth.currentUser?.getIdToken()}
//     user={user}                     // { email, displayName }
//     endpoint="https://kairos-pwa.netlify.app/.netlify/functions/workbench-submit"
//   />
//
// The host app's CSS variables (or theme) drive the button's surface.
// Override colors with the `accent` and `surface` props if needed.

import { useEffect, useRef, useState } from 'react'

const TAGS = ['Bug', 'Feature', 'Question', 'Wishlist']

// Capture recent console errors for context. The host app should mount
// this component at root level so the listener catches errors from anywhere.
const recentErrors = []
let listenersInstalled = false

function installErrorListeners() {
  if (listenersInstalled) return
  listenersInstalled = true
  window.addEventListener('error', (e) => {
    recentErrors.push({ at: Date.now(), kind: 'error', message: e.message, source: e.filename })
    if (recentErrors.length > 20) recentErrors.shift()
  })
  window.addEventListener('unhandledrejection', (e) => {
    recentErrors.push({ at: Date.now(), kind: 'rejection', message: String(e.reason) })
    if (recentErrors.length > 20) recentErrors.shift()
  })
}

function getRecentErrors(maxAgeMs = 60_000) {
  const cutoff = Date.now() - maxAgeMs
  return recentErrors.filter((e) => e.at >= cutoff)
}

export default function FeedbackButton({
  appId,
  appName,
  endpoint = '/.netlify/functions/workbench-submit',
  notificationsEndpoint,
  getIdToken,
  user,
  // Visual overrides — defaults work against most dark surfaces.
  accent = 'rgba(184, 160, 96, 0.95)', // workbench iron / brass
  surface = 'rgba(25, 28, 31, 0.95)',
  textColor = '#e0dcd0',
  position = { right: '20px', bottom: '20px' },
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [tags, setTags] = useState([])
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState(null)
  const [notes, setNotes] = useState([])
  const textareaRef = useRef(null)

  // Derive notifications endpoint from the submit endpoint by swapping the
  // last path segment. Host apps can override via `notificationsEndpoint`.
  const notifsUrl = notificationsEndpoint || endpoint.replace(/\/[^/]+$/, '/workbench-notifications')

  useEffect(() => {
    installErrorListeners()
  }, [])

  // Cmd/Ctrl + . opens the modal from anywhere
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (isOpen) {
      setDone(false)
      setError(null)
      // Focus textarea once mounted
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [isOpen])

  // Fetch unread closure_notes for this user once we have an ID token.
  // Failures are silent — the floating button works fine without notes.
  useEffect(() => {
    if (!getIdToken || !user) return
    let cancelled = false
    async function fetchNotes() {
      try {
        const idToken = await getIdToken()
        if (!idToken || cancelled) return
        const res = await fetch(notifsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ action: 'list' }),
        })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && Array.isArray(data?.notes)) setNotes(data.notes)
      } catch {
        // ignore — notifications are non-critical
      }
    }
    fetchNotes()
    return () => { cancelled = true }
  }, [getIdToken, user, notifsUrl])

  async function dismissNote(noteId) {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    try {
      const idToken = getIdToken ? await getIdToken() : null
      if (!idToken) return
      await fetch(notifsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ action: 'dismiss', note_ids: [noteId] }),
      })
    } catch {
      // Local dismiss already happened — server-side resync on next mount
    }
  }

  function toggleTag(t) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]))
  }

  async function handleSubmit() {
    setError(null)
    setBusy(true)
    try {
      const idToken = getIdToken ? await getIdToken() : null
      if (!idToken) {
        throw new Error('Not signed in. Sign in before sending feedback.')
      }
      const body = {
        app_id: appId,
        app_name: appName,
        user_email: user?.email || null,
        user_display_name: user?.displayName || null,
        user_comment: comment.trim() || null,
        user_tags: tags,
        app_route: typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : null,
        device_info: {
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          viewport_width: typeof window !== 'undefined' ? window.innerWidth : null,
          viewport_height: typeof window !== 'undefined' ? window.innerHeight : null,
          is_mobile: typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent),
        },
        error_state: {
          recent_errors: getRecentErrors(),
        },
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
          'X-App-Source': appId,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        throw new Error(errBody.error || `Submit failed (${res.status})`)
      }
      setDone(true)
      setComment('')
      setTags([])
      setTimeout(() => setIsOpen(false), 1500)
    } catch (err) {
      console.error('Workbench submit failed:', err)
      setError(err.message || 'Send failed')
    } finally {
      setBusy(false)
    }
  }

  // Don't render the floating button until the user is signed in. Host apps
  // commonly mount this at the root and want it hidden on login screens.
  const canSubmit = !!user && !!getIdToken

  // Top-most note in the stack. We show one at a time so the panel
  // stays compact; dismissing reveals the next.
  const currentNote = canSubmit && notes.length > 0 ? notes[0] : null

  return (
    <>
      {/* Notification panel — pinned just above the floating button */}
      {currentNote && (
        <div
          style={{
            position: 'fixed',
            right: position.right,
            bottom: `calc(${position.bottom} + 56px)`,
            zIndex: 8999,
            width: 'min(340px, calc(100vw - 40px))',
            background: surface,
            color: textColor,
            border: `1px solid ${accent}`,
            borderRadius: '12px',
            padding: '12px 14px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            From Zach · {currentNote.disposition === 'deleted' ? 'request removed' : currentNote.disposition?.replace('_', ' ') || 'update'}
            {notes.length > 1 ? ` · 1 of ${notes.length}` : ''}
          </div>
          {currentNote.original_comment_summary && (
            <div style={{ fontSize: '11px', opacity: 0.55, marginBottom: '8px', fontStyle: 'italic', lineHeight: 1.4 }}>
              re: "{currentNote.original_comment_summary}{currentNote.original_comment_summary.length >= 200 ? '…' : ''}"
            </div>
          )}
          <div style={{ fontSize: '13px', lineHeight: 1.45, whiteSpace: 'pre-wrap', marginBottom: '10px' }}>
            {currentNote.developer_note}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              onClick={() => dismissNote(currentNote.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                background: accent,
                color: '#1a1a1a',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      {canSubmit && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Tell Zach about this"
          title="Tell Zach about this — Ctrl+."
          style={{
            position: 'fixed',
            ...position,
            zIndex: 9000,
            width: '44px',
            height: '44px',
            borderRadius: '999px',
            background: surface,
            color: accent,
            border: `1px solid ${accent}`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            cursor: 'pointer',
            opacity: 0.6,
            transition: 'opacity 0.15s ease, transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.6'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            {/* Wrench */}
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div
          onClick={() => !busy && setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9100,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: '0 12px 12px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              background: surface,
              border: `1px solid ${accent}`,
              borderRadius: '14px',
              padding: '18px',
              color: textColor,
              fontFamily: 'inherit',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              maxHeight: '88dvh',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>Tell Zach about this</div>
                <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '2px' }}>
                  {appName} · {user?.email}
                </div>
              </div>
              <button
                onClick={() => !busy && setIsOpen(false)}
                aria-label="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: textColor,
                  fontSize: '20px',
                  cursor: 'pointer',
                  opacity: 0.6,
                  padding: '4px 8px',
                }}
              >
                ×
              </button>
            </div>

            {!done && (
              <>
                <textarea
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What's up? A bug, a thought, something you'd change…"
                  rows={5}
                  disabled={busy}
                  style={{
                    width: '100%',
                    marginTop: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: textColor,
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                  {TAGS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      disabled={busy}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '999px',
                        background: tags.includes(t) ? accent : 'transparent',
                        color: tags.includes(t) ? '#1a1a1a' : textColor,
                        border: `1px solid ${tags.includes(t) ? accent : 'rgba(255,255,255,0.18)'}`,
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {error && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'rgba(184, 90, 74, 0.12)',
                    border: '1px solid rgba(184, 90, 74, 0.5)',
                    color: '#e8a89a',
                    fontSize: '12px',
                  }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => !busy && setIsOpen(false)}
                    disabled={busy}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: textColor,
                      fontSize: '13px',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={busy || (!comment.trim() && tags.length === 0)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      background: accent,
                      color: '#1a1a1a',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: busy ? 'wait' : 'pointer',
                      opacity: busy || (!comment.trim() && tags.length === 0) ? 0.6 : 1,
                      fontFamily: 'inherit',
                    }}
                  >
                    {busy ? 'Sending…' : 'Send to Zach'}
                  </button>
                </div>
              </>
            )}

            {done && (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>Sent.</div>
                <div style={{ fontSize: '12px', opacity: 0.6 }}>
                  Zach will see this in The Workbench.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
