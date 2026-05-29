
import axios from 'axios';


export const findUser = async (accessToken) => {
    const result = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    return result.data;
}

export const githubLogin = (req,res)=>{

    

    const redirectUri = "http://localhost:5000/api/auth/github/callback"

    const url =
    `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;

    res.redirect(url);

}

export const githubCallback = async (req,res)=>{

   
    const client_id  = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;

    const code = req.query.code;

    if(!code)
    {
        return res.json({status:400,message:"FAILED TO LOGIN"});
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

    console.log(accessToken)

    const user = await findUser(accessToken);

    console.log(user);

    




    
    








}