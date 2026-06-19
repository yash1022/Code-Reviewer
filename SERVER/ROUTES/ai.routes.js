import { Router } from "express";
import { authMiddleware } from "../MIDDLEWARE/authMiddleware.js";
import { generateReview } from "../CONTROLLER/ai.Controller.js";
import { asyncHandler } from "../UTILS/asyncHandler.Utils.js";


const router  = Router();

router.get("/", (req, res) => {
    res.json({ ok: true, service: "ai" });
});

router.post('/review',authMiddleware,asyncHandler(generateReview));



export default router;
