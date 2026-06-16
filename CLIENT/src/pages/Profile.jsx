import { useAuth } from '../shared/contexts/useAuth.js'
import './Profile.css'

function Profile() {
  const { user, isLoading, loginWithGithub } = useAuth()

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Profile</h1>
        {user ? (
          <div className="profile-card">
            <p className="profile-label">Signed in as</p>
            <p className="profile-name">{user.Name ?? 'User'}</p>
            <p className="profile-email">{user.Email ?? 'Email not available'}</p>
          </div>
        ) : (
          <div className="profile-card">
            <p className="profile-label">
              You are not signed in. Log in to view your profile.
            </p>
            <button
              className="btn-primary"
              type="button"
              onClick={loginWithGithub}
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Login with GitHub'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
