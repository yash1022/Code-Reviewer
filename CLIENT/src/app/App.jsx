import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from '../shared/components/Navbar.jsx'
import { useAuth } from '../shared/contexts/AuthContext.jsx'
import Landing from '../pages/Landing.jsx'
import Profile from '../pages/Profile.jsx'

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
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
