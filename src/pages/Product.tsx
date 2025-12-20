import React, { useState } from "react";
import Header from "./Header";

const PRODUCTS_DATA = [
    { id: 1, name: "Túi Tote Thêu Tay", price: 350000, image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600", tag: "Best Seller", category: "Đồ vải" },
    { id: 2, name: "Bình Gốm Men Rạn", price: 520000, image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600", tag: "Mới", category: "Đồ gốm" },
    { id: 3, name: "Khuyên Tai Bạc", price: 280000, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600", tag: null, category: "Trang sức" },
    { id: 4, name: "Nến Thơm Organic", price: 180000, image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600", tag: "-10%", category: "Trang trí" },
    { id: 5, name: "Khăn Len Handmade", price: 450000, image: "https://images.unsplash.com/photo-1629029193630-36365a259961?auto=format&fit=crop&q=80&w=600", tag: null, category: "Đồ len" },
    { id: 6, name: "Bộ Ấm Trà Zen", price: 890000, image: "https://images.unsplash.com/photo-1590326071738-f864860f7e4b?auto=format&fit=crop&q=80&w=600", tag: "Limited", category: "Đồ gốm" },
];

const CATEGORIES = ["Tất cả", "Đồ gốm", "Đồ len", "Trang sức", "Trang trí nhà cửa", "Đồ vải"];

const Products = () => {
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const [priceRange, setPriceRange] = useState(500000);

    return (
        <div className="products-page">
            <Header />

            {/* 1. Hero Section: Thêm background image mờ để tạo mood */}
            <section className="products-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Bộ Sưu Tập Thủ Công</h1>
                    <div className="divider-icon">✦</div>
                    <p>Nơi những giá trị truyền thống gặp gỡ thiết kế hiện đại</p>
                </div>
            </section>

            <div className="products-container">
                {/* 2. Sidebar Filter */}
                <aside className="filter-sidebar">
                    <div className="filter-group">
                        <h3>Danh mục</h3>
                        <ul className="category-list">
                            {CATEGORIES.map((cat) => (
                                <li
                                    key={cat}
                                    className={activeCategory === cat ? "active" : ""}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h3>Khoảng giá</h3>
                        <div className="price-range-wrapper">
                            <div className="range-info">
                                <span>0đ</span>
                                <span className="current-price">{priceRange.toLocaleString()}đ</span>
                                <span>1tr+</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1000000"
                                step="50000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="custom-range"
                            />
                        </div>
                    </div>
                </aside>

                {/* 3. Main Content */}
                <main className="product-main">
                    <div className="sort-bar">
                        <span className="result-count">Hiển thị {PRODUCTS_DATA.length} sản phẩm</span>
                        <div className="sort-dropdown">
                            <label>Sắp xếp:</label>
                            <select>
                                <option>Mới nhất</option>
                                <option>Giá: Thấp đến Cao</option>
                                <option>Giá: Cao đến Thấp</option>
                                <option>Bán chạy nhất</option>
                            </select>
                        </div>
                    </div>

                    <div className="product-grid">
                        {PRODUCTS_DATA.map((product) => (
                            <ProductCard
                                key={product.id}
                                image={product.image}
                                name={product.name}
                                price={product.price}
                                tag={product.tag}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Component Card được nâng cấp
const ProductCard = ({ image, name, price, tag }: any) => (
    <div className="product-card">
        <div className="image-wrapper">
            {tag && <span className={`product-tag ${tag === 'Best Seller' ? 'tag-hot' : 'tag-new'}`}>{tag}</span>}
            <img src={image} alt={name} loading="lazy" />

            {/* Action Overlay */}
            <div className="card-actions">
                <button className="action-btn" title="Thêm vào giỏ">
                    {/* Dùng SVG icon thay vì text để đẹp hơn */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path><path d="M20 20a1 1 0 1 0 0 2 1 1 0 1 0 0-2z"></path><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                </button>
                <button className="action-btn" title="Xem nhanh">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </div>
        </div>

        <div className="card-info">
            <h4 className="product-name">{name}</h4>
            <div className="price-row">
                <span className="price">{price.toLocaleString()}đ</span>
            </div>
        </div>
    </div>
);

export default Products;