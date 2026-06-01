import mongoose, { Model, Schema }  from "mongoose";


const userSchema = new Schema({
    
    Name:{

        type:String,
        isRequired:true

    },
    Email:{
        type:String,
        isRequired:true

    },

    GithubId:{
        type:Number, 
        unique:true
    },
    AccessToken:{
        type:String,
        isRequired:true,
        unique:true
        
    }
},
{timestamps:true})


const User  = mongoose.model("User",userSchema);

export default User;