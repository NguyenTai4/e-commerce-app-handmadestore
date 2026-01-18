import React, {useEffect, useState, useMemo} from "react";
import {cartService} from "../services/cartService";
import {getAuth} from "../utils/authStorage";
import {useNavigate} from "react-router-dom";
import {CartItem, CartResponse} from "../types/Cart";

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const toggleSelect = (productId: number) => {
        if (selectedIds.includes(productId)) {
            setSelectedIds(selectedIds.filter(id => id !== productId));
        } else {
            setSelectedIds([...selectedIds, productId]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === items.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.map(item => item.productId));
        }
    };
    const confirmDeleteSelected = () => {
        const newItems = items.filter((item) => !selectedIds.includes(item.productId));
        updateCartData(newItems);
        setSelectedIds([]);
        setShowDeleteModal(false);
    };

    const handleRemoveSingle = (productId: number) => {
        if (!window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) return;
        const newItems = items.filter((item) => item.productId !== productId);
        updateCartData(newItems);
        setSelectedIds(selectedIds.filter(id => id !== productId));
    };

    const selectedItems = useMemo(() => {
        return items.filter(item => selectedIds.includes(item.productId));
    }, [items, selectedIds]);

    const totalPayment = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(amount);

    const handleCheckout = () => {
        if (selectedIds.length === 0) return;

        navigate("/checkout", {
            state: {
                items: selectedItems,
                total: totalPayment
            }
        });
    };

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
                    <button onClick={() => navigate("/")} className="continue-shopping-btn"
                            style={{width: "200px", margin: "20px auto"}}>
                        Mua sắm ngay
                    </button>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items-column">

                        <div className="cart-actions-bar">
                            <label className="select-all-label">
                                <input
                                    type="checkbox"
                                    className="custom-checkbox"
                                    checked={selectedIds.length === items.length && items.length > 0}
                                    onChange={toggleSelectAll}
                                />
                                Chọn tất cả ({items.length})
                            </label>

                            {selectedIds.length > 0 && (
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="btn-bulk-delete"
                                >
                                    🗑 Xóa ({selectedIds.length}) sản phẩm đã chọn
                                </button>
                            )}
                        </div>

                        {items.map((item) => (
                            <div className="cart-item-card" key={item.productId}>
                                <div className="checkbox-wrapper">
                                    <input
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={selectedIds.includes(item.productId)}
                                        onChange={() => toggleSelect(item.productId)}
                                    />
                                </div>

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
                                            onClick={() => handleRemoveSingle(item.productId)}
                                            title="Xóa sản phẩm này"
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
                                            <button className="qty-btn"
                                                    onClick={() => handleDecrease(item.productId)}>-
                                            </button>
                                            <input type="number" className="qty-input" value={item.quantity} readOnly/>
                                            <button className="qty-btn"
                                                    onClick={() => handleIncrease(item.productId)}>+
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
                                <span>Đã chọn</span>
                                <span>{selectedIds.length} sản phẩm</span>
                            </div>

                            <div className="summary-row">
                                <span>Tạm tính</span>
                                <span>{formatCurrency(totalPayment)}</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row summary-total">
                                <span>Tổng cộng</span>
                                <span className={`total-price-display ${selectedIds.length > 0 ? 'active' : ''}`}>
                    {formatCurrency(totalPayment)}
                </span>
                            </div>

                            <p className="tax-note">(Đã bao gồm VAT nếu có)</p>

                            <button
                                onClick={handleCheckout}
                                className="checkout-btn"
                                disabled={selectedIds.length === 0}
                            >
                                {selectedIds.length === 0 ? "Vui lòng chọn sản phẩm" : `Thanh toán (${selectedIds.length})`}
                            </button>

                            <button onClick={() => (navigate("/"))} className="continue-shopping-btn">
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Xác nhận xóa</h3>
                        <p className="modal-desc">
                            Bạn có chắc chắn muốn xóa <b>{selectedIds.length}</b> sản phẩm đã chọn khỏi giỏ hàng?
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn-modal btn-modal-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="btn-modal btn-modal-delete"
                                onClick={confirmDeleteSelected}
                            >
                                Xóa ngay
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;