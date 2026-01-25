function ShaktonaIcon({ size = 24, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Upward triangle - Masculine/Fire (gold/orange) */}
      <path
        d="M12 3 L4 18 L20 18 Z"
        fill="none"
        stroke="#d4a259"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Downward triangle - Feminine/Water (blue/silver) */}
      <path
        d="M12 21 L4 6 L20 6 Z"
        fill="none"
        stroke="#a8b4c4"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Top tip accent - gold triangle (masculine reaching to heaven) */}
      <path
        d="M12 2 L10.5 5 L13.5 5 Z"
        fill="#d4a259"
      />

      {/* Bottom tip accent - silver/blue triangle (feminine reaching to earth) */}
      <path
        d="M12 22 L10.5 19 L13.5 19 Z"
        fill="#a8b4c4"
      />

      {/* Central spark - union point */}
      <circle
        cx="12"
        cy="12"
        r="2"
        fill="#d4a259"
      />
      <circle
        cx="12"
        cy="12"
        r="1"
        fill="#fff8e7"
      />
    </svg>
  )
}

export default ShaktonaIcon
