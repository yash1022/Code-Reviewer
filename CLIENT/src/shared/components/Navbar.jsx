import './Navbar.css'

function Navbar() {
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
        <button className="github-button" type="button">
          <span className="github-icon" aria-hidden="true"></span>
          Login with GitHub
        </button>
      </div>
    </header>
  )
}

export default Navbar
