
import axios from 'axios';
import generateToken from '../UTILS/generateToken.js'
import User from '../MODEL/User.js'

const findUser = async (accessToken) => {
    const result = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return result.data;
}

const saveUser = async(user,accessToken)=>{
    const {login,id,email} = user;

   const result =  await User.findOneAndUpdate({GithubId:id},{
        Name:login,
        Email:email,
        GithubId:id,
        AccesToken:accessToken
    },{
        returnDocument: 'after',
        upsert:true
        
    })

    return result;
}

export const githubLogin = (req,res)=>{

    console.log("INSIDE GITHUB LOGIN");

    const redirectUri = "http://localhost:5000/api/auth/github/callback"

    const url =
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;

    res.redirect(url);

}

export const githubCallback = async (req,res)=>{

    try{

        console.log("INSIDE CALLBACK")

   
    const client_id  = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    const code = req.query.code;

    if(!code)
    {
        return res.status(400).json({message:"FAILED TO LOGIN"});
    }
    const url = "https://github.com/login/oauth/access_token";

    const result = await axios.post(
        url,
        {
            client_id,
            client_secret,
            code
        },
        {
            headers: {
                Accept: "application/json"
            }
        }
    );

    const accessToken = result.data.access_token;

    
   
    if(!accessToken)
    {
         console.log("NO ACCESS TOKEN")
        return res.status(400).json({message:"FAILED TO LOGIN"});
    }

   

    const user = await findUser(accessToken);
    const savedUser =  await saveUser(user,accessToken);
    const token  = generateToken(savedUser._id);

    res.cookie('accessToken',token,{
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly:true,
        secure:process.env.MODE == 'DEVELOPMENT'? false:true,
        sameSite:'strict'
    })


    return res.redirect("http://localhost:5173/")

    

    }
    catch(e){

        return res.status(400).json({message:"FAILED TO LOGIN"});
    }

}