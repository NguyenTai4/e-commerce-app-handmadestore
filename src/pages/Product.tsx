import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService"; // Import service
import { Product } from "../types/Product";
/* =======================

TYPES & CONSTANTS

======================= */

type CategoryKey = "all" | "wood" | "yarn"|"material"|"tool";
const CATEGORY_MAP: Record<CategoryKey, string> = {

    all: "Tất cả",

    wood: "Đồ gỗ",

    yarn: "Đồ len",

    material: "Cotton",

    tool: "Kim loại",

};
const Products: React.FC = () => {
// 1. State lưu trữ dữ liệu từ API
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
    const [priceRange, setPriceRange] = useState<number>(1_500_000);
    const [sortType, setSortType] = useState<string>("newest");
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getAllProducts();
                console.log(data);
                setProducts(data);
            } catch (err: any) {
                console.error("Lỗi tải sản phẩm:", err);
                setError("Không thể tải danh sách sản phẩm.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products
        .filter((p: Product) =>
            activeCategory === "all" ? true : p.category === activeCategory
        )
        .filter((p: Product) => p.price <= priceRange)
        .sort((a: Product, b: Product) => {
            switch (sortType) {
                case "price-asc":
                    return a.price - b.price;
                case "price-desc":
                    return b.price - a.price;
                case "rating":
                    return b.rating - a.rating;
                default:
                    return b.id - a.id;
            }
        });
    if (isLoading) return <div className="loading">Đang tải sản phẩm...</div>;
    if (error) return <div className="error">{error}</div>;
    return (
        <div className="products-page">
            <div className="products-hero">
                <div className="hero-content">
                    <h1>Sản phẩm Handmade</h1>
                    <div className="divider-icon">✦</div>
                    <p>Tinh hoa nghệ thuật thủ công & sáng tạo</p>
                </div>
            </div>

            <div className="products-container">
                <aside className="filter-sidebar">
                    <h3>Danh mục</h3>
                    <ul className="category-list">
                        {(Object.keys(CATEGORY_MAP) as CategoryKey[]).map((key) => (
                            <li
                                key={key}
                                className={activeCategory === key ? "active" : ""}
                                onClick={() => setActiveCategory(key)}
                            >
                                {CATEGORY_MAP[key]}
                            </li>
                        ))}

                    </ul>
                    <h3>Giá tối đa</h3>
                    <p>{priceRange.toLocaleString()}đ</p>
                    <input
                        type="range"
                        min={0}
                        max={1_500_000}
                        step={50_000}
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                    />
                </aside>

                <main className="product-main">
                    <div className="sort-bar">
                        <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
                            <option value="newest">Mới nhất</option>
                            <option value="price-asc">Giá thấp → cao</option>
                            <option value="price-desc">Giá cao → thấp</option>
                            <option value="rating">Đánh giá cao</option>
                        </select>
                    </div>

                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product: Product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <p>Không tìm thấy sản phẩm nào.</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

interface ProductCardProps {
    product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const imageUrl = product.image;
    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="image-wrapper">
                <img src={imageUrl} alt={product.name} />
                {product.stock === 0 && <span className="product-tag tag-hot">Hết hàng</span>}
            </div>
            <div className="card-info">
                <h4>{product.name}</h4>
                <p className="price">{product.price.toLocaleString()}đ</p>
                <p className="rating">⭐ {product.rating}</p>
            </div>
        </Link>
    );
};

export default Products;