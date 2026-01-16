import express from "express";
import { login, register} from "../services/auth.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { loginWithGoogleEmail } from "../services/auth.service.js";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        const result = await login(req.body);
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
});

router.post("/register", async (req, res) => {
    try {
        const result = await register(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
});

router.post("/google-login", async (req, res) => {
    try {
        const result = await loginWithGoogleEmail(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Google login error"
        });
    }
});

router.get("/me", authMiddleware, (req, res) => {
    res.json({
        user: req.user
    });
});

export default router;
