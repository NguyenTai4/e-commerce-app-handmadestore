import {useEffect, useState} from "react"; // 1. Import useState
import {Link, NavLink, useNavigate} from "react-router-dom";
import {clearAuth} from "../utils/authStorage";
import {User} from "../types/user";
import {cartService} from "../services/cartService";

interface HeaderProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Header = ({user, setUser}: HeaderProps) => {
    const navigate = useNavigate();
    const isLoggedIn = !!user;
    const [cartCount, setCartCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const fetchCartCount = async () => {
        try {
            const data = await cartService.getCart();

            const items = Array.isArray(data?.items) ? data.items : [];

            const totalQuantity = items.reduce(
                (sum: number, item: any) => sum + Number(item.quantity || 0),
                0
            );

            setCartCount(totalQuantity);
        } catch (error) {
            console.error("Lỗi đếm giỏ hàng:", error);
            setCartCount(0);
        }
    };

    const handleLogout = () => {
        // Đóng menu trước khi logout
        setIsOpen(false);

        clearAuth();
        setUser(null);
        navigate("/login");
    };
    useEffect(() => {
        fetchCartCount();

        const handleCartChange = () => {
            fetchCartCount();
        };

        window.addEventListener("cartChange", handleCartChange);

        return () => {
            window.removeEventListener("cartChange", handleCartChange);
        };
    }, [user]);
    return (
        <header className="header">
            <div className="header-container">

                {/*Logo*/}
                <Link to="/" className="logo">
                    <img
                        src="../../public/img/logo.png"
                        className="logo-image"
                    />
                </Link>

                {/*Menu */}
                <nav className="nav">
                    <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({isActive}) => isActive ? "active" : ""}>Sản phẩm</NavLink>
                    <NavLink to="/about" className={({isActive}) => isActive ? "active" : ""}>Giới thiệu</NavLink>
                    <NavLink to="/contact" className={({isActive}) => isActive ? "active" : ""}>Liên hệ</NavLink>
                </nav>

                {/*Actions*/}
                <div className="header-actions">

                    {/* Cart */}
                    <Link to="/cart" className="action-btn cart-btn">
                        🛒 <span className="cart-count">{cartCount}</span>
                    </Link>

                    {/* Phần Tài khoản */}
                    <div className="auth-section">
                        {isLoggedIn ? (
                            /* --- GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP (CÓ DROPDOWN) --- */
                            <div className="user-dropdown-container">

                                <div
                                    className={`profile-trigger ${isOpen ? 'active' : ''}`}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    <div className="avatar-placeholder">
                                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <span className="username">Hi, {user?.fullName}</span>
                                    {/* Mũi tên nhỏ chỉ xuống */}
                                    <span className="arrow-down" style={{fontSize: '10px'}}>▼</span>
                                </div>

                                {/* 2. Menu Dropdown & Overlay (Chỉ hiện khi isOpen = true) */}
                                {isOpen && (
                                    <>
                                        {/* Lớp phủ vô hình để click ra ngoài thì đóng menu */}
                                        <div className="overlay-click-outside" onClick={() => setIsOpen(false)}></div>

                                        {/* Menu chính */}
                                        <div className="dropdown-menu">
                                            {/* Mục 1: Trang cá nhân */}
                                            <Link
                                                to="/ProfileUser"
                                                className="dropdown-item"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span>👤</span> Trang cá nhân
                                            </Link>

                                            {/* Mục 2: Đăng xuất */}
                                            <div className="dropdown-item logout-item" onClick={handleLogout}>
                                                <span>🚪</span> Đăng xuất
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /* --- GIAO DIỆN KHI CHƯA ĐĂNG NHẬP --- */
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