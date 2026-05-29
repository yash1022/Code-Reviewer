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
        type:String
    }
},
{timestamps:true})


const userSchema = mongoose.Model("User",userSchema);

export default userSchema;