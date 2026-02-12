import { Link } from 'react-router-dom'
import TraditionSettings from '../components/TraditionSettings'
import './Settings.css'

function TraditionSettingsPage() {
  return (
    <div className="settings-page">
      <div className="settings-back-header">
        <Link to="/settings" className="settings-back-link">
          <span>←</span>
          <span>Settings</span>
        </Link>
        <h1 className="settings-page-title">Your Tradition</h1>
      </div>

      <TraditionSettings />
    </div>
  )
}

export default TraditionSettingsPage
