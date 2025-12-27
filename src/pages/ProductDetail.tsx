import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const ProductDetail = () => {
    // Giả lập dữ liệu tĩnh để hiển thị giao diện
    const product = {
        id: 1,
        name: "Túi Tote Canvas Vintage",
        price: "150.000đ",
        originalPrice: "200.000đ",
        description: "Chiếc túi Canvas mang phong cách Vintage nhẹ nhàng, phù hợp cho những ngày dạo phố hay đi học. Chất liệu vải dày dặn, đường may tỉ mỉ, thân thiện với môi trường.",
        images: [
            "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800",
            "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800",
            "https://images.unsplash.com/photo-1554260570-e9689a3418b8?w=800"
        ],
        colors: ["#D2B48C", "#556B2F", "#1a1a1a"], // Mã màu
        sizes: ["S", "M", "L"]
    };

    // State cho giao diện (đổi ảnh, số lượng, chọn size/màu)
    const [mainImage, setMainImage] = useState(product.images[0]);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);

    return (
        <div className="page-wrapper">

            <div className="product-detail-container">
                {/* --- CỘT TRÁI: ẢNH SẢN PHẨM --- */}
                <div className="product-gallery">
                    <div className="main-image-frame">
                        <img src={mainImage} alt="Main Product" />
                    </div>
                    <div className="thumbnail-list">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`thumb-${index}`}
                                className={mainImage === img ? "active" : ""}
                                onClick={() => setMainImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* --- CỘT PHẢI: THÔNG TIN --- */}
                <div className="product-info">
                    <div className="breadcrumb-text">Trang chủ / Túi xách / {product.name}</div>

                    <h1 className="product-name">{product.name}</h1>

                    <div className="product-meta">
                        <div className="rating">
                            ★★★★☆ <span>(4.8/5 đánh giá)</span>
                        </div>
                        <div className="status">Còn hàng</div>
                    </div>

                    <div className="product-price-box">
                        <span className="current-price">{product.price}</span>
                        <span className="old-price">{product.originalPrice}</span>
                        <span className="discount-tag">-25%</span>
                    </div>

                    <p className="description">{product.description}</p>

                    {/* Chọn Màu */}
                    <div className="options-group">
                        <span className="option-label">Màu sắc:</span>
                        <div className="color-options">
                            {product.colors.map((color, index) => (
                                <button
                                    key={index}
                                    style={{ backgroundColor: color }}
                                    className={selectedColor === color ? "selected" : ""}
                                    onClick={() => setSelectedColor(color)}
                                ></button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn Size */}
                    <div className="options-group">
                        <span className="option-label">Kích thước:</span>
                        <div className="size-options">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={selectedSize === size ? "selected" : ""}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chọn Số lượng & Nút Mua */}
                    <div className="action-group">
                        <div className="quantity-control">
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                            <input type="text" value={quantity} readOnly />
                            <button onClick={() => setQuantity(q => q + 1)}>+</button>
                        </div>

                        <div className="buttons-wrapper">
                            <button className="btn-add-cart">Thêm vào giỏ</button>
                            <button className="btn-buy-now">Mua ngay</button>
                        </div>
                    </div>

                    {/* Chính sách (Icon minh họa bằng emoji hoặc SVG) */}
                    <div className="policy-section">
                        <div className="policy-item">
                            <span className="icon">🚚</span>
                            <div>
                                <strong>Miễn phí vận chuyển</strong>
                                <p>Cho đơn hàng trên 500k</p>
                            </div>
                        </div>
                        <div className="policy-item">
                            <span className="icon">↩️</span>
                            <div>
                                <strong>Đổi trả dễ dàng</strong>
                                <p>Trong vòng 7 ngày</p>
                            </div>
                        </div>
                        <div className="policy-item">
                            <span className="icon">🛡️</span>
                            <div>
                                <strong>Bảo hành chính hãng</strong>
                                <p>Cam kết chất lượng 100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;