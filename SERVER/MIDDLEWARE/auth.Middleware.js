import jwt from 'jsonwebtoken'
import User from "../MODEL/User.js";


const JWT_SECRET = process.env.JWT_SECRET || "" ;
export const authMiddleware = async(req,res,next)=>{

    try
    {
            const accessToken = req.cookies.accessToken;

    if(!accessToken)
    {
        return res.status(401).json({message:"UNAUTHORIZED"});
    }

    const decoded = jwt.verify(accessToken,JWT_SECRET);

    if(!decoded)
    {
        return res.status(401).json({message:"UNAUTHORIZED"});
    }

    const decodedUser = await User.findById(decoded.userId);

    if(!decodedUser)
{
    return res.status(401).json({
        message:"USER NOT FOUND"
    });
}

    req.user = decodedUser

    next();
    }
    catch(e)
    {
        return res.status(401).json({error:e,message:"UNAUTHORIZED"});
    }

   



}

