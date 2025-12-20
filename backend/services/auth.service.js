import usersData from "../../db_json/users.json" with { type: "json" };
import { delay } from "../utils/delay.js";

export async function login({ email, password }) {
    await delay(); // giả lập network

    // 1. tìm user theo email
    const user = usersData.users.find(u => u.email === email);

    if (!user) {
        throw {
            status: 404,
            message: "User not found"
        };
    }

    // 2. kiểm tra password
    if (user.password !== password) {
        throw {
            status: 401,
            message: "Invalid password"
        };
    }

    // 3. tạo token giả
    const token = "fake-jwt-token-" + user.id;

    // 4. trả dữ liệu (KHÔNG trả password)
    return {
        accessToken: token,
        user: {
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role
        }
    };
}
