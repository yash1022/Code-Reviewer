import User from "../MODEL/User.js";
import axios from "axios";
import {authMiddleware} from "../MIDDLEWARE/authMiddleware.js"
import { AppError } from "../UTILS/appError.Utils.js"




export const fetchGithubRepos = async(req,res)=>{
    

        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user)
        {
            // return res.status(404).json({message:"USER NOT FOUND"});

           throw new AppError("USER NOT FOUND",404);
        }

        const accessToken = user.AccessToken;
        const username = user.Name;

        if(!accessToken){
            // return res.status(401).json({message:"GITHUB ACCESS TOKEN NOT FOUND. PLEASE SIGN IN AGAIN."});
            throw new AppError("GITHUB ACCESS TOKEN NOT FOUND. PLEASE SIGN IN AGAIN.",401);
        }

        const { page, limit } = req.query;

        if(!page || !limit)
        {
            // return res.status(400).json({message:"PAGE AND LIMIT ARE REQUIRED"});
            throw new AppError("PAGE AND LIMIT ARE REQUIRED",400);
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

export const fetchGithubTrees = async(req,res)=>{

    try
    {
        const id = req.user._id;
        const owner = req.params.owner;
        const repo  = req.params.repo;

        if(!owner || !repo)
        {
            return res.status(400).json({message:"OWNER AND REPO ARE REQUIRED"});
        }

        const result = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,{
            headers:{
                Authorization: `Bearer ${req.user.AccessToken}`,
                Accept: "application/vnd.github+json"
            }
        })

        return res.status(200).json(result.data);

        



    }
    catch(err)
    {
        return res.status(500).json({message:"FAILED TO FETCH TREES"});
    }

}

export const fetchContent = async(req,res)=>{
    try
    {
        const id = req.user._id;

        const owner = req.params.owner;
        const repo  = req.params.repo;
        const path = req.params.path;

        if(!owner || !repo || !path)
        {
            return res.status(400).json({message:"OWNER, REPO AND PATH ARE REQUIRED"});
        }

        const result = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,{
            headers:{
                Authorization: `Bearer ${req.user.AccessToken}`,
                Accept: "application/vnd.github+json"
            }
        })

        return res.status(200).json(result.data);


    }
    catch(err)
    {
        return res.status(500).json({message:"FAILED TO FETCH CONTENT"});

    }
}
