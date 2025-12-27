// đây là đoạn code sử dụng api của front end, sẽ gửi dữ liệu người dùng nhập vào
// ở phần đăng nhập tới phương thức login ở back_end (api bên thứ 3 - fake api)
// gửi thông qua 1 server (cần chạy trước - truy cập src/pages/Login.tsx để biết cách khởi chạy server api)
const API_URL = "http://localhost:3001/auth";

export async function login(email, password) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
    }

    return res.json();
}

export async function register({ fullName, email, password, phone, address}) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName,
            email,
            password,
            phone,
            address
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Register failed");
    }

    return res.json();
}

export async function getMe(token) {
    const res = await fetch(`${API_URL}/me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Unauthorized");
    }

    return res.json();
}
