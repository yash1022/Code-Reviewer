import { Link } from 'react-router-dom'
import '../app/App.css'

function Landing() {
  return (
    <div className="landing">
      <main>
        <section className="hero">
          <div className="hero-grid"></div>
          <div className="hero-glow hero-glow-left"></div>
          <div className="hero-glow hero-glow-right"></div>

          <div className="container hero-content">
            <div>
              <p className="eyebrow">AI-assisted code review for teams</p>
              <h1>
                Review faster, ship cleaner, and keep every PR on a high
                standard.
              </h1>
              <p className="subcopy">
                Code Reviewer streamlines pull requests with structured
                feedback, risk spotting, and a workflow that keeps engineering
                velocity high without losing quality.
              </p>
              <div className="cta-row">
                <Link className="btn-primary" to="/dashboard">
                  Get started
                </Link>
                <button className="btn-ghost" type="button">
                  View documentation
                </button>
              </div>
              <div className="stat-row">
                <div>
                  <p className="stat">42%</p>
                  <p className="stat-label">Less review time</p>
                </div>
                <div>
                  <p className="stat">3.2x</p>
                  <p className="stat-label">Fewer regressions</p>
                </div>
                <div>
                  <p className="stat">98%</p>
                  <p className="stat-label">PR clarity score</p>
                </div>
              </div>
            </div>
            <div className="hero-panel">
              <div className="panel-card">
                <p className="panel-title">Live PR insights</p>
                <div className="panel-row">
                  <span>Security</span>
                  <span className="pill">2 alerts</span>
                </div>
                <div className="panel-row">
                  <span>Performance</span>
                  <span className="pill">+12% gain</span>
                </div>
                <div className="panel-row">
                  <span>Testing</span>
                  <span className="pill">7 suites</span>
                </div>
                <div className="panel-divider"></div>
                <p className="panel-note">
                  Auto-summarize changes, pinpoint risky diffs, and keep
                  reviewers aligned in one place.
                </p>
              </div>
              <div className="panel-card outline">
                <p className="panel-title">Release confidence</p>
                <p className="panel-note">
                  Merge with automated checklists, enforced conventions, and a
                  shared review playbook.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <div className="section-heading">
              <h2>Precision review workflows</h2>
              <p>
                Built for modern teams that want visibility, accountability, and
                clean release handoffs.
              </p>
            </div>
            <div className="feature-grid">
              {[
                {
                  title: 'Signal-first summaries',
                  copy: 'Get the why, the risk, and the architectural impact in one view.',
                },
                {
                  title: 'Review playbooks',
                  copy: 'Enforce standards with reusable checklists per team or repo.',
                },
                {
                  title: 'Context-aware insights',
                  copy: 'Link runtime traces, issues, and incidents directly to code.',
                },
                {
                  title: 'Guardrails at scale',
                  copy: 'Catch regressions early with smart diff analysis and alerts.',
                },
                {
                  title: 'Owner visibility',
                  copy: 'Know who changed what, when, and which teams are impacted.',
                },
                {
                  title: 'Release ready reports',
                  copy: 'Share stakeholder-ready rollups in seconds.',
                },
              ].map((item) => (
                <article className="feature-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="section">
          <div className="container workflow">
            <div>
              <h2>From PR to production without blind spots.</h2>
              <p>
                Every review is mapped to security, quality, and delivery
                signals so engineering leaders can make fast, confident calls.
              </p>
              <button className="btn-secondary" type="button">
                See how it works
              </button>
            </div>
            <div className="timeline">
              {[
                'Connect GitHub and sync your repositories',
                'Automated risk scan and structured summary',
                'Reviewer assignments and tracked approvals',
                'Release checklist + post-merge report',
              ].map((step, index) => (
                <div className="timeline-row" key={step}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section cta">
          <div className="container cta-card">
            <div>
              <h2>Raise the bar for every review.</h2>
              <p>
                Bring your engineering team into a faster, clearer review cycle
                with real-time GitHub insights.
              </p>
            </div>
            <button className="btn-primary" type="button">
              Connect GitHub
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Landing
