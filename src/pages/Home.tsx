import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // 1. Import Link
import Footer from "./Footer";
import { getAllProducts } from "../services/productService";
import { Product } from "../types/Product";

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setFeaturedProducts(data.slice(0, 4));
            } catch (error) {
                console.error("Lỗi:", error);
            }
        };
        fetchProducts();
    }, []);

    // ... (Giữ nguyên phần Animation Logic useEffect ở đây) ...
    // Để tiết kiệm chỗ, tôi ẩn phần animation đi vì nó không thay đổi
    useEffect(() => { /* Code animation giữ nguyên */ }, []);

    // Hàm xử lý thêm vào giỏ hàng (Giả lập)
    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault(); // Ngăn chặn Link nhảy trang nếu nút nằm trong thẻ Link
        alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
        // Sau này bạn sẽ gọi Context hoặc Redux ở đây
    };

    return (
        <div className="home-container">
            {/* HERO SECTION (Giữ nguyên) */}
            <div className="hero-section">
                {/* ... code hero cũ ... */}
                <div className="hero-text">
                    <h2>Bộ Sưu Tập Mới</h2>
                    <p>Khám phá nghệ thuật thủ công.<br/> <span>(Kéo để xem thêm &larr; &rarr;)</span></p>
                </div>
                {/* ... image track ... */}
            </div>

            {/* FEATURED PRODUCTS */}
            <div className="products-section">
                <div className="section-header">
                    <h3>Sản Phẩm Nổi Bật</h3>
                    <Link to="/products" className="view-all">Xem tất cả &rarr;</Link>
                </div>

                <div className="products-grid">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => (
                            // 2. Wrap toàn bộ card trong Link tới trang chi tiết theo ID
                            <Link to={`/product/${product.id}`} key={product.id} className="product-card">
                                <div className="product-img-wrapper">
                                    {/* Sửa product.images[0] thành product.image */}
                                    <img
                                        src={product.images || "https://via.placeholder.com/500"}
                                        alt={product.name}
                                    />

                                    <div className="action-buttons">
                                        {/* 3. Thêm sự kiện onClick chặn chuyển trang */}
                                        <button
                                            className="btn add-to-cart"
                                            onClick={(e) => handleAddToCart(e, product)}
                                        >
                                            Thêm giỏ
                                        </button>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <span className="price">
                                        {product.price.toLocaleString()}đ
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", width: "100%" }}>Đang tải sản phẩm...</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;