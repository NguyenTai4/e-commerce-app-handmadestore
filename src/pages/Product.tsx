import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import { Product } from "../types/Product";

/* ... Các phần TYPES & CONSTANTS giữ nguyên ... */
type CategoryKey = "all" | "wood" | "yarn";
const CATEGORY_MAP: Record<CategoryKey, string> = { all: "Tất cả", wood: "Đồ gỗ", yarn: "Đồ len" };

const Products: React.FC = () => {
    // ... (Giữ nguyên logic state, useEffect fetch data, filter sort) ...
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
    const [priceRange, setPriceRange] = useState<number>(1_500_000);
    const [sortType, setSortType] = useState<string>("newest");

    useEffect(() => {
        const fetchData = async () => {
            /* Giữ nguyên logic fetch */
            try {
                const data = await getAllProducts();
                setProducts(data);
                setIsLoading(false);
            } catch(e) { console.log(e); setIsLoading(false);}
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => activeCategory === "all" ? true : p.category === activeCategory)
        .filter(p => p.price <= priceRange)
        .sort((a, b) => b.id - a.id); // Code sort rút gọn cho ví dụ

    if (isLoading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="products-page">
            {/* ... Giữ nguyên phần Hero & Sidebar ... */}

            <div className="products-container">
                <aside className="filter-sidebar">
                    {/* ... Code Sidebar cũ ... */}
                    <h3>Danh mục</h3>
                    {/* Render danh mục như cũ */}
                </aside>

                <main className="product-main">
                    {/* ... Sort bar cũ ... */}

                    <div className="product-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

/* =======================
   PRODUCT CARD COMPONENT (ĐÃ SỬA)
======================= */
interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    // Hàm thêm vào giỏ hàng
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // QUAN TRỌNG: Ngăn không cho Link kích hoạt chuyển trang
        e.stopPropagation();
        alert(`Đã thêm ${product.name} vào giỏ!`);
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="image-wrapper">
                <img
                    src={product.images || "https://via.placeholder.com/300"}
                    alt={product.name}
                />

                {product.stock === 0 && <span className="product-tag tag-hot">Hết hàng</span>}

                {/* NÚT THÊM VÀO GIỎ HÀNG MỚI */}
                {product.stock > 0 && (
                    <button className="btn-quick-add" onClick={handleAddToCart}>
                        + Thêm vào giỏ
                    </button>
                )}
            </div>

            <div className="card-info">
                <h4>{product.name}</h4>
                <div className="price-row">
                    <p className="price">{product.price.toLocaleString()}đ</p>
                    {/* Có thể thêm rating nhỏ ở đây */}
                </div>
            </div>
        </Link>
    );
};

export default Products;