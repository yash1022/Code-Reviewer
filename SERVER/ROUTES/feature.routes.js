import { Router } from 'express'
import { fetchGithubRepos, fetchGithubTrees } from '../CONTROLLER/featureController.js'
import { authMiddleware } from '../MIDDLEWARE/authMiddleware.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ ok: true, service: 'feature' })
})

router.get('/repos', authMiddleware , fetchGithubRepos);
router.get('/repos/:owner/:repo/trees', authMiddleware, fetchGithubTrees);  


export default router;



