import {getAuth} from "../utils/authStorage";

const API_URL = "http://localhost:3001"; // URL Backend

// Helper: Lấy header chứa Token
const getHeaders = () => {
    const auth = getAuth(); // Hàm lấy user từ localStorage
    const token = auth?.accessToken;

    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
};

export const cartService = {
    // 1. Lấy giỏ hàng
    async getCart() {
        try {
            const response = await fetch(`${API_URL}/carts`, {
                method: "GET",
                headers: getHeaders(),
            });

            if (!response.ok) {
                // Nếu lỗi 401 (chưa đăng nhập) hoặc lỗi khác
                if (response.status === 401) throw new Error("Unauthorized");
                return {items: [], total: 0};
            }

            return await response.json();
        } catch (error) {
            console.error("Get Cart Error:", error);
            // Trả về object rỗng để không crash UI
            return {items: [], total: 0};
        }
    },

    // 2. Cập nhật giỏ hàng (Frontend gửi danh sách items mới lên)
    async updateCart(items) {
        try {
            const response = await fetch(`${API_URL}/carts`, {
                method: "PATCH",
                headers: getHeaders(),
                body: JSON.stringify({items}),
            });

            if (!response.ok) {
                throw new Error("Failed to update cart");
            }

            return await response.json();
        } catch (error) {
            console.error("Update Cart Error:", error);
            throw error;
        }
    }
};