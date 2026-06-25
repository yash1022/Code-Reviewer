import { Router } from 'express'
import { githubCallback, githubLogin } from '../CONTROLLER/auth.Controller.js'
import { authMiddleware } from '../MIDDLEWARE/auth.Middleware.js'
import { asyncHandler } from '../UTILS/asyncHandler.Utils.js'
import {rateLimiter} from '../MIDDLEWARE/aiRateLimiter.Middleware.js'

const router = Router()

router.get('/status', (req, res) => {
  res.json({ ok: true, service: 'auth' })
})

router.get('/github',rateLimiter,asyncHandler(githubLogin));
router.get('/github/callback',asyncHandler(githubCallback));
router.get('/me',authMiddleware,rateLimiter,asyncHandler((req,res)=>{

 

    const {Name,Email} = req.user;

    return res.status(200).json({Name,Email,message:"FETCHED USER SUCCESSFULLY"});


  
}))

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.MODE == 'DEVELOPMENT' ? false : true,
    sameSite: 'strict',
  })
  return res.status(200).json({ message: 'LOGGED OUT' })
})




export default router
