import './Dashboard.css'

const repositories = [
  {
    name: 'code-reviewer-web',
    description: 'Frontend client with review workflows and analytics widgets.',
    language: 'JavaScript',
    updatedAt: 'Updated 2 days ago',
    url: 'https://github.com/your-org/code-reviewer-web',
  },
  {
    name: 'review-engine',
    description: 'AI-assisted review engine and scoring pipeline.',
    language: 'TypeScript',
    updatedAt: 'Updated 5 hours ago',
    url: 'https://github.com/your-org/review-engine',
  },
  {
    name: 'repo-sync-service',
    description: 'GitHub repository sync worker with webhook processing.',
    language: 'Node.js',
    updatedAt: 'Updated 1 week ago',
    url: 'https://github.com/your-org/repo-sync-service',
  },
  {
    name: 'review-playbooks',
    description: 'Shared review checklists, guardrails, and policy templates.',
    language: 'Markdown',
    updatedAt: 'Updated 3 days ago',
    url: 'https://github.com/your-org/review-playbooks',
  },
]

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Your GitHub repositories</h1>
            <p className="subcopy">
              Demo data for layout only. Hook this up to your GitHub fetching
              later.
            </p>
          </div>
          <button className="btn-secondary" type="button">
            Refresh list
          </button>
        </header>

        <section className="repo-grid">
          {repositories.map((repo) => (
            <a
              className="repo-card"
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
            >
              <div className="repo-title-row">
                <h3>{repo.name}</h3>
                <span className="repo-pill">Public</span>
              </div>
              <p className="repo-description">{repo.description}</p>
              <div className="repo-meta">
                <span>{repo.language}</span>
                <span className="repo-divider"></span>
                <span>{repo.updatedAt}</span>
              </div>
            </a>
          ))}
        </section>
      </div>
    </div>
  )
}

export default Dashboard
