function RavenIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {/* Simple raven head and body silhouette */}
      <path
        d="M6 22 C4 20 4 17 6 14 C7 11 10 9 13 8 C14 7 15 6 17 6 C19 6 21 7 22 8 L26 6 L24 10 C25 11 26 13 26 15 C26 18 24 21 21 23 C18 25 14 26 10 25 C8 25 7 24 6 22 Z"
        fill="currentColor"
      />
      {/* Eye */}
      <circle cx="18" cy="12" r="1.5" fill="var(--bg-primary, #0d1210)" />
    </svg>
  )
}

export default RavenIcon
