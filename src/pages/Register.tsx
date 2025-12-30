import { register } from "../services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuth } from "../utils/authStorage";
import { User } from "../types/user";

interface RegisterProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Register({ setUser }: RegisterProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            const data = await register({
                email,
                password,
                fullName,
                phone,
                address
            });

            saveAuth(data);
            setUser(data.user);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đăng ký thất bại");
        }
    };

    return (
        <div className="login-page">
            <form className="login-card" onSubmit={handleSubmit}>
                <h2>Đăng ký</h2>
                <p className="login-sub">
                    Tạo tài khoản Handmade 🌿
                </p>

                {error && <div className="login-error">{error}</div>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Họ và tên"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                />

                <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Địa chỉ"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                />
                <button type="submit" className="login-btn">
                    Đăng ký
                </button>

                {/* Divider */}
                <div className="login-divider">
                    <span>Hoặc</span>
                </div>

                {/* Social register */}
                <div className="social-login">
                    <button
                        type="button"
                        className="social-btn google"
                        onClick={() => alert("Google register (demo)")}>
                        <span>Đăng ký với Google</span>
                        <img src="/icons/social/google.png" alt="" />
                    </button>

                    <button
                        type="button"
                        className="social-btn facebook"
                        onClick={() => alert("Facebook register (demo)")}>
                        <span>Đăng ký với Facebook</span>
                        <img src="/icons/social/facebook.png" alt="" />
                    </button>

                    <button
                        type="button"
                        className="social-btn instagram"
                        onClick={() => alert("Instagram register (demo)")}>
                        <span>Đăng ký với Instagram</span>
                        <img src="/icons/social/instagram.png" alt="" />
                    </button>
                </div>

                {/* Login hint */}
                <p className="register-hint">
                    Đã có tài khoản?
                    <a href="/login"> Đăng nhập</a>
                </p>
            </form>
        </div>
    );
}
