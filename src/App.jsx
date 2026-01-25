import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Timer from './pages/Timer'
import Library from './pages/Library'
import Links from './pages/Links'
import DailyLog from './pages/DailyLog'
import Calendar from './pages/Calendar'
import Journal from './pages/Journal'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/library" element={<Library />} />
        <Route path="/links" element={<Links />} />
        <Route path="/daily" element={<DailyLog />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/journal" element={<Journal />} />
      </Routes>
    </Layout>
  )
}

export default App
