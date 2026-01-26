function AstragalusIcon({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      style={{ display: 'inline-block' }}
    >
      {/* Main bone body - distinctive knucklebone shape with pinched middle */}
      <path
        d="M9 10
           C7 11 6 13 7 15
           L6 17
           C5 19 6 22 9 23
           C12 24 14 23 16 22
           C18 23 20 24 23 23
           C26 22 27 19 26 17
           L25 15
           C26 13 25 11 23 10
           C20 9 18 10 16 12
           C14 10 12 9 9 10 Z"
        fill="#f5efe5"
        stroke="#c9b99a"
        strokeWidth="1"
      />

      {/* Left bulb - rounded end */}
      <ellipse
        cx="10"
        cy="16"
        rx="3.5"
        ry="5"
        fill="#faf6ee"
        stroke="#d4c4a8"
        strokeWidth="0.5"
      />

      {/* Right bulb - rounded end */}
      <ellipse
        cx="22"
        cy="16"
        rx="3.5"
        ry="5"
        fill="#faf6ee"
        stroke="#d4c4a8"
        strokeWidth="0.5"
      />

      {/* Center pinch/waist shadow */}
      <ellipse
        cx="16"
        cy="16"
        rx="2"
        ry="4"
        fill="#e8dcc8"
      />

      {/* Top highlight - left */}
      <ellipse
        cx="9"
        cy="13"
        rx="2"
        ry="1.2"
        fill="#fffef8"
        opacity="0.8"
      />

      {/* Top highlight - right */}
      <ellipse
        cx="23"
        cy="13"
        rx="2"
        ry="1.2"
        fill="#fffef8"
        opacity="0.8"
      />

      {/* Small dots/pips suggesting ancient markings */}
      <circle cx="10" cy="16" r="1" fill="#a89878" opacity="0.6" />
      <circle cx="22" cy="16" r="1" fill="#a89878" opacity="0.6" />
    </svg>
  )
}

export default AstragalusIcon
