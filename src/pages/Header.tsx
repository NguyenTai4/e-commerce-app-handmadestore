import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/authStorage";
import { User } from "../types/user";

interface HeaderProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Header = ({ user, setUser }: HeaderProps) => {
    const navigate = useNavigate();
    const isLoggedIn = !!user;
    console.log(isLoggedIn);
    console.log(user);
    const handleLogout = () => {
        clearAuth();
        setUser(null);
        navigate("/login");
    };
    return (
        <header className="header">
            <div className="header-container">

                {/* --- LEFT: Logo --- */}
                <Link to="/" className="logo">
                    <span className="logo-icon">🌿</span>
                    <h1>Handmade</h1>
                </Link>

                {/* --- CENTER: Menu --- */}
                <nav className="nav">
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Sản phẩm</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>Giới thiệu</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Liên hệ</NavLink>
                </nav>

                {/* --- RIGHT: Actions (Cart + Auth) --- */}
                <div className="header-actions">

                    {/* Cart */}
                    <Link to="/cart" className="action-btn cart-btn">
                        🛒 <span className="cart-count">2</span>
                    </Link>

                    {/* Phần Tài khoản */}
                    <div className="auth-section">
                        {isLoggedIn ? (
                            /* GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP */
                            <Link to="/profile" className="profile-btn">
                                <div className="avatar-placeholder">H</div> {/* Hoặc thẻ <img> */}
                                <span className="username">Hi, {user?.fullName}</span>
                            </Link>
                        ) : (
                            /* GIAO DIỆN KHI CHƯA ĐĂNG NHẬP */
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-text">Đăng nhập</Link>
                                <span className="divider">|</span>
                                <Link to="/register" className="btn-primary">Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;