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

        const { page, limit } = req.query;

        if(!page || !limit)
        {
            return res.status(400).json({message:"PAGE AND LIMIT ARE REQUIRED"});
        }

        const result = await axios.get(`https://api.github.com/users/${username}/repos`,{
            headers:{
                Authorization: `Bearer ${accessToken}`
            },
            params:{
                page: Number(page),
                per_page: Number(limit)
            }
        })

        const paginationInfo = {
            totalRepos: result.data.length,
            currentPage: Number(page),
            hasNextPage: result.data.length === Number(limit),
            hasPrevPage: Number(page) > 1
        }

        console.log(result.data);

        return res.status(200).json({ data: result.data, pagination: paginationInfo });
    }
    catch(err)
    {
        

        return res.status(500).json({message:"FAILED TO FETCH REPOS"});
    }
}