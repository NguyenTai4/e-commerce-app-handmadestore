const API_URL = "http://localhost:3001/reviews";

/** Lấy review theo product */
export async function getReviewsByProductId(productId) {
    const res = await fetch(`${API_URL}?productId=${productId}`);

    if (!res.ok) {
        throw new Error("Không thể tải đánh giá sản phẩm");
    }

    return res.json();
}

/** Thống kê rating */
export async function getReviewStats(productId) {
    const res = await fetch(`${API_URL}/stats/${productId}`);

    if (!res.ok) {
        throw new Error("Không thể tải thống kê đánh giá");
    }

    return res.json();
}
