function RavenIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {/* Mystical raven silhouette */}
      <path d="
        M8 24
        C6 24 4 22 4 20
        C4 18 5 17 6 16
        L5 14
        C5 12 6 10 8 9
        L7 7
        C7 5 9 4 11 4
        C12 4 13 4.5 14 5
        C15 4 17 3 19 3
        C22 3 24 5 25 7
        C26 7 27 8 27 9
        L26 10
        C27 11 28 12 28 14
        C28 16 27 18 25 19
        L26 20
        C26 21 25 22 24 22
        L22 22
        C21 23 19 24 17 24
        L15 28
        L14 28
        L15 24
        L12 24
        L11 27
        L10 27
        L11 24
        Z
        M12 8
        C11.5 8 11 8.5 11 9
        C11 9.5 11.5 10 12 10
        C12.5 10 13 9.5 13 9
        C13 8.5 12.5 8 12 8
        M22 10
        L24 9
        L23 11
        Z
      " />
    </svg>
  )
}

export default RavenIcon
