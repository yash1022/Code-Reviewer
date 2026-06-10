import { useEffect, useState } from 'react'
import './Dashboard.css'
import apiClient from '../shared/api/axios.js'

function Dashboard() {
  const [repositories, setRepositories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [showNext, setShowNext] = useState(false);
    const [showPrev, setShowPrev] = useState(false);
    











    

    useEffect(()=> {
        fetchRepos();
    },[]);

    

    const fetchRepos = async()=>{
      try {
        setLoading(true);
        setError('');

        const result = await apiClient.get("features/github/repos",{
          params:{
            page:1,
            limit:10
          }
        });

        const data = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
            ? result.data.data
            : result.data?.data
              ? [result.data.data]
              : [];

        const pagignationData = result.data?.pagination || {};

        setShowNext(pagignationData.hasNextPage);
        setShowPrev(pagignationData.hasPrevPage);
        setPage(pagignationData.currentPage || 1);


        

        setRepositories(data);
      } catch (requestError) {
        setError('Failed to load repository details.');
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    }

    const formatDate = (value) => {
      if (!value) {
        return 'Not available';
      }

      return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    const handleRefresh = () => {
      fetchRepos();
    }
  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1>Your GitHub repositories</h1>
            <p className="subcopy">
              Live repository cards from GitHub for the connected account.
            </p>
          </div>
          <button className="btn-secondary" type="button" onClick={handleRefresh}>
            Refresh repos
          </button>
        </header>

        <section className="repo-grid">
          {loading ? (
            <div className="repo-card repo-card-state">Loading repository details...</div>
          ) : error ? (
            <div className="repo-card repo-card-state">{error}</div>
          ) : repositories.length > 0 ? (
            repositories.map((repo) => (
              <a
                className="repo-card"
                key={repo.id ?? repo.node_id ?? repo.full_name ?? repo.html_url}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="repo-title-row">
                  <div>
                    <p className="repo-owner">{repo.owner?.login || repo.full_name?.split('/')?.[0] || 'GitHub'}</p>
                    <h3>{repo.name}</h3>
                  </div>
                  <span className="repo-pill">{repo.private ? 'Private' : 'Public'}</span>
                </div>

                <div className="repo-meta">
                  <span>{repo.language || 'Language not set'}</span>
                  <span className="repo-divider"></span>
                  <span>Updated {formatDate(repo.updated_at)}</span>
                </div>

                <div className="repo-footer">
                  <span>Created {formatDate(repo.created_at)}</span>
                  <span>ID: {repo.id}</span>
                </div>
              </a>
            ))
          ) : (
            <div className="repo-card repo-card-state">No repository data available.</div>
          )}
        </section>

        <div className="pagination-controls pagination-controls-bottom" aria-label="Repository pagination controls">
          {showPrev && (
            <button className="btn-secondary" type="button">
              Previous
            </button>
          )}
          {showNext && (
            <button className="btn-secondary" type="button">
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
