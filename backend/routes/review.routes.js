import express from "express";
import { getReviewsByProductId, getReviewStats } from "../services/review.service.js";

const router = express.Router();

// GET /reviews?productId=1
router.get("/", async (req, res) => {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({
                message: "productId is required"
            });
        }

        const reviews = await getReviewsByProductId(productId);
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /reviews/stats/:productId
router.get("/stats/:productId", async (req, res) => {
    try {
        const stats = await getReviewStats(req.params.productId);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
