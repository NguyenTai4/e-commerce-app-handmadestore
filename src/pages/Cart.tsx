import React, {useEffect, useState} from "react";
import {cartService} from "../services/cartService";
import {getAuth} from "../utils/authStorage";
import Navigate, {useNavigate} from "react-router-dom";
import {CartItem, CartResponse} from "../types/Cart";

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchCart = async () => {
            const auth = getAuth();
            if (!auth?.accessToken) {
                setError("Vui lòng đăng nhập để xem giỏ hàng");
                setLoading(false);
                return;
            }

            try {
                const data = await cartService.getCart() as CartResponse;
                setItems(data.items || []);
            } catch (err) {
                console.error(err);
                setError("Lỗi tải giỏ hàng.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const updateCartData = async (newItems: CartItem[]) => {
        setItems(newItems);
        try {
            await cartService.updateCart(newItems);
        } catch (err) {
            console.error("Lỗi sync server:", err);
            alert("Có lỗi khi cập nhật giỏ hàng!");
        }
    };

    const handleIncrease = (productId: number) => {
        const newItems = items.map((item) =>
            item.productId === productId
                ? {...item, quantity: item.quantity + 1}
                : item
        );
        updateCartData(newItems);
    };

    const handleDecrease = (productId: number) => {
        const newItems = items.map((item) => {
            if (item.productId === productId) {
                const newQty = item.quantity > 1 ? item.quantity - 1 : 1;
                return {...item, quantity: newQty};
            }
            return item;
        });
        updateCartData(newItems);
    };

    const handleRemove = (productId: number) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        const newItems = items.filter((item) => item.productId !== productId);
        updateCartData(newItems);
    };

    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Format tiền tệ
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(amount);

    if (loading) return <div className="cart-page-container" style={{textAlign: 'center'}}>Đang tải dữ liệu...</div>;
    if (error) return <div className="cart-page-container" style={{textAlign: 'center', color: 'red'}}>{error}</div>;

    return (
        <div className="cart-page-container">
            <div className="cart-header">
                <h1>Giỏ hàng của bạn</h1>
                <p>Bạn đang có {items.length} sản phẩm trong giỏ hàng</p>
            </div>

            {items.length === 0 ? (
                <div style={{textAlign: "center", padding: "40px"}}>
                    <p>Giỏ hàng đang trống.</p>
                    <button onClick={() => navigate("/")} className="continue-shopping-btn" style={{
                        width: "200px",
                        margin: "20px auto"
                    }}>
                        Mua sắm ngay
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items-column">
                        {items.map((item) => (
                            <div className="cart-item-card" key={item.productId}>
                                <div className="item-image-wrapper">
                                    <img src={item.image} alt={item.name}/>
                                </div>

                                <div className="item-details">
                                    <div className="item-info-top">
                                        <div>
                                            <h3>{item.name}</h3>
                                            <p className="item-variant">Phân loại: Tiêu chuẩn</p>
                                        </div>
                                        <button
                                            className="btn-remove"
                                            onClick={() => handleRemove(item.productId)}
                                            title="Xóa sản phẩm"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                 strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path
                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="item-actions-bottom">
                                        <div className="item-price">
                                            {formatCurrency(item.price)}
                                        </div>

                                        <div className="item-quantity-wrapper">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleDecrease(item.productId)}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                className="qty-input"
                                                value={item.quantity}
                                                readOnly
                                            />
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleIncrease(item.productId)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="item-line-total">
                                            {formatCurrency(item.price * item.quantity)}
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
                                <span>Tạm tính</span>
                                <span>{formatCurrency(subTotal)}</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row summary-total">
                                <span>Tổng cộng</span>
                                <span>{formatCurrency(subTotal)}</span>
                            </div>

                            <p className="tax-note">(Đã bao gồm VAT nếu có)</p>

                            <button onClick={() => {
                                navigate("/checkout", {
                                    state: {
                                        items: items,
                                        total: subTotal
                                    }
                                });
                            }} className="checkout-btn">
                                Tiến hành thanh toán
                            </button>

                            <button onClick={() => (navigate("/"))} className="continue-shopping-btn">
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;