function StoneIcon({ size = 32, className = '', glow = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {/* Outer glow */}
      {glow && (
        <ellipse
          cx="16"
          cy="17"
          rx="12"
          ry="9"
          fill="url(#stoneGlow)"
          opacity="0.6"
        />
      )}

      {/* Main stone body - smooth organic shape */}
      <path
        d="M6 18 C5 15 6 12 9 10 C12 8 15 7 19 8 C23 9 26 12 26 16 C26 20 23 23 19 24 C15 25 11 24 8 22 C6 20 5 19 6 18 Z"
        fill="url(#stoneFill)"
        stroke="var(--accent, #d4a259)"
        strokeWidth="0.5"
        opacity="0.9"
      />

      {/* Highlight - top surface reflection */}
      <ellipse
        cx="14"
        cy="13"
        rx="4"
        ry="2"
        fill="var(--text-muted, #a09080)"
        opacity="0.3"
      />

      {/* Small accent highlight */}
      <ellipse
        cx="11"
        cy="14"
        rx="1.5"
        ry="1"
        fill="var(--text-secondary, #c0b8a8)"
        opacity="0.4"
      />

      <defs>
        {/* Radial gradient for warm glow */}
        <radialGradient id="stoneGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent, #d4a259)" stopOpacity="0.4" />
          <stop offset="70%" stopColor="var(--accent, #d4a259)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--accent, #d4a259)" stopOpacity="0" />
        </radialGradient>

        {/* Gradient for stone surface */}
        <linearGradient id="stoneFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--text-muted, #6a6560)" />
          <stop offset="50%" stopColor="var(--bg-card, #1a1f1c)" />
          <stop offset="100%" stopColor="var(--bg-secondary, #141a17)" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default StoneIcon
