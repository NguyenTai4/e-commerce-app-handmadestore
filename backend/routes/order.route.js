import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import {orderService} from "../services/order.service.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res) => {
    try {


        const userID = req.user.id;

        const locateShipDetail = req.body;

        if (!locateShipDetail || !locateShipDetail.address) {
            return res.status(400).json({message: "Thiếu địa chỉ giao hàng!"});
        }

        const newOrder = await orderService.createOrder(userID, locateShipDetail);

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("Order Error:", error.message);

        res.status(500).json({message: error.message});
    }
});

export default router;
