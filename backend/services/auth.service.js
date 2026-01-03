import usersData from "../../db_json/users.json" with { type: "json" };
import { delay } from "../utils/delay.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FILE = path.resolve(
    __dirname,
    "../../db_json/users.json"
);

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
            fullName : user.fullName,
            email: user.email,
            role: user.role
        }
    };
}

export async function register({email, password, fullName, phone, address }) {
    await delay();

    // 1. check email tồn tại
    const existed = usersData.users.find(u => u.email === email);
    if (existed) {
        throw {
            status: 409,
            message: "Email already exists"
        };
    }

    // 2. tạo user mới
    const newUser = {
        id: usersData.users.length
            ? Math.max(...usersData.users.map(u => u.id)) + 1
            : 1,
        email,
        password, // fake api → chưa hash
        fullName,
        role: "user",
        phone: phone || "",
        address: address || "",
        createdAt: new Date().toISOString().slice(0, 10)
    };

    // 3. lưu vào DB giả
    usersData.users.push(newUser);

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(usersData, null, 2),
        "utf-8"
    );

    // 4. tạo token
    const token = "fake-jwt-token-" + newUser.id;

    // 5. trả response (KHÔNG trả password)
    return {
        accessToken: token,
        user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
        }
    };
}
