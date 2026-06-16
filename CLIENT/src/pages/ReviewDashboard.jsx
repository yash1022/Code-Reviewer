import { Link, useLocation } from 'react-router-dom'
import './ReviewDashboard.css'

const ratingLabels = {
  security: 'Security',
  bug_risk: 'Bug risk',
  performance: 'Performance',
  code_quality: 'Code quality',
  maintainability: 'Maintainability',
  readability: 'Readability',
  scalability: 'Scalability',
  testing_readiness: 'Testing readiness',
  production_readiness: 'Production readiness',
  overall: 'Overall',
}

const issueSections = [
  { key: 'deployment_blockers', title: 'Deployment Blockers' },
  { key: 'security_vulnerabilities', title: 'Security Vulnerabilities' },
  { key: 'bugs', title: 'Bugs' },
  { key: 'performance_issues', title: 'Performance Issues' },
  { key: 'code_quality_issues', title: 'Code Quality Issues' },
  { key: 'coding_standards', title: 'Coding Standards' },
]

const improvementLabels = {
  security: 'Security',
  performance: 'Performance',
  maintainability: 'Maintainability',
  scalability: 'Scalability',
  developer_experience: 'Developer experience',
}

const getStoredReview = () => {
  try {
    return JSON.parse(sessionStorage.getItem('latestCodeReview'))
  } catch {
    return null
  }
}

const asArray = (value) => (Array.isArray(value) ? value : [])

const clampRating = (value) => {
  const rating = Number(value)

  if (Number.isNaN(rating)) {
    return 0
  }

  return Math.min(10, Math.max(0, rating))
}

const formatText = (value) => {
  if (typeof value === 'string') {
    return value
  }

  if (value === null || value === undefined) {
    return ''
  }

  return JSON.stringify(value)
}

const getSeverityTone = (severity = '') => severity.toLowerCase()

const getVerdictTone = (verdict = '') => {
  if (verdict === 'READY') {
    return 'ready'
  }

  if (verdict === 'READY_WITH_MINOR_CHANGES') {
    return 'minor'
  }

  if (verdict === 'NEEDS_IMPROVEMENT') {
    return 'improve'
  }

  return 'blocked'
}

function RatingBar({ label, value }) {
  const rating = clampRating(value)

  return (
    <article className="rating-card">
      <div className="rating-row">
        <span>{label}</span>
        <strong>{rating}/10</strong>
      </div>
      <div className="rating-track" aria-hidden="true">
        <span style={{ width: `${rating * 10}%` }}></span>
      </div>
    </article>
  )
}

function IssueSection({ title, items }) {
  return (
    <section className="review-section">
      <div className="review-section-heading">
        <h2>{title}</h2>
        <span>{items.length}</span>
      </div>
      {items.length > 0 ? (
        <div className="issue-list">
          {items.map((item, index) => (
            <article className="issue-card" key={`${title}-${index}`}>
              <div className="issue-card-header">
                <span className={`severity severity-${getSeverityTone(item.severity)}`}>
                  {item.severity || 'LOW'}
                </span>
                <h3>{item.title || 'Untitled finding'}</h3>
              </div>
              {item.description && <p>{item.description}</p>}
              {item.impact && (
                <div className="issue-detail">
                  <span>Impact</span>
                  <p>{item.impact}</p>
                </div>
              )}
              {item.recommendation && (
                <div className="issue-detail">
                  <span>Recommendation</span>
                  <p>{item.recommendation}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">No findings reported.</p>
      )}
    </section>
  )
}

function TextList({ items }) {
  return items.length > 0 ? (
    <ul className="text-list">
      {items.map((item, index) => (
        <li key={`${formatText(item)}-${index}`}>{formatText(item)}</li>
      ))}
    </ul>
  ) : (
    <p className="empty-state">No items reported.</p>
  )
}

function ReviewDashboard() {
  const location = useLocation()
  const reviewState = location.state || getStoredReview()
  const review = reviewState?.review
  const file = reviewState?.file

  if (!review) {
    return (
      <main className="review-dashboard-page">
        <div className="container">
          <section className="review-empty-panel">
            <p className="eyebrow">Review Dashboard</p>
            <h1>No review results yet</h1>
            <p className="subcopy">Run an AI review from a source file to see the structured dashboard.</p>
            <Link className="btn-primary" to="/dashboard">
              Back to repos
            </Link>
          </section>
        </div>
      </main>
    )
  }

  const ratings = review.ratings || {}
  const verdict = review.summary?.deployment_verdict || 'NOT_READY'
  const verdictTone = getVerdictTone(verdict)
  const confidence = clampRating(review.final_assessment?.deployment_confidence)
  const totalFindings = issueSections.reduce(
    (total, section) => total + asArray(review[section.key]).length,
    0,
  )

  return (
    <main className="review-dashboard-page">
      <div className="container">
        <header className="review-dashboard-header">
          <div>
            <p className="eyebrow">Review Dashboard</p>
            <h1>{file?.name || 'AI Code Review'}</h1>
            {file && (
              <p className="subcopy">
                {file.owner}/{file.repo}/{file.path}
              </p>
            )}
          </div>
          <Link className="btn-secondary" to={file ? `/repos/${encodeURIComponent(file.owner)}/${encodeURIComponent(file.repo)}` : '/dashboard'}>
            Back to structure
          </Link>
        </header>

        <section className="review-summary-band">
          <div>
            <span className={`verdict-pill verdict-${verdictTone}`}>{verdict.replaceAll('_', ' ')}</span>
            <h2>{review.summary?.overview || 'Review completed.'}</h2>
          </div>
          <div className="summary-metrics">
            <div>
              <span>Production ready</span>
              <strong>{review.summary?.production_ready ? 'Yes' : 'No'}</strong>
            </div>
            <div>
              <span>Total findings</span>
              <strong>{totalFindings}</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>{confidence}/10</strong>
            </div>
          </div>
        </section>

        <section className="review-section">
          <div className="review-section-heading">
            <h2>Ratings</h2>
            <span>{clampRating(ratings.overall)}/10 overall</span>
          </div>
          <div className="ratings-grid">
            {Object.entries(ratingLabels).map(([key, label]) => (
              <RatingBar key={key} label={label} value={ratings[key]} />
            ))}
          </div>
        </section>

        {issueSections.map((section) => (
          <IssueSection
            key={section.key}
            title={section.title}
            items={asArray(review[section.key])}
          />
        ))}

        <section className="review-section">
          <div className="review-section-heading">
            <h2>Improvements</h2>
            <span>{Object.keys(improvementLabels).length}</span>
          </div>
          <div className="improvement-grid">
            {Object.entries(improvementLabels).map(([key, label]) => (
              <article className="improvement-card" key={key}>
                <h3>{label}</h3>
                <TextList items={asArray(review.improvements?.[key])} />
              </article>
            ))}
          </div>
        </section>

        <section className="review-lower-grid">
          <div className="review-section compact-section">
            <div className="review-section-heading">
              <h2>Strengths</h2>
              <span>{asArray(review.strengths).length}</span>
            </div>
            <TextList items={asArray(review.strengths)} />
          </div>

          <div className="review-section compact-section">
            <div className="review-section-heading">
              <h2>Final Assessment</h2>
              <span>{confidence}/10</span>
            </div>
            <h3>Major risks</h3>
            <TextList items={asArray(review.final_assessment?.major_risks)} />
            <h3>Recommended next steps</h3>
            <TextList items={asArray(review.final_assessment?.recommended_next_steps)} />
          </div>
        </section>
      </div>
    </main>
  )
}

export default ReviewDashboard
