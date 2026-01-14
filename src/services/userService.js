// Giả định API user cũng nằm cùng server với products
// Nếu bạn dùng json-server, thường nó sẽ là http://localhost:3001/users
const API_URL = "http://localhost:3001/users";

/** Lấy thông tin user theo ID */
export async function getUserById(id) {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
        throw new Error("Không tìm thấy thông tin người dùng");
    }

    return res.json();
}

/** Cập nhật thông tin user */
export async function updateUser(id, updateData) {
    // Dùng method PATCH để chỉ cập nhật những trường thay đổi (không ghi đè toàn bộ)
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
    });

    if (!res.ok) {
        throw new Error("Lỗi khi cập nhật thông tin");
    }

    return res.json();
}