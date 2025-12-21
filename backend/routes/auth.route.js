import express from "express";
import { login } from "../services/auth.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const result = await login(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
});

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        user: req.user
    });
});

export default router;
