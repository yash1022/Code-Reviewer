import { Router } from 'express'
import { fetchContent, fetchGithubRepos, fetchGithubTrees } from '../CONTROLLER/features.Controller.js'
import { authMiddleware } from '../MIDDLEWARE/authMiddleware.js'
import { asyncHandler } from '../UTILS/asyncHandler.Utils.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ ok: true, service: 'feature' })
})

router.get('/repos', authMiddleware , asyncHandler(fetchGithubRepos));
router.get('/repos/:owner/:repo/trees', authMiddleware, asyncHandler(fetchGithubTrees)); 
router.get('/repos/:owner/:repo/:path/content',authMiddleware,asyncHandler(fetchContent));



export default router;



