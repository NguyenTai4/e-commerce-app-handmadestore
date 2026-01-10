import { useEffect, useRef, useState } from "react";
// import Header from "./Header";
import Footer from "./Footer";
import { getAllProducts } from "../services/productService";
import { Product } from "../types/Product";

const Home = () => {
    // --- 1. State cho dữ liệu sản phẩm ---
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

    // --- Ref cho Animation Slider ---
    const trackRef = useRef<HTMLDivElement>(null);

    // --- 2. Fetch API lấy sản phẩm ---
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                // Chỉ lấy 4 sản phẩm đầu tiên làm "Sản phẩm nổi bật"
                setFeaturedProducts(data.slice(0, 4));
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm trang chủ:", error);
            }
        };

        fetchProducts();
    }, []);

    // --- 3. Animation Logic (Giữ nguyên từ code cũ) ---
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const handleMouseDown = (e: MouseEvent) => {
            track.dataset.mouseDownAt = e.clientX.toString();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (track.dataset.mouseDownAt === "0") return;

            const mouseDelta = parseFloat(track.dataset.mouseDownAt || "0") - e.clientX;
            const maxDelta = window.innerWidth / 2;

            const percentage = (mouseDelta / maxDelta) * -100;
            const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage || "0") + percentage;

            const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

            track.dataset.percentage = nextPercentage.toString();

            track.animate({
                transform: `translate(${nextPercentage}%, -50%)`
            }, { duration: 1200, fill: "forwards" });

            for (const image of Array.from(track.getElementsByClassName("image"))) {
                (image as HTMLElement).animate({
                    objectPosition: `${nextPercentage + 100}% 50%`
                }, { duration: 1200, fill: "forwards" });
            }
        };

        const handleMouseUp = () => {
            track.dataset.mouseDownAt = "0";
            track.dataset.prevPercentage = track.dataset.percentage;
        };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="home-container">
            {/* --- HERO SLIDER (Giữ nguyên) --- */}
            <div className="hero-section">
                <div className="hero-text">
                    <h2>Bộ Sưu Tập Mới</h2>
                    <p>Khám phá nghệ thuật thủ công. <br/> <span>(Kéo để xem thêm &larr; &rarr;)</span></p>
                </div>

                <div
                    id="image-track"
                    ref={trackRef}
                    data-mouse-down-at="0"
                    data-prev-percentage="0"
                >
                    <img className="image" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" draggable="false" />
                    <img className="image" src="https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800" draggable="false" />
                    <img className="image" src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800" draggable="false" />
                    <img className="image" src="https://images.unsplash.com/photo-1550921096-c037fa9d00b9?w=800" draggable="false" />
                    <img className="image" src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=800" draggable="false" />
                    <img className="image" src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800" draggable="false" />
                    <img className="image" src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800" draggable="false" />
                </div>
            </div>

            {/* --- FEATURED PRODUCTS (Dữ liệu thật) --- */}
            <div className="products-section">
                <div className="section-header">
                    <h3>Sản Phẩm Nổi Bật</h3>
                    <a href="/products" className="view-all">Xem tất cả &rarr;</a>
                </div>

                <div className="products-grid">
                    {featuredProducts.length > 0 ? (
                        featuredProducts.map((product) => {
                            // Xử lý ảnh: Lấy ảnh đầu tiên hoặc ảnh placeholder
                            const imageUrl = (product.images && product.images.length > 0)
                                ? product.images[0]
                                : "https://via.placeholder.com/500";

                            return (
                                <div key={product.id} className="product-card">
                                    <div className="product-img-wrapper">
                                        <img src={imageUrl} alt={product.name} />

                                        {/* Nút Yêu thích */}
                                        <button className="wishlist-btn" title="Yêu thích">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </button>

                                        {/* Nhóm nút hành động */}
                                        <div className="action-buttons">
                                            <button className="btn add-to-cart">Thêm giỏ</button>
                                            <button className="btn buy-now">Mua ngay</button>
                                        </div>
                                    </div>

                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <span className="price">
                                            {product.price.toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p style={{textAlign: "center", width: "100%"}}>Đang tải sản phẩm...</p>
                    )}
                </div>
            </div>

             <Footer />
        </div>
    );
}

export default Home;