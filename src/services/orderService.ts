import {getAuth} from "../utils/authStorage";

const API_URL = "http://localhost:3001";

export interface ShippingInfo {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    shippingFee?: number;
}

export const orderService = {
    async createOrder(orderInfo: ShippingInfo) {
        const auth = getAuth();
        const token = auth?.accessToken;

        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : ""
            },
            body: JSON.stringify(orderInfo)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Lỗi đặt hàng");
        }
        window.dispatchEvent(new Event("cartChange"));
        return data;
    }
};

