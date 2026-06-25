import { Router } from 'express'
import { fetchContent, fetchGithubRepos, fetchGithubTrees, fetchGithubReposTest } from '../CONTROLLER/features.Controller.js'
import { authMiddleware } from '../MIDDLEWARE/auth.Middleware.js'
import { asyncHandler } from '../UTILS/asyncHandler.Utils.js'
import {rateLimiter} from '../MIDDLEWARE/rateLimiter.Middleware.js'


const router = Router()

router.get('/', (req, res) => {
  res.json({ ok: true, service: 'feature' })
})

router.get('/repos', authMiddleware ,rateLimiter, asyncHandler(fetchGithubRepos));  
router.get('/repos/:owner/:repo/trees', authMiddleware, rateLimiter, asyncHandler(fetchGithubTrees)); 
router.get('/repos/:owner/:repo/:path/content',authMiddleware,rateLimiter,asyncHandler(fetchContent));
router.get('/repos/test',rateLimiter,asyncHandler(fetchGithubReposTest))



export default router;



