import { useAuth } from '../contexts/AuthContext'
import { useBroadcasts } from '../lib/broadcasts'

const wrap = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 16,
}

const item = {
  position: 'relative',
  padding: '10px 36px 10px 14px',
  borderRadius: 8,
  fontSize: 14,
  lineHeight: 1.4,
  background: 'var(--theme-surface, rgba(255, 255, 255, 0.05))',
  border: '1px solid var(--theme-border, rgba(255, 255, 255, 0.15))',
  color: 'inherit',
}

const dismissBtn = {
  position: 'absolute',
  top: 4,
  right: 8,
  background: 'transparent',
  border: 'none',
  padding: 4,
  cursor: 'pointer',
  color: 'inherit',
  opacity: 0.55,
  fontSize: 18,
  lineHeight: 1,
}

export default function BroadcastBanner() {
  const { user } = useAuth()
  const { items, dismiss } = useBroadcasts(user)
  if (!items.length) return null

  return (
    <div style={wrap}>
      {items.map((b) => (
        <div key={b.id} style={item}>
          {b.body}
          <button
            type="button"
            onClick={() => dismiss(b.id)}
            aria-label="Dismiss"
            style={dismissBtn}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
