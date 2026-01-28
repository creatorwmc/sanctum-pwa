import { useState, useEffect } from 'react'
import './HelperPrompt.css'

function HelperPrompt({ text, type = 'primary', show = false, personality = null }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      // Small delay before showing for smoother animation
      const timer = setTimeout(() => setVisible(true), 50)
      return () => clearTimeout(timer)
    } else {
      setVisible(false)
    }
  }, [show])

  if (!show && !visible) return null

  const personalityClass = personality ? `personality-${personality}` : ''

  return (
    <div className={`helper-prompt helper-${type} ${visible ? 'show' : ''} ${personalityClass}`}>
      {text}
    </div>
  )
}

export default HelperPrompt
