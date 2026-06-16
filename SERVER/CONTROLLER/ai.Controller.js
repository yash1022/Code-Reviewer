import { codeReviewService } from "../SERVICE/gemini.Service.js";



export const generateReview = async (req, res) => {
    try
    {
        const {base64EncodedCode} = req.body;

        if(!base64EncodedCode)
        {
            return res.status(400).json({message:"CODE IS NOT PROVIDED"});
        }

        const review = await codeReviewService(base64EncodedCode);

        return res.status(200).json({review, message:"REVIEW GENERATED SUCCESSFULLY"});

    }
    catch(err)
    {
        console.error("Error generating review:", err);
        return res.status(500).json({ message:"FAILED TO GENERATE REVIEW"});
    }
    
}