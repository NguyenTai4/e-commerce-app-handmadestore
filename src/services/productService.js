const API_URL = "http://localhost:3001/products";

/** Lấy toàn bộ sản phẩm */
export async function getAllProducts() {
    const res = await fetch(API_URL);

    if (!res.ok) {
        throw new Error("Không thể tải danh sách sản phẩm");
    }

    return res.json();
}

/** Lấy chi tiết sản phẩm theo id */
export async function getProductById(id) {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
        throw new Error("Không tìm thấy sản phẩm");
    }

    return res.json();
}

/** Lấy sản phẩm theo category */
export async function getProductsByCategory(category) {
    const res = await fetch(`${API_URL}?category=${category}`);

    if (!res.ok) {
        throw new Error("Không thể tải sản phẩm theo danh mục");
    }

    return res.json();
}
export async function getProductBySlug(slug) {
    // JSON Server lọc trả về mảng, ví dụ: /products?slug=ten-san-pham
    const res = await fetch(`${API_URL}?slug=${slug}`);

    if (!res.ok) {
        throw new Error("Lỗi kết nối khi tải sản phẩm");
    }

    const data = await res.json();

    // Vì API trả về mảng, ta kiểm tra xem có phần tử nào không
    if (data.length === 0) {
        throw new Error("Không tìm thấy sản phẩm");
    }

    // Trả về phần tử đầu tiên tìm thấy
    return data[0];
}