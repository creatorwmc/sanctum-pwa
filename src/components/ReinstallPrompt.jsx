import { useState, useEffect } from 'react'
import './ReinstallPrompt.css'

// Increment this when the app icon changes
const CURRENT_ICON_VERSION = 2

const STORAGE_KEY = 'sanctum-icon-version'

function getStoredIconVersion() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored, 10) : 1
  } catch {
    return 1
  }
}

function setStoredIconVersion(version) {
  localStorage.setItem(STORAGE_KEY, version.toString())
}

function isInstalledPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true
}

function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(ua)) return 'ios'
  if (/android/.test(ua)) return 'android'
  return 'desktop'
}

export function shouldShowReinstallPrompt() {
  const storedVersion = getStoredIconVersion()
  const needsUpdate = storedVersion < CURRENT_ICON_VERSION
  const isInstalled = isInstalledPWA()
  
  // Only show if icon changed AND app is installed as PWA
  return needsUpdate && isInstalled
}

export function markReinstallSeen() {
  setStoredIconVersion(CURRENT_ICON_VERSION)
}

function ReinstallPrompt({ isOpen, onClose }) {
  const [deviceType, setDeviceType] = useState('desktop')

  useEffect(() => {
    setDeviceType(getDeviceType())
  }, [])

  function handleDismiss() {
    markReinstallSeen()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="reinstall-overlay" onClick={handleDismiss}>
      <div className="reinstall-modal" onClick={(e) => e.stopPropagation()}>
        <button className="reinstall-close" onClick={handleDismiss} aria-label="Close">
          ×
        </button>

        <div className="reinstall-icon">
          <img src="/pwa-192x192.png" alt="New app icon" />
        </div>

        <h2 className="reinstall-title">New App Icon!</h2>
        
        <p className="reinstall-text">
          Practice Space has a beautiful new icon. To see it on your home screen, 
          you'll need to reinstall the app.
        </p>

        <div className="reinstall-instructions">
          {deviceType === 'ios' && (
            <>
              <h3>On iPhone/iPad:</h3>
              <ol>
                <li>Delete the app from your home screen (long press, tap X)</li>
                <li>Open Safari and go to <strong>sanctum-pwa-app.netlify.app</strong></li>
                <li>Tap the Share button (square with arrow)</li>
                <li>Tap "Add to Home Screen"</li>
              </ol>
            </>
          )}
          
          {deviceType === 'android' && (
            <>
              <h3>On Android:</h3>
              <ol>
                <li>Uninstall Practice Space from your device</li>
                <li>Open Chrome and go to <strong>sanctum-pwa-app.netlify.app</strong></li>
                <li>Tap "Install" when prompted, or tap the menu (⋮) and "Install app"</li>
              </ol>
            </>
          )}
          
          {deviceType === 'desktop' && (
            <>
              <h3>To update the icon:</h3>
              <ol>
                <li>Remove the current app installation</li>
                <li>Visit <strong>sanctum-pwa-app.netlify.app</strong></li>
                <li>Click the install button in your browser's address bar</li>
              </ol>
            </>
          )}
        </div>

        <p className="reinstall-note">
          Your data is safely stored and will sync when you reinstall.
        </p>

        <div className="reinstall-actions">
          <button className="btn btn-primary" onClick={handleDismiss}>
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReinstallPrompt
