function HomeIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {/* Gradient glow background */}
      <circle cx="16" cy="16" r="11" fill="url(#homeGlow)" opacity="0.15"/>
      {/* 3 Concentric Circles */}
      <circle cx="16" cy="16" r="12.5" fill="none" stroke="var(--accent, #d4af37)" strokeWidth="1" opacity="0.4"/>
      <circle cx="16" cy="16" r="8.75" fill="none" stroke="var(--accent, #d4af37)" strokeWidth="1.25" opacity="0.65"/>
      <circle cx="16" cy="16" r="5" fill="none" stroke="var(--accent, #d4af37)" strokeWidth="1.5" opacity="0.85"/>
      {/* Center glowing dot */}
      <circle cx="16" cy="16" r="1.5" fill="var(--accent, #d4af37)" opacity="0.3"/>
      <circle cx="16" cy="16" r="1" fill="#ffd700"/>
      <circle cx="16" cy="16" r="0.5" fill="#ffffff"/>

      <defs>
        <radialGradient id="homeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd700"/>
          <stop offset="60%" stopColor="#d4af37"/>
          <stop offset="100%" stopColor="#b8860b" stopOpacity="0.3"/>
        </radialGradient>
      </defs>
    </svg>
  )
}

export default HomeIcon
