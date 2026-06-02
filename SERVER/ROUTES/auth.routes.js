import { Router } from 'express'
import { githubCallback, githubLogin } from '../CONTROLLER/githubLogin.js'
import { authMiddleware } from '../MIDDLEWARE/authMiddleware.js'

const router = Router()

router.get('/status', (req, res) => {
  res.json({ ok: true, service: 'auth' })
})

router.get('/github',githubLogin);
router.get('/github/callback',githubCallback);
router.get('/me',authMiddleware,(req,res)=>{

  try{

    const {Name,Email} = req.user;

     return res.status(200).json({Name,Email,message:"FETCHED USER SUCCESSFULLY"});


  }
  catch(e)
  {
    return res.status(400).json({error:e, message:"FAILED TO FETCH USER DETAILS"});
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.MODE == 'DEVELOPMENT' ? false : true,
    sameSite: 'strict',
  })
  return res.status(200).json({ message: 'LOGGED OUT' })
})




export default router
