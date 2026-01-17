import React, {useState, useEffect} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import Footer from "./Footer";
import {getProductById} from "../services/productService";
import {Product} from "../types/Product";
import {cartService} from "../services/cartService";

const ProductDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // State UI
    const [quantity, setQuantity] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<"desc" | "policy">("desc");

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                setError(null);

                const data = await getProductById(id);
                setProduct(data);

                // Reset số lượng
                setQuantity(1);
            } catch (err: any) {
                console.error(err);
                setError("Sản phẩm không tồn tại hoặc đã bị xóa.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
        window.scrollTo(0, 0);
    }, [id]);
    const handleAddToCart = async () => {
        if (!product) return;

        try {
            // Gọi API thêm vào giỏ với số lượng đang chọn (quantity)
            await cartService.addToCart(product.id, quantity);

            alert(`✅ Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`);
        } catch (error: any) {
            console.error("Add to cart error:", error);

            // Xử lý lỗi chưa đăng nhập
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
    if (isLoading) {
        return <div className="loading-container"><h3>⏳ Đang tải chi tiết sản phẩm...</h3></div>;
    }

    if (error || !product) {
        return (
            <div className="error-container">
                <h2>Oops! {error}</h2>
                <Link to="/">← Quay lại Cửa hàng</Link>
            </div>
        );
    }

    return (
        <>
            {/* Đã xóa chữ Z thừa ở đây */}
            <div className="product-detail-container">

                {/* CỘT TRÁI: GALLERY */}
                <div className="product-gallery">
                    <div className="main-image-frame">
                        <img
                            src={product.images || "https://via.placeholder.com/500"}
                            alt={product.name}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: INFO */}
                <div className="product-info">
                    <div className="breadcrumb">
                        <Link to="/">Trang
                            chủ</Link> / <span>{product.category || "Sản phẩm"}</span> / <strong>{product.name}</strong>
                    </div>

                    <h1 className="product-name">{product.name}</h1>

                    <div className="product-meta">
                        <span className="rating">⭐ {product.rating} / 5</span>
                        <span className={`stock-status ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                            {product.stock > 0 ? `Còn hàng` : "Hết hàng"}
                        </span>
                    </div>

                    <div className="price-box">
                        <span className="current-price">{product.price.toLocaleString()}đ</span>
                    </div>

                    <div className="description-box">
                        <p>{product.description}</p>
                        <p className="material-info"><strong>🎨 Chất liệu:</strong> {product.material || "Tự nhiên"}</p>
                    </div>

                    <div className="action-group">
                        <div className="quantity-control">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <input readOnly value={quantity}/>
                            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
                        </div>

                        <button
                            className="btn-add-cart"
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0
                                ? `THÊM VÀO GIỎ - ${(product.price * quantity).toLocaleString()}đ`
                                : "HẾT HÀNG"
                            }
                        </button>
                    </div>

                    <div className="extra-info-tabs">
                        <div className="tab-header">
                            <button
                                className={`tab-btn ${activeTab === "desc" ? "active" : ""}`}
                                onClick={() => setActiveTab("desc")}
                            >
                                Mô tả chi tiết
                            </button>
                            <button
                                className={`tab-btn ${activeTab === "policy" ? "active" : ""}`}
                                onClick={() => setActiveTab("policy")}
                            >
                                Chính sách bảo hành
                            </button>
                        </div>

                        <div className="tab-content">
                            {activeTab === "desc" ? (
                                <>
                                    <p>Sản phẩm được chế tác thủ công 100% từ các nghệ nhân lành nghề.</p>
                                    <ul style={{paddingLeft: "20px", marginTop: "10px"}}>
                                        <li>Chất liệu thân thiện với môi trường.</li>
                                        <li>Màu sắc tự nhiên, bền đẹp theo thời gian.</li>
                                        <li>Thích hợp làm quà tặng hoặc trang trí nhà cửa.</li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <p>✅ Đổi trả miễn phí trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.</p>
                                    <p>✅ Bảo hành đường may, mối nối trong 3 tháng.</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProductDetail;