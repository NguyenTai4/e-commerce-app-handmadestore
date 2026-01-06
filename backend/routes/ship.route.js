import express from "express";
import {shippingService} from "../services/ship.service.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {province} = req.body;

        const result = shippingService.calculateFee(province);

        setTimeout(() => {
            res.json(result);
        }, 500);
    } catch (error) {
        res.status(500).json({message: "Lỗi tính phí ship"});
    }
});

export default router;