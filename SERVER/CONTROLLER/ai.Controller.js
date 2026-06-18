import { codeReviewService } from "../SERVICE/gemini.Service.js";
import Review from "../MODEL/review.Model.js";


export const generateReview = async (req, res) => {
    try
    {
        const {base64EncodedCode,sha,filePath,repoName} = req.body;
        const userId = req.user?._id;

        const existingReview = await Review.findOne({
            user: userId,
            repository: repoName,
            filePath: filePath,
            
        })

        if(existingReview)
        {
            if(sha === existingReview.fileSha)
            {
                return res.status(200).json({review: existingReview.review, message:"REVIEW ALREADY EXISTS"});
            }
        }

        if(!base64EncodedCode)
        {
            return res.status(400).json({message:"CODE IS NOT PROVIDED"});
        }

        const review = await codeReviewService(base64EncodedCode);

        if(existingReview)
        {
            existingReview.review = review;
            existingReview.fileSha = sha;
            await existingReview.save();
        }
        else
        {
            const newReview = new Review({
                user: userId,
                repository: repoName,
                filePath: filePath,
                fileSha: sha,
                review: review
            })

            await newReview.save();
        }

        return res.status(200).json({review, message:"REVIEW GENERATED SUCCESSFULLY"});

    }
    catch(err)
    {
        console.error("Error generating review:", err);
        return res.status(500).json({ message:"FAILED TO GENERATE REVIEW"});
    }
    
}