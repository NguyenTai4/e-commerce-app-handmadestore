import { useState } from "react";
import { login } from "../services/authService.js";
import { saveAuth } from "../utils/authStorage.js";
import { useNavigate } from "react-router-dom";
import { User } from "../types/user";

interface LoginProps {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Login({ setUser }: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        try {
            const data = await login(email, password);
            saveAuth(data);
            setUser(data.user);
            navigate("/");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Đăng nhập thất bại");
            }
        }
    };

    return (
        <>
            <div className="login-page">
                <form className="login-card" onSubmit={handleSubmit}>
                    <h2>Đăng nhập</h2>
                    <p className="login-sub">Chào mừng bạn quay lại 🌿</p>

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

                    <button type="submit" className="login-btn">
                        Đăng nhập
                    </button>

                    {/* Divider */}
                    <div className="login-divider">
                        <span>Hoặc</span>
                    </div>

                    {/* Social login */}
                    <div className="social-login">
                        <button
                            type="button"
                            className="social-btn google"
                            onClick={() => alert("Google login (demo)")}>
                            <span>Đăng nhập với Google</span>
                            <img src="/icons/social/google.png" alt="" />
                        </button>

                        <button
                            type="button"
                            className="social-btn facebook"
                            onClick={() => alert("Facebook login (demo)")}>
                            <span>Đăng nhập với Facebook</span>
                            <img src="/icons/social/facebook.png" alt="" />
                        </button>

                        <button
                            type="button"
                            className="social-btn instagram"
                            onClick={() => alert("Instagram login (demo)")}>
                            <span>Đăng nhập với Instagram</span>
                            <img src="/icons/social/instagram.png" alt="" />
                        </button>
                    </div>

                    {/* Register hint */}
                    <p className="register-hint">
                        Chưa có tài khoản?
                        <a href="/register"> Đăng ký</a>
                    </p>
                </form>
            </div>
        </>
    );
}
