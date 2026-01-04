import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    User,
    Phone,
    Mail,
    MapPin,
    CreditCard,
    Truck,
    ChevronLeft,
    ShoppingBag,
    CheckCircle,
    Tag,
    Loader
} from "lucide-react";
import {orderService} from "../services/orderService";
import {CartResponse} from "../types/Cart";

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as CartResponse;
    const cartItems = state?.items || [];
    const cartSubTotal = state?.total || 0; // Tổng tiền hàng (chưa ship/giảm giá)

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
        }
    }, [cartItems, navigate]);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: ""
    });

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    // Tính toán phí
    const shippingFee = 30000;
    const total = cartSubTotal + shippingFee - discount;

    // Format tiền tệ
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(amount);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleApplyVoucher = () => {
        if (!voucherCode) return;
        if (voucherCode.toUpperCase() === "SALE50") {
            setDiscount(50000);
            alert("Áp dụng mã SALE50: Giảm 50.000₫");
        } else if (voucherCode.toUpperCase() === "FREESHIP") {
            setDiscount(30000);
            alert("Áp dụng mã FREESHIP: Miễn phí vận chuyển");
        } else {
            setDiscount(0);
            alert("Mã giảm giá không hợp lệ.");
        }
    };

    const handlePlaceOrder = async () => {
        if (!formData.fullName || !formData.phone || !formData.address) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        setIsProcessing(true);

        try {
            await orderService.createOrder({
                fullName: formData.fullName,
                phone: formData.phone,
                address: `${formData.address} (Email: ${formData.email})`
            });

            setTimeout(() => {
                setIsProcessing(false);
                alert("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
                navigate("/");
            }, 1000);

        } catch (error: any) {
            setIsProcessing(false);
            alert("Lỗi: " + error.message);
        }
    };
    return (
        <div className="checkout-page-container">
            <div className="checkout-header">
                {/* Dùng <Link> thay vì <a> để không bị reload trang.
                   Nó vẫn render ra thẻ <a> trong HTML nên class "back-link" vẫn hoạt động bình thường.
                */}
                <Link to="/cart" className="back-link">
                    <ChevronLeft size={20}/> Quay lại giỏ hàng
                </Link>
                <h1>Thanh toán</h1>
                <p>Hoàn tất đơn hàng của bạn</p>
            </div>

            <div className="checkout-layout">
                <div className="checkout-form-column">
                    <div className="checkout-card">
                        <h2 className="card-title">
                            <MapPin size={22} className="icon-title"/>
                            Thông tin nhận hàng
                        </h2>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Họ và tên</label>
                                <div className="input-wrapper">
                                    <User size={18}/>
                                    <input
                                        name="fullName"
                                        type="text"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <div className="input-wrapper">
                                    <Phone size={18}/>
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="0912 xxx xxx"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <div className="input-wrapper">
                                    <Mail size={18}/>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Địa chỉ chi tiết</label>
                                <div className="input-wrapper top-align">
                                    <MapPin size={18}/>
                                    <textarea
                                        name="address"
                                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="checkout-card">
                        <h2 className="card-title">
                            <CreditCard size={22} className="icon-title"/>
                            Phương thức thanh toán
                        </h2>

                        <div className="payment-methods">
                            <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                />
                                <div className="payment-content">
                                    <span className="payment-name">Thanh toán khi nhận hàng (COD)</span>
                                    <span className="payment-desc">Thanh toán tiền mặt cho shipper khi nhận được hàng.</span>
                                </div>
                                {paymentMethod === 'cod' && <CheckCircle size={20} className="check-icon"/>}
                            </label>

                            <label className={`payment-option ${paymentMethod === 'banking' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="banking"
                                    checked={paymentMethod === 'banking'}
                                    onChange={() => setPaymentMethod('banking')}
                                />
                                <div className="payment-content">
                                    <span className="payment-name">Chuyển khoản ngân hàng</span>
                                    <span className="payment-desc">Quét mã QR hoặc chuyển khoản trực tiếp 24/7.</span>
                                </div>
                                {paymentMethod === 'banking' && <CheckCircle size={20} className="check-icon"/>}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="checkout-summary-column">
                    <div className="checkout-summary-card">
                        <h2><ShoppingBag size={20} style={{marginBottom: -3}}/> Đơn hàng</h2>

                        <div className="mini-cart-list">
                            {/* Chỗ này buộc phải dùng map để hiện đúng sản phẩm user chọn */}
                            {cartItems.map((item) => (
                                <div className="mini-item" key={item.productId}>
                                    <div className="mini-img">
                                        <img src={item.image} alt={item.name}/>
                                        <span className="mini-qty">{item.quantity}</span>
                                    </div>
                                    <div className="mini-info">
                                        <p className="mini-name">{item.name}</p>
                                        <p className="mini-variant">Tiêu chuẩn</p>
                                    </div>
                                    <span className="mini-price">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="voucher-section">
                            <div className="voucher-input-group">
                                <Tag size={18} className="voucher-icon"/>
                                <input
                                    type="text"
                                    placeholder="Mã giảm giá (VD: SALE50)"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                />
                                <button onClick={handleApplyVoucher}>Áp dụng</button>
                            </div>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Tạm tính</span>
                            <span>{formatCurrency(cartSubTotal)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Phí vận chuyển</span>
                            <span>{formatCurrency(shippingFee)}</span>
                        </div>

                        {discount > 0 && (
                            <div className="summary-row discount-row">
                                <span>Giảm giá</span>
                                <span>-{formatCurrency(discount)}</span>
                            </div>
                        )}

                        <div className="summary-divider"></div>

                        <div className="summary-row total">
                            <span>Tổng cộng</span>
                            <span className="total-price">{formatCurrency(total)}</span>
                        </div>

                        <button
                            className="place-order-btn"
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <span className="loading-text">
                                    <Loader className="spin-icon" size={18}/> Đang xử lý...
                                </span>
                            ) : (
                                "Đặt hàng ngay"
                            )}
                        </button>

                        <div className="security-note">
                            <Truck size={14}/> Giao hàng toàn quốc & Đổi trả dễ dàng
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
//     return (
//         <div className="checkout-page-container">
//             <div className="checkout-header">
//                 <a href="/cart" className="back-link">
//                     <ChevronLeft size={20}/> Quay lại giỏ hàng
//                 </a>
//                 <h1>Thanh toán</h1>
//                 <p>Hoàn tất đơn hàng của bạn</p>
//             </div>
//
//             <div className="checkout-layout">
//                 <div className="checkout-form-column">
//                     <div className="checkout-card">
//                         <h2 className="card-title">
//                             <MapPin size={22} className="icon-title"/>
//                             Thông tin nhận hàng
//                         </h2>
//
//                         <div className="form-grid">
//                             <div className="form-group full-width">
//                                 <label>Họ và tên</label>
//                                 <div className="input-wrapper">
//                                     <User size={18}/>
//                                     <input type="text" placeholder="Ví dụ: Nguyễn Văn A"/>
//                                 </div>
//                             </div>
//
//                             <div className="form-group">
//                                 <label>Số điện thoại</label>
//                                 <div className="input-wrapper">
//                                     <Phone size={18}/>
//                                     <input type="tel" placeholder="0912 xxx xxx"/>
//                                 </div>
//                             </div>
//
//                             <div className="form-group">
//                                 <label>Email</label>
//                                 <div className="input-wrapper">
//                                     <Mail size={18}/>
//                                     <input type="email" placeholder="email@example.com"/>
//                                 </div>
//                             </div>
//
//                             <div className="form-group full-width">
//                                 <label>Địa chỉ chi tiết</label>
//                                 <div className="input-wrapper top-align">
//                                     <MapPin size={18}/>
//                                     <textarea
//                                         placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."></textarea>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="checkout-card">
//                         <h2 className="card-title">
//                             <CreditCard size={22} className="icon-title"/>
//                             Phương thức thanh toán
//                         </h2>
//
//                         <div className="payment-methods">
//                             <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
//                                 <input
//                                     type="radio"
//                                     name="payment"
//                                     value="cod"
//                                     checked={paymentMethod === 'cod'}
//                                     onChange={() => setPaymentMethod('cod')}
//                                 />
//                                 <div className="payment-content">
//                                     <span className="payment-name">Thanh toán khi nhận hàng (COD)</span>
//                                     <span
//                                         className="payment-desc">Thanh toán tiền mặt cho shipper khi nhận được hàng.</span>
//                                 </div>
//                                 {paymentMethod === 'cod' && <CheckCircle size={20} className="check-icon"/>}
//                             </label>
//
//                             <label className={`payment-option ${paymentMethod === 'banking' ? 'active' : ''}`}>
//                                 <input
//                                     type="radio"
//                                     name="payment"
//                                     value="banking"
//                                     checked={paymentMethod === 'banking'}
//                                     onChange={() => setPaymentMethod('banking')}
//                                 />
//                                 <div className="payment-content">
//                                     <span className="payment-name">Chuyển khoản ngân hàng</span>
//                                     <span className="payment-desc">Quét mã QR hoặc chuyển khoản trực tiếp 24/7.</span>
//                                 </div>
//                                 {paymentMethod === 'banking' && <CheckCircle size={20} className="check-icon"/>}
//                             </label>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="checkout-summary-column">
//                     <div className="checkout-summary-card">
//                         <h2><ShoppingBag size={20} style={{marginBottom: -3}}/> Đơn hàng</h2>
//
//                         <div className="mini-cart-list">
//                             <div className="mini-item">
//                                 <div className="mini-img">
//                                     <img src="https://via.placeholder.com/60" alt="Product"/>
//                                     <span className="mini-qty">1</span>
//                                 </div>
//                                 <div className="mini-info">
//                                     <p className="mini-name">Áo Thun Premium</p>
//                                     <p className="mini-variant">Size L / Đen</p>
//                                 </div>
//                                 <span className="mini-price">250.000₫</span>
//                             </div>
//
//                             <div className="mini-item">
//                                 <div className="mini-img">
//                                     <img src="https://via.placeholder.com/60" alt="Product"/>
//                                     <span className="mini-qty">2</span>
//                                 </div>
//                                 <div className="mini-info">
//                                     <p className="mini-name">Mũ Lưỡi Trai</p>
//                                     <p className="mini-variant">Xám khói</p>
//                                 </div>
//                                 <span className="mini-price">150.000₫</span>
//                             </div>
//                         </div>
//
//                         <div className="voucher-section">
//                             <div className="voucher-input-group">
//                                 <Tag size={18} className="voucher-icon"/>
//                                 <input
//                                     type="text"
//                                     placeholder="Mã giảm giá (VD: SALE50)"
//                                     value={voucherCode}
//                                     onChange={(e) => setVoucherCode(e.target.value)}
//                                 />
//                                 <button onClick={handleApplyVoucher}>Áp dụng</button>
//                             </div>
//                         </div>
//
//                         <div className="summary-divider"></div>
//
//                         <div className="summary-row">
//                             <span>Tạm tính</span>
//                             <span>{subtotal.toLocaleString()}₫</span>
//                         </div>
//                         <div className="summary-row">
//                             <span>Phí vận chuyển</span>
//                             <span>{shippingFee.toLocaleString()}₫</span>
//                         </div>
//
//                         {discount > 0 && (
//                             <div className="summary-row discount-row">
//                                 <span>Giảm giá</span>
//                                 <span>-{discount.toLocaleString()}₫</span>
//                             </div>
//                         )}
//
//                         <div className="summary-divider"></div>
//
//                         <div className="summary-row total">
//                             <span>Tổng cộng</span>
//                             <span className="total-price">{total.toLocaleString()}₫</span>
//                         </div>
//
//                         <button
//                             className="place-order-btn"
//                             onClick={handlePlaceOrder}
//                             disabled={isProcessing}
//                         >
//                             {isProcessing ? (
//                                 <span className="loading-text">
//                                     <Loader className="spin-icon" size={18}/> Đang xử lý...
//                                 </span>
//                             ) : (
//                                 "Đặt hàng ngay"
//                             )}
//                         </button>
//
//                         <div className="security-note">
//                             <Truck size={14}/> Giao hàng toàn quốc & Đổi trả dễ dàng
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Checkout;