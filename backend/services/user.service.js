import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// backend/services/user.service.js -> ../../db_json/users.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../../db_json/users.json');
/**
 * Đọc toàn bộ danh sách users từ file JSON
 */
async function readUsers() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Lỗi khi đọc file Database:", error);
        throw new Error("Database error");
    }
}
/**
 * Ghi lại danh sách users vào file JSON
 */
async function writeUsers(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error("Lỗi khi ghi file Database:", error);
        throw new Error("Database save error");
    }
}
/**
 * Lấy thông tin user theo ID
 */
export async function getUserById(id) {
    const db = await readUsers();
    // Chuyển id sang number vì trong json id là number
    // hoặc so sánh lỏng lẻo (==)
    const user = db.users.find(u => u.id == id);

    if (!user) {
        return null; // Hoặc throw Error tùy logic controller
    }

    // Loại bỏ password trước khi trả về
    const { password, ...userInfo } = user;
    return userInfo;
}
/**
 * Cập nhật thông tin user
 */
export async function updateUser(id, updateData) {
    const db = await readUsers();
    const index = db.users.findIndex(u => u.id == id);
    if (index === -1) {
        throw new Error("User not found");
    }
    // Chỉ cập nhật các trường cho phép (bảo mật)
    // Ví dụ: không cho sửa email, role ở đây nếu không muốn
    const allowedFields = ['fullName', 'phone', 'address', 'avatar'];

    const user = db.users[index];

    // Merge data mới vào user cũ
    Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
            user[key] = updateData[key];
        }
    });
    // Cập nhật lại trong mảng
    db.users[index] = user;
    // Ghi file
    await writeUsers(db);
    // Trả về thông tin không có password
    const { password, ...userInfo } = user;
    return userInfo;
}