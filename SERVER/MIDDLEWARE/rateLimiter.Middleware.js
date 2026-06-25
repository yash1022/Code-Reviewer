import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 15 * 60 *1000,
    max:50,
    keyGenerator:(req)=> req.user._id || req.ip,

    handler:(req,res)=>{
        res.status(429).json({
            message:"TOO MANY REQUESTS, TRY AGAIN LATER ",
            success:false
        })
    }
})

export default rateLimiter;