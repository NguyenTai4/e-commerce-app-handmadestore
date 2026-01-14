import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { Product } from "../types/Product";
import Footer from "./Footer";

const Home = () => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
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
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (
        e: React.MouseEvent,
        product: Product
    ) => {
        e.preventDefault();
        alert(`Đã thêm "${product.name}" vào giỏ`);
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
                </div>
            </div>

            {/* ===== FEATURED PRODUCTS (MỚI) ===== */}
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
                                <img
                                    src={product.images}
                                    alt={product.name}
                                    loading="lazy"
                                />

                                <div className="action-buttons">
                                    <button
                                        className="btn add-to-cart"
                                        onClick={(e) =>
                                            handleAddToCart(e, product)
                                        }
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
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;
