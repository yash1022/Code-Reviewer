import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../shared/components/Navbar.jsx'
import { useAuth } from '../shared/contexts/AuthContext.jsx'
import Landing from '../pages/Landing.jsx'
import Profile from '../pages/Profile.jsx'
import Dashboard from '../pages/Dashboard.jsx'
import ViewRepo from '../pages/ViewRepo.jsx'
import CodeDisplay from '../pages/CodeDisplay.jsx'

function App() {
  const { fetchCurrentUser } = useAuth()

  useEffect(() => {
    fetchCurrentUser().catch(() => {
      window.alert('Session expired. Please log in again.')
    })
  }, [fetchCurrentUser])

  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repos/:owner/:repo" element={<ViewRepo />} />
        <Route path="/repos/:owner/:repo/code/:path" element={<CodeDisplay />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
