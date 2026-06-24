import rateLimit from 'express-rate-limit';



const aiRateLimiter = rateLimit({
    windowMs: 15 *60*1000,
    max:5,
    
    handler:(req,res,next)=>{
        res.status(429).json({
            message:"TOO MANY REQUESTS , TRY AGAIN AFTER 15 MINUTES",
            success:false
        })
    }


})

export default aiRateLimiter;