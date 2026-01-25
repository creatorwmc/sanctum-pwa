import { NavLink, useLocation } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { path: '/', label: 'Home', icon: '⌂' },
  { path: '/timer', label: 'Timer', icon: '◷' },
  { path: '/daily', label: 'Daily', icon: '☀' },
  { path: '/journal', label: 'Journal', icon: '✎' },
  { path: '/library', label: 'Library', icon: '▤' },
  { path: '/links', label: 'Links', icon: '⛓' },
  { path: '/calendar', label: 'Calendar', icon: '▦' }
]

function Layout({ children }) {
  const location = useLocation()

  // Get current page title
  const currentPage = navItems.find(item => item.path === location.pathname)
  const pageTitle = currentPage?.label || 'Sanctum'

  return (
    <div className="layout">
      <header className="header">
        <h1 className="header-title">{pageTitle}</h1>
      </header>

      <main className="main-content">
        {children}
      </main>

      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item--active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Layout
