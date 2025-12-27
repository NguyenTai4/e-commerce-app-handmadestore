import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js"; // Middleware check token
import {cartService} from "../services/cart.service.js"; // Service xử lý file

const router = express.Router();

// 1. Áp dụng Middleware chặn người chưa đăng nhập
// Mọi request vào /carts đều phải có Token hợp lệ
router.use(authMiddleware);

// 2. [GET] /carts - Lấy giỏ hàng của người đang đăng nhập
router.get("/", async (req, res) => {
    try {
        // req.user được tạo ra từ authMiddleware
        const userId = req.user.id;

        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Cart Error:", error);
        res.status(500).json({message: "Lỗi server khi lấy giỏ hàng"});
    }
});

// 3. [PATCH] /carts - Cập nhật giỏ hàng (FE gửi danh sách items mới lên)
router.patch("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const {items} = req.body; // Frontend gửi: { "items": [...] }

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