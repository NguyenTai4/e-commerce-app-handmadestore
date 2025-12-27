import {useEffect, useRef, useState} from "react";
// import Footer from "./Footer"; // Bật lại nếu bạn đã có Footer

// Dữ liệu sản phẩm mẫu
const PRODUCTS = [
    {
        id: 1,
        name: "Túi Tote Canvas",
        price: "150.000đ",
        img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500"
    },
    {
        id: 2,
        name: "Vòng Tay Handmade",
        price: "45.000đ",
        img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500"
    },
    {
        id: 3,
        name: "Nến Thơm Organic",
        price: "200.000đ",
        img: "https://images.unsplash.com/photo-1602825485432-6993ad87c7d2?w=500"
    },
    {
        id: 4,
        name: "Gốm Sứ Bát Tràng",
        price: "320.000đ",
        img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500"
    },
];

const Home = () => {
    const trackRef = useRef<HTMLDivElement>(null);

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

            // Giới hạn kéo từ -100% đến 0%
            const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

            track.dataset.percentage = nextPercentage.toString();

            // Hiệu ứng Animation cho Track
            track.animate({
                transform: `translate(${nextPercentage}%, -50%)`
            }, {duration: 1200, fill: "forwards"});

            // Hiệu ứng Parallax cho từng ảnh bên trong
            for (const image of Array.from(track.getElementsByClassName("image"))) {
                (image as HTMLElement).animate({
                    objectPosition: `${nextPercentage + 100}% 50%`
                }, {duration: 1200, fill: "forwards"});
            }
        };

        const handleMouseUp = () => {
            track.dataset.mouseDownAt = "0";
            track.dataset.prevPercentage = track.dataset.percentage;
        };

        // Gán sự kiện vào window để kéo mượt hơn (không bị tuột khi chuột ra khỏi div)
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

            {/* --- HERO SLIDER (70% Height) --- */}
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
                    {/* Sử dụng ảnh mẫu Unsplash để demo đẹp hơn, bạn thay lại ảnh của bạn nhé */}
                    <img className="image" src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
                         draggable="false"/>
                    <img className="image" src="https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800"
                         draggable="false"/>
                    <img className="image" src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800"
                         draggable="false"/>
                    <img className="image" src="https://images.unsplash.com/photo-1550921096-c037fa9d00b9?w=800"
                         draggable="false"/>
                    <img className="image" src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=800"
                         draggable="false"/>
                    <img className="image" src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800"
                         draggable="false"/>
                    <img className="image" src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800"
                         draggable="false"/>
                </div>
            </div>

            {/* --- FEATURED PRODUCTS --- */}
            <div className="products-section">
                <div className="section-header">
                    <h3>Sản Phẩm Nổi Bật</h3>
                    <a href="/products" className="view-all">Xem tất cả &rarr;</a>
                </div>

                <div className="products-grid">
                    {PRODUCTS.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-img-wrapper">
                                <img src={product.img} alt={product.name}/>
                                <button className="add-to-cart-btn">Thêm vào giỏ</button>
                            </div>
                            <div className="product-info">
                                <h4>{product.name}</h4>
                                <span className="price">{product.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* <Footer /> */}
        </div>
    );
}

export default Home;