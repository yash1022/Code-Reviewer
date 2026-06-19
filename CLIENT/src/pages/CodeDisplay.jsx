import { useEffect, useMemo, useState } from 'react'
import Editor from '@monaco-editor/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import apiClient from '../shared/api/axios.js'
import './CodeDisplay.css'

const extensionLanguageMap = {
  css: 'css',
  html: 'html',
  js: 'javascript',
  jsx: 'javascript',
  json: 'json',
  md: 'markdown',
  py: 'python',
  ts: 'typescript',
  tsx: 'typescript',
  xml: 'xml',
  yml: 'yaml',
  yaml: 'yaml',
}

const decodeBase64Content = (content = '') => {
  const cleanContent = content.replace(/\s/g, '')
  const binary = window.atob(cleanContent)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))

  return new TextDecoder('utf-8').decode(bytes)
}

const getLanguageFromPath = (path = '') => {
  const extension = path.split('.').pop()?.toLowerCase()

  return extensionLanguageMap[extension] || 'plaintext'
}

const parseReviewResponse = (review) => {
  if (review && typeof review === 'object') {
    return review
  }

  if (typeof review !== 'string') {
    throw new Error('Review response is not valid JSON.')
  }

  const cleanReview = review
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()

  return JSON.parse(cleanReview)
}

function CodeDisplay() {
  const { owner, repo, path } = useParams()
  const navigate = useNavigate()
  const [fileContent, setFileContent] = useState('')
  const [fileMeta, setFileMeta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reviewStarted, setReviewStarted] = useState(false)

  const decodedOwner = owner ? decodeURIComponent(owner) : ''
  const decodedRepo = repo ? decodeURIComponent(repo) : ''
  const decodedPath = path ? decodeURIComponent(path) : ''
  const language = useMemo(() => getLanguageFromPath(decodedPath), [decodedPath])

  useEffect(() => {
    const fetchFileContent = async () => {
      if (!decodedOwner || !decodedRepo || !decodedPath) {
        setError('File details are missing.')
        return
      }

      try {
        setLoading(true)
        setError('')

        const result = await apiClient.get(
          `features/repos/${encodeURIComponent(decodedOwner)}/${encodeURIComponent(decodedRepo)}/${encodeURIComponent(decodedPath)}/content`,
        )
        const payload = result.data || {}
        console.log('API response payload:', payload)
        const nextContent = payload.encoding === 'base64'
          ? decodeBase64Content(payload.content)
          : payload.content || ''

        setFileMeta(payload)
        setFileContent(nextContent)
      } catch {
        setFileMeta(null)
        setFileContent('')
        setError('Failed to load file content.')
      } finally {
        setLoading(false)
      }
    }

    fetchFileContent()
  }, [decodedOwner, decodedRepo, decodedPath])

  const handleReview = async () =>{

    setReviewStarted(true);

    try
    {

      const base64EncodedCode = fileMeta.content;
      const sha = fileMeta.sha;
      const filePath = fileMeta.path;
      const repoName = fileMeta.repository?.name || decodedRepo;

      if(!base64EncodedCode || typeof base64EncodedCode !== 'string')
      {
        setReviewStarted(false);
        alert("File content is not available for review.");
        return;
      }

      const result = await apiClient.post('ai/review', {
        base64EncodedCode,
        sha,
        filePath,
        repoName:decodedRepo
      })
      const parsedReview = parseReviewResponse(result.data?.review)
      const reviewState = {
        review: parsedReview,
        file: {
          owner: decodedOwner,
          repo: decodedRepo,
          path: decodedPath,
          name: fileMeta?.name || decodedPath,
        },
      }

      sessionStorage.setItem('latestCodeReview', JSON.stringify(reviewState))
      navigate('/review-results', { state: reviewState })


      }

    
    catch
    {
        alert("Failed to start review. Please try again later.");
    }
    finally {
      setReviewStarted(false)
    }

  }

  return (
    <div className="code-display-page">
      <div className="container">
        <header className="code-display-header">
          <div>
            <p className="eyebrow">Code Display</p>
            <h1>{fileMeta?.name || decodedPath}</h1>
            <p className="subcopy">{decodedOwner}/{decodedRepo}/{decodedPath}</p>
          </div>
          <div className="code-display-actions">
            <Link className="btn-secondary" to={`/repos/${encodeURIComponent(decodedOwner)}/${encodeURIComponent(decodedRepo)}`}>
              Back to structure
            </Link>
            <button className="btn-primary" type="button" onClick={handleReview} disabled={reviewStarted}>
              {reviewStarted ? 'Reviewing...' : 'Start review'}
            </button>
          </div>
        </header>

        <section className="code-editor-shell">
          {loading ? (
            <p className="code-display-state">Loading file content...</p>
          ) : error ? (
            <p className="code-display-state">{error}</p>
          ) : (
            <Editor
              height="70vh"
              language={language}
              theme="vs-dark"
              value={fileContent}
              options={{
                minimap: { enabled: true },
                readOnly: true,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          )}
        </section>
      </div>
    </div>
  )
}

export default CodeDisplay
