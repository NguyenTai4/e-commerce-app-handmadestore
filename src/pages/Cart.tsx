import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Trash2, Minus, Plus, ShoppingBag} from 'lucide-react';


const Cart = () => {
    // 1. Khởi tạo State với dữ liệu mẫu
    const [items, setItems] = useState([
        {
            id: 1,
            name: "Nến thơm Handmade hương Lavender & Cam ngọt",
            price: 150000,
            quantity: 1,
            image: "img/hand_made_1.jpg",
            variant: "Hũ thủy tinh 200g"
        },
        {
            id: 2,
            name: "Túi Tote vải Canvas thêu tay họa tiết hoa nhí",
            price: 220000,
            quantity: 2,
            image: "https://placehold.co/150x150/efe5d9/333?text=Tote+Bag",
            variant: "Màu kem - Mẫu A"
        }
    ]);

    // 2. Hàm tăng số lượng
    const increaseQty = (id: number) => {
        const newItems = items.map(item =>
            item.id === id ? {...item, quantity: item.quantity + 1} : item
        );
        setItems(newItems);
    };

    // 3. Hàm giảm số lượng (tối thiểu là 1)
    const decreaseQty = (id: number) => {
        const newItems = items.map(item =>
            item.id === id && item.quantity > 1
                ? {...item, quantity: item.quantity - 1}
                : item
        );
        setItems(newItems);
    };

    // 4. Hàm xóa sản phẩm
    const removeItem = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            const filteredItems = items.filter(item => item.id !== id);
            setItems(filteredItems);
        }
    };

    // 5. Tính toán các con số (Sẽ tự động chạy lại mỗi khi 'items' thay đổi)
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = items.length > 0 ? 30000 : 0;
    const total = subtotal + shippingFee;

    const formatCurrency = (amount: number | bigint) => {
        return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(amount);
    };

    // 6. Hàm xử lý nhập tay
    const updateQty = (id: number, value: number) => {
        if (value < 1 || isNaN(value)) return;

        setItems(items.map(item =>
            item.id === id ? {...item, quantity: value} : item
        ));
    };
    const navigate = useNavigate();
    return (
        <div className="cart-page-container">
            <div className="cart-header">
                <h1><ShoppingBag size={28} style={{marginRight: '10px', marginBottom: '-4px'}}/>Giỏ hàng của bạn</h1>
                <p>{items.length} sản phẩm trong giỏ</p>
            </div>

            <div className="cart-layout">
                {items.length > 0 ? (
                    <>
                        <div className="cart-items-column">
                            {items.map((item) => (
                                <div className="cart-item-card" key={item.id}>
                                    <div className="item-image-wrapper">
                                        <img src={item.image} alt={item.name}/>
                                    </div>

                                    <div className="item-details">
                                        <div className="item-info-top">
                                            <div>
                                                <h3>{item.name}</h3>
                                                <p className="item-variant">{item.variant}</p>
                                            </div>
                                            <button
                                                className="btn-remove"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>

                                        <div className="item-actions-bottom">
                                            <div className="item-price">
                                                {formatCurrency(item.price)}
                                            </div>

                                            <div className="item-quantity-wrapper">
                                                <button
                                                    className="qty-btn"
                                                    disabled={item.quantity === 1}
                                                    onClick={() => decreaseQty(item.id)}
                                                >
                                                    <Minus size={16}/>
                                                </button>

                                                <input
                                                    type="number"
                                                    className="qty-input"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                                                />

                                                <button
                                                    className="qty-btn"
                                                    onClick={() => increaseQty(item.id)}
                                                >
                                                    <Plus size={16}/>
                                                </button>
                                            </div>

                                            <div className="item-line-total">
                                                Tổng: {formatCurrency(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary-column">
                            <div className="cart-summary-card">
                                <h2>Tóm tắt đơn hàng</h2>
                                <div className="summary-row">
                                    <span>Tạm tính:</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Phí vận chuyển:</span>
                                    <span>{formatCurrency(shippingFee)}</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-row summary-total">
                                    <span>Tổng cộng:</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <p className="tax-note">(Đã bao gồm thuế VAT nếu có)</p>
                                <button
                                    className="checkout-btn"
                                    onClick={() => navigate("/checkout")}
                                >
                                    Tiến hành thanh toán
                                </button>

                                <button
                                    className="continue-shopping-btn"
                                    onClick={() => navigate("/")}
                                >
                                    Tiếp tục mua sắm
                                </button>

                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-cart">
                        <p>Giỏ hàng của bạn đang trống.</p>
                        <button className="continue-shopping-btn">Quay lại cửa hàng</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;