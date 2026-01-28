import { useState, useEffect } from 'react'
import './GraceMessage.css'

function GraceMessage({ message, type = 'info', show = false, duration = 4000, onHide }) {
  const [visible, setVisible] = useState(false)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (show && message) {
      setVisible(true)
      setFading(false)

      // Auto-fade after duration
      const fadeTimer = setTimeout(() => {
        setFading(true)
      }, duration - 500)

      // Hide after fade
      const hideTimer = setTimeout(() => {
        setVisible(false)
        setFading(false)
        if (onHide) onHide()
      }, duration)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    } else {
      setVisible(false)
      setFading(false)
    }
  }, [show, message, duration, onHide])

  if (!visible) return null

  return (
    <div className={`grace-message grace-${type} ${fading ? 'fade-out' : 'fade-in'}`}>
      {message}
    </div>
  )
}

export default GraceMessage
