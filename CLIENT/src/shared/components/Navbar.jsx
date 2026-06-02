import { Link } from 'react-router-dom'
import './Navbar.css'
import { useAuth } from '../contexts/AuthContext.jsx'

function Navbar() {
  const { user, isLoading, loginWithGithub, logout } = useAuth()

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div className="brand">
          <span className="brand-mark"></span>
          <span>Code Reviewer</span>
        </div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#">Pricing</a>
          <a href="#">Docs</a>
        </nav>
        {user ? (
          <div className="nav-actions">
            <Link className="user-chip" to="/profile">
              {user.Name ?? 'Profile'}
            </Link>
            <button
              className="github-button logout-button"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className="github-button"
            type="button"
            onClick={loginWithGithub}
            disabled={isLoading}
          >
            <span className="github-icon" aria-hidden="true"></span>
            {isLoading ? 'Connecting...' : 'Login with GitHub'}
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
