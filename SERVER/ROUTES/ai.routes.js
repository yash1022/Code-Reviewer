import { Router } from "express";
import { authMiddleware } from "../MIDDLEWARE/auth.Middleware.js";
import { generateReview } from "../CONTROLLER/ai.Controller.js";
import { asyncHandler } from "../UTILS/asyncHandler.Utils.js";
import aiRateLimiter from "../MIDDLEWARE/aiRateLimiter.Middleware.js";


const router  = Router();

router.get("/", (req, res) => {
    res.json({ ok: true, service: "ai" });
});

router.post('/review',authMiddleware,aiRateLimiter,asyncHandler(generateReview));





export default router;
