import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearAuth } from "../utils/authStorage";
import { User } from "../types/user";
import { Product } from "../types/Product";
import { searchProducts } from "../services/productService";
import { FaSearch, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const Header = ({ user, setUser }: HeaderProps) => {
    const navigate = useNavigate();
    const isLoggedIn = !!user;
    // 2. State để quản lý việc đóng mở menu
    const [isOpen, setIsOpen] = useState(false);
    // 3. Search State
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounce search
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.trim()) {
                try {
                    const results = await searchProducts(searchTerm);
                    setSuggestions(results.slice(0, 5));
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Search error:", error);
                    setSuggestions([]);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSearchSubmit = () => {
        if (searchTerm.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (id: number) => {
        navigate(`/product/${id}`);
        setShowSuggestions(false);
        setSearchTerm("");
    };

    const handleLogout = () => {
        setIsOpen(false);
        clearAuth();
        setUser(null);
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header-container">

                {/*Logo*/}
                <Link to="/" className="logo">
                    <img
                        src="/img/logo.png"
                        className="logo-image"
                    />
                </Link>

                {/*Menu */}
                <nav className="nav">
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "active" : ""}>Sản phẩm</NavLink>
                    <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>Giới thiệu</NavLink>
                    <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Liên hệ</NavLink>
                </nav>

                {/*Actions*/}
                <div className="header-actions">
                    {/*Search*/}
                    <div className="header-search">
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                            onFocus={() => {
                                if (suggestions.length > 0) setShowSuggestions(true);
                            }}
                        />
                        <button className="search-btn-icon" onClick={handleSearchSubmit}>
                            {/* @ts-ignore */}
                            <FaSearch />
                        </button>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <>
                                <div className="overlay-click-outside" onClick={() => setShowSuggestions(false)}></div>
                                <div className="search-suggestions">
                                    {suggestions.map((product) => (
                                        <div
                                            key={product.id}
                                            className="search-suggestion-item"
                                            onClick={() => handleSuggestionClick(product.id)}
                                        >
                                            <img src={product.images} alt={product.name} className="suggestion-image" />
                                            <div className="suggestion-info">
                                                <span className="suggestion-name">{product.name}</span>
                                                <span className="suggestion-price">{product.price.toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    {/*Cart*/}
                    <Link to="/cart" className="action-btn cart-btn header-icon-btn">
                        {/* @ts-ignore */}
                        <FaShoppingCart />
                        <span className="cart-count">2</span>
                    </Link>

                    {/*Phần Tài khoản*/}
                    <div className="auth-section">
                        {isLoggedIn ? (
                            /*GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP*/
                            <div className="user-dropdown-container">

                                <div
                                    className={`profile-trigger header-icon-btn ${isOpen ? 'active' : ''}`}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {/* @ts-ignore */}
                                    <FaUser />
                                </div>

                                {/*Menu Dropdown*/}
                                {isOpen && (
                                    <>
                                        {/* Lớp phủ vô hình để click ra ngoài thì đóng menu */}
                                        <div className="overlay-click-outside" onClick={() => setIsOpen(false)}></div>

                                        {/*Menu chính*/}
                                        <div className="dropdown-menu">
                                            {/*Trang cá nhân*/}
                                            <Link
                                                to="/ProfileUser"
                                                className="dropdown-item"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {/* @ts-ignore */}
                                                <span><FaUser /></span> Trang cá nhân
                                            </Link>

                                            {/*Đăng xuất*/}
                                            <div className="dropdown-item logout-item" onClick={handleLogout}>
                                                {/* @ts-ignore */}
                                                <span><FaSignOutAlt /></span> Đăng xuất
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            /*GIAO DIỆN KHI CHƯA ĐĂNG NHẬP*/
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