import {Link} from "react-router-dom";


const Header = () => {
    return (
        <header className="header">
            <div className="header-container">

                {/* Logo */}
                <div className="logo">
                    <span>🌿</span>
                    <h1>Handmade</h1>
                </div>

                {/* Menu */}
                <nav className="nav">
                    <a href="#">Trang chủ</a>
                    <a href="#">Sản phẩm</a>
                    <a href="#">Giới thiệu</a>
                    <a href="#">Liên hệ</a>
                </nav>

                {/* Cart */}
                <Link to="/cart" className="cart">
                    🛒
                    <span className="cart-count">0</span>
                </Link>

            </div>
        </header>
    );
};

export default Header;
