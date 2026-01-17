import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import {cartService} from "../services/cart.service.js";

const router = express.Router();

router.use(authMiddleware);

// Get user cart
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Cart Error:", error);
        res.status(500).json({message: "Lỗi server khi lấy giỏ hàng"});
    }
});
router.post("/add", async (req, res) => {
    try {
        const userId = req.user.id;
        const {productId, quantity} = req.body;

        if (!productId) {
            return res.status(400).json({message: "Thiếu productId"});
        }

        const updatedCart = await cartService.addToCart(userId, productId, quantity || 1);

        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Add to Cart Error:", error);
        res.status(500).json({message: "Lỗi server khi thêm vào giỏ"});
    }
});
router.patch("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const {items} = req.body;

        if (!Array.isArray(items)) {
            return res.status(400).json({message: "Dữ liệu items không hợp lệ"});
        }

        const updatedCart = await cartService.updateCart(userId, items);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error("Cart Update Error:", error);
        res.status(500).json({message: "Lỗi server khi cập nhật giỏ hàng"});
    }
});

export default router;