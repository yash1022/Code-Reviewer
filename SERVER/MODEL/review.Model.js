import mongoose from "mongoose";
import {model,Schema} from "mongoose";

const reviewSchema = new Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    repository:{
        type:String,
        required:true

    },

    filePath:{
        type:String,
        required:true
    },

    fileSha:{

        type:String,
        required:true,


    },

    review:{
        type:mongoose.Schema.Types.Mixed,
        required:true
    }

},{timestamps:true});


const Review = model("Review",reviewSchema);

export default Review;