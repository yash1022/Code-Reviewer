import User from "../MODEL/User.js";
import axios from "axios";
import {authMiddleware} from "../MIDDLEWARE/authMiddleware.js"



export const fetchGithubRepos = async(req,res)=>{
    try
    {

        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user)
        {
            return res.status(404).json({message:"USER NOT FOUND"});
        }

        const accessToken = user.AccessToken;
        const username = user.Name;

        if(!accessToken){
            return res.status(401).json({message:"GITHUB ACCESS TOKEN NOT FOUND. PLEASE SIGN IN AGAIN."});
        }

        const result = await axios.get(`https://api.github.com/users/${username}/repos`,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            }
        })

        console.log(result.data);

        return res.status(200).json(result.data);
    }
    catch(err)
    {
        

        return res.status(500).json({message:"FAILED TO FETCH REPOS"});
    }
}