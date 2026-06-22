import User from "../MODEL/User.js";
import axios from "axios";
import { AppError } from "../UTILS/appError.Utils.js"
import { redisClient } from "../DB/connectRedis.js";



export const fetchGithubReposTest = async(req,res)=>{
    const userName = "yash1022";

    const user = await User.findOne({Name: userName});

    console.log("INSIDE TEST ROUTE");

    if(!user)
    {
        // return res.status(404).json({message:"USER NOT FOUND"});
         throw new AppError("USER NOT FOUND",404);
    }

    const accessToken = user.AccessToken;
    const page = 1;
    const limit = 5;

    
        const key = `githubReposTest:${username}:${page}`;

        const cachedData = await redisClient.HGETALL(key);

        if(cachedData.data && cachedData.pagination)
        {
            console.log("DATA FROM CACHE");
            const data = JSON.parse(cachedData.data);
          

            return res.status(200).json({data,message:"DATA FROM CACHE" });
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

        const data = Array.isArray(result.data) ? result.data : [];
      

        if(data.length > 0)
            {

            await redisClient.HSET(key, {
            data: JSON.stringify(data)
        });

          await redisClient.EXPIRE(key, 3600);

            } 
      

        
        
        return res.status(200).json({data,message:"DATA FROM GITHUB API" });
}




export const fetchGithubRepos = async(req,res)=>{

    console.log("FETCH GITHUB REPOS CALLED");
    

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
            
            throw new AppError("GITHUB ACCESS TOKEN NOT FOUND. PLEASE SIGN IN AGAIN.",401);
        }

        const { page, limit } = req.query;

        if(!page || !limit)
        {
           throw new AppError("PAGE AND LIMIT ARE REQUIRED",400);
        }

        const key = `githubRepos:${username}:${page}`;

        const cachedData = await redisClient.HGETALL(key);

        if(cachedData.data && cachedData.pagination)
        {
            console.log("DATA FROM CACHE");
            const data = JSON.parse(cachedData.data);
            const paginationInfo = JSON.parse(cachedData.pagination);

            return res.status(200).json({data, pagination: paginationInfo,message:"DATA FROM CACHE" });
           
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

        const data = Array.isArray(result.data) ? result.data : [];
        const pagination = JSON.stringify(paginationInfo);

        if(data.length > 0)
            {

            await redisClient.HSET(key, {
            data: JSON.stringify(data),
            pagination
        });

          await redisClient.EXPIRE(key, 3600);

            } 
      

        
        
        return res.status(200).json({data, pagination: paginationInfo, message:"DATA FROM GITHUB API" });
  
}

export const fetchGithubTrees = async(req,res)=>{


        const id = req.user._id;
        const owner = req.params.owner;
        const repo  = req.params.repo;

        if(!owner || !repo)
        {
            throw new AppError("OWNER AND REPO ARE REQUIRED",400);
        }

        const result = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,{
            headers:{
                Authorization: `Bearer ${req.user.AccessToken}`,
                Accept: "application/vnd.github+json"
            }
        })

        return res.status(200).json(result.data);


}

export const fetchContent = async(req,res)=>{
    
        const id = req.user._id;

        const owner = req.params.owner;
        const repo  = req.params.repo;
        const path = req.params.path;

        if(!owner || !repo || !path)
        {
            throw new AppError("OWNER, REPO AND PATH ARE REQUIRED",400);
        }

        const result = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,{
            headers:{
                Authorization: `Bearer ${req.user.AccessToken}`,
                Accept: "application/vnd.github+json"
            }
        })

        return res.status(200).json(result.data);
}
