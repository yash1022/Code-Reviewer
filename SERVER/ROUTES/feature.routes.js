import { Router } from 'express'
import { fetchGithubRepos } from '../CONTROLLER/featureController.js'
import { authMiddleware } from '../MIDDLEWARE/authMiddleware.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ ok: true, service: 'feature' })
})

router.get('/github/repos', authMiddleware , fetchGithubRepos);


export default router;



