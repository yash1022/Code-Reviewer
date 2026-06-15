import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import apiClient from '../shared/api/axios.js'
import './ViewRepo.css'

const createTree = (items) => {
  const root = { name: '', path: '', type: 'tree', children: new Map() }

  items.forEach((item) => {
    if (!item.path) {
      return
    }

    const parts = item.path.split('/')
    let current = root

    parts.forEach((part, index) => {
      const isLeaf = index === parts.length - 1
      const childPath = parts.slice(0, index + 1).join('/')

      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          path: childPath,
          type: isLeaf ? item.type : 'tree',
          children: new Map(),
        })
      }

      const child = current.children.get(part)

      if (isLeaf) {
        child.type = item.type
        child.size = item.size
      }

      current = child
    })
  })

  return root
}

const sortNodes = (nodes) => {
  return [...nodes].sort((first, second) => {
    if (first.type !== second.type) {
      return first.type === 'tree' ? -1 : 1
    }

    return first.name.localeCompare(second.name)
  })
}

function TreeNode({ node, owner, repo, depth = 0 }) {
  const children = sortNodes(node.children.values())
  const isFolder = node.type === 'tree'
  const fileUrl = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/code/${encodeURIComponent(node.path)}`

  const rowContent = (
    <>
      <span className={`tree-icon ${isFolder ? 'tree-icon-folder' : 'tree-icon-file'}`}>
        {isFolder ? 'DIR' : 'FILE'}
      </span>
      <span className={`tree-name ${isFolder ? 'tree-name-folder' : ''}`}>{node.name}</span>
      {!isFolder && typeof node.size === 'number' && (
        <span className="tree-size">{node.size.toLocaleString()} bytes</span>
      )}
    </>
  )

  return (
    <li className="tree-node">
      {isFolder ? (
        <div className="tree-row" style={{ '--depth': depth }}>
          {rowContent}
        </div>
      ) : (
        <Link className="tree-row tree-row-link" style={{ '--depth': depth }} to={fileUrl}>
          {rowContent}
        </Link>
      )}

      {children.length > 0 && (
        <ul className="tree-children">
          {children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              owner={owner}
              repo={repo}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function ViewRepo() {
  const { owner, repo } = useParams()
  const [treeItems, setTreeItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const decodedOwner = owner ? decodeURIComponent(owner) : ''
  const decodedRepo = repo ? decodeURIComponent(repo) : ''

  useEffect(() => {
    const fetchRepoTree = async () => {
      if (!decodedOwner || !decodedRepo) {
        setError('Repository details are missing.')
        return
      }

      try {
        setLoading(true)
        setError('')

        const result = await apiClient.get(
          `features/repos/${encodeURIComponent(decodedOwner)}/${encodeURIComponent(decodedRepo)}/trees`,
        )

        setTreeItems(Array.isArray(result.data?.tree) ? result.data.tree : [])
      } catch {
        setTreeItems([])
        setError('Failed to load repository structure.')
      } finally {
        setLoading(false)
      }
    }

    fetchRepoTree()
  }, [decodedOwner, decodedRepo])

  const root = useMemo(() => createTree(treeItems), [treeItems])
  const rootChildren = sortNodes(root.children.values())

  return (
    <div className="view-repo-page">
      <div className="container">
        <header className="view-repo-header">
          <div>
            <p className="eyebrow">Repository</p>
            <h1>{decodedOwner}/{decodedRepo}</h1>
            <p className="subcopy">Complete repository structure from GitHub.</p>
          </div>
          <Link className="btn-secondary" to="/dashboard">
            Back to repos
          </Link>
        </header>

        <section className="repo-tree-shell">
          {loading ? (
            <p className="repo-tree-state">Loading repository structure...</p>
          ) : error ? (
            <p className="repo-tree-state">{error}</p>
          ) : rootChildren.length > 0 ? (
            <ul className="repo-tree">
              {rootChildren.map((child) => (
                <TreeNode key={child.path} node={child} owner={decodedOwner} repo={decodedRepo} />
              ))}
            </ul>
          ) : (
            <p className="repo-tree-state">No files or folders found for this repository.</p>
          )}
        </section>
      </div>
    </div>
  )
}

export default ViewRepo
