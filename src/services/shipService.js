const API_URL = "http://localhost:3001/api/ship";

export const shipService = {
    async calculateFee(province) {
        const response = await fetch(API_URL + "/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({province}),
        });
        if (!response.ok) {
            throw new Error("Không thể tính phí vận chuyển");
        }
        return await response.json();
    }
}