import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { Product } from "../types/Product";
import Footer from "./Footer";
import Header from "./Header";
import { cartService } from "../services/cartService";

const Home = () => {
    const navigate = useNavigate();
    const trackRef = useRef<HTMLDivElement>(null);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [sliderProducts, setSliderProducts] = useState<Product[]>([]);
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const handleMouseDown = (e: MouseEvent) => {
            track.dataset.mouseDownAt = e.clientX.toString();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (track.dataset.mouseDownAt === "0") return;

            const mouseDelta =
                parseFloat(track.dataset.mouseDownAt || "0") - e.clientX;
            const maxDelta = window.innerWidth / 2;

            const percentage = (mouseDelta / maxDelta) * -100;
            const nextPercentageUnconstrained =
                parseFloat(track.dataset.prevPercentage || "0") + percentage;

            const nextPercentage = Math.max(
                Math.min(nextPercentageUnconstrained, 0),
                -100
            );

            track.dataset.percentage = nextPercentage.toString();

            track.animate(
                { transform: `translate(${nextPercentage}%, -50%)` },
                { duration: 1200, fill: "forwards" }
            );

            for (const image of Array.from(track.getElementsByClassName("image"))) {
                (image as HTMLElement).animate(
                    { objectPosition: `${nextPercentage + 100}% 50%` },
                    { duration: 1200, fill: "forwards" }
                );
            }
        };

        const handleMouseUp = () => {
            track.dataset.mouseDownAt = "0";
            track.dataset.prevPercentage = track.dataset.percentage || "0";
        };

        track.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            track.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    /* ===== FETCH PRODUCT ===== */
    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts();
            setFeaturedProducts(data.slice(0, 4));
            setSliderProducts(data.slice(0, 5));
        };
        fetchProducts();
    }, []);

    const handleAddToCart = async (
        e: React.MouseEvent,
        product: Product
    ) => {
        // Quan trọng: Ngăn chặn sự kiện click lan ra thẻ Link cha (tránh bị chuyển trang)
        e.preventDefault();
        e.stopPropagation();

        try {
            // Gọi API thêm vào giỏ (Mặc định số lượng là 1)
            await cartService.addToCart(product.id, 1);

        } catch (error: any) {
            console.error("Add to cart error:", error);

            if (error.message === "No token" || error.message === "Unauthorized") {
                const confirmLogin = window.confirm("Bạn cần đăng nhập để mua hàng. Đi tới trang đăng nhập?");
                if (confirmLogin) {
                    navigate("/login");
                }
            } else {
                alert("❌ Lỗi: " + (error.message || "Không thể thêm vào giỏ hàng"));
            }
        }
    };

    return (
        <div className="home-container">
            {/* ===== HERO SECTION ===== */}
            <div className="hero-section">
                <div className="hero-text">
                    <h2>Bộ Sưu Tập Mới</h2>
                    <p>
                        Khám phá nghệ thuật thủ công <br />
                        <span>(Kéo để xem thêm &larr; &rarr;)</span>
                    </p>
                </div>

                <div id="image-track" ref={trackRef} data-mouse-down-at="0" data-prev-percentage="0">
                    {sliderProducts.map((product) => (
                        <img
                            key={product.id}
                            className="image"
                            src={product.image}
                            draggable="false"
                            alt={product.name}
                            onClick={(e) => {
                                // Simple check to avoid navigation on drag
                                const track = trackRef.current;
                                if (track && track.dataset.mouseDownAt === "0") {
                                    navigate(`/product/${product.id}`, { state: { product } });
                                }
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="products-section">
                <div className="section-header">
                    <h3>Sản Phẩm Nổi Bật</h3>
                    <Link to="/products" className="view-all">
                        Xem tất cả →
                    </Link>
                </div>

                <div className="products-grid">
                    {featuredProducts.map((product) => (
                        <Link
                            to={`/product/${product.id}`}
                            state={{ product }}
                            key={product.id}
                            className="product-card"
                        >
                            <div className="product-img-wrapper">
                                <img src={product.image} alt={product.name} loading="lazy" />
                                <div className="action-buttons">
                                    <button className="btn add-to-cart" onClick={(e) =>
                                        handleAddToCart(e, product)}>
                                        Thêm vào giỏ hàng
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
                    ))}
                </div>
            </div>
            {/* ===== DISCOUNT SECTION (UI ONLY) ===== */}
            <section className="discount-section">
                <div className="discount-content">
                    <h5>Ưu đãi đặc biệt</h5>
                    <h2>Giảm Giá Lên Đến 50%</h2>
                    <p>
                        Những sản phẩm thủ công tinh xảo đang chờ bạn khám phá.
                        Ưu đãi có thời hạn – đừng bỏ lỡ!
                    </p>

                    {/* Countdown UI (chỉ giao diện) */}
                    <Link to="/products" className="discount-btn">
                        Xem sản phẩm giảm giá
                    </Link>
                </div>

                <div className="discount-image">
                    <img
                        src="data:image/png;base64,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"
                        alt="Discount Product"
                    />
                </div>
            </section>

        </div>
    );
};

export default Home;
