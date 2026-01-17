

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* Cột 1: Thương hiệu */}
                <div className="footer-col">
                    <h3>🌿 Handmade</h3>
                    <p>
                        Sản phẩm thủ công – tỉ mỉ trong từng chi tiết.
                        Mang sự ấm áp và cá tính đến không gian của bạn.
                    </p>
                </div>

                {/* Cột 2: Menu */}
                <div className="footer-col">
                    <h4>Liên kết</h4>
                    <ul>
                        <li><a href="#">Trang chủ</a></li>
                        <li><a href="#">Sản phẩm</a></li>
                        <li><a href="#">Giới thiệu</a></li>
                        <li><a href="#">Liên hệ</a></li>
                    </ul>
                </div>

                {/* Cột 3: Liên hệ */}
                <div className="footer-col">
                    <h4>Liên hệ</h4>
                    <p>TP. Hồ Chí Minh</p>
                    <p>0123 456 789</p>
                    <p>✉ handmade@gmail.com</p>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} Handmade. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;