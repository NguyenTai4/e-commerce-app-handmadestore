import React, {useEffect, useState, useMemo} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {
    User, Phone, Mail, MapPin, CreditCard, Truck, ChevronLeft,
    ShoppingBag, CheckCircle, Tag, Loader
} from "lucide-react";

import {orderService} from "../services/orderService";
import {CartResponse} from "../types/Cart";

import {
    getProvinces,
    getDistricts,
    getWards,
    calculateShippingFee
} from "../services/ghnAPIService";

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as CartResponse;
    const cartItems = useMemo(() => state?.items || [], [state]);
    const cartSubTotal = state?.total || 0;

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate("/cart");
        }
    }, [cartItems, navigate]);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        addressDetail: ""
    });

    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);

    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
    const [selectedWardCode, setSelectedWardCode] = useState<string>("");

    const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const [shippingFee, setShippingFee] = useState(0);
    const [isCalculatingShip, setIsCalculatingShip] = useState(false);

    const total = cartSubTotal + shippingFee - discount;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(amount);

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await getProvinces();
                if (res.code === 200) {
                    setProvinces(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách tỉnh:", error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const provinceId = Number(e.target.value);
        setSelectedProvinceId(provinceId);

        setDistricts([]);
        setWards([]);
        setSelectedDistrictId(null);
        setSelectedWardCode("");
        setShippingFee(0);

        const province = provinces.find(p => p.ProvinceID === provinceId);
        setProvinceName(province ? province.ProvinceName : "");

        if (provinceId) {
            try {
                const res = await getDistricts(provinceId);
                if (res.code === 200) {
                    setDistricts(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách huyện:", error);
            }
        }
    };

    const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtId = Number(e.target.value);
        setSelectedDistrictId(districtId);

        setWards([]);
        setSelectedWardCode("");
        setShippingFee(0);

        const district = districts.find(d => d.DistrictID === districtId);
        setDistrictName(district ? district.DistrictName : "");

        if (districtId) {
            try {
                const res = await getWards(districtId);
                if (res.code === 200) {
                    setWards(res.data);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách xã:", error);
            }
        }
    };

    const handleWardChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardCode = e.target.value;
        setSelectedWardCode(wardCode);

        const ward = wards.find(w => w.WardCode === wardCode);
        setWardName(ward ? ward.WardName : "");

        if (wardCode && selectedDistrictId) {
            await handleCalculateShipping(selectedDistrictId, wardCode);
        }
    };

    const handleCalculateShipping = async (toDistrictId: number, toWardCode: string) => {
        setIsCalculatingShip(true);
        try {
            const payload = {
                service_type_id: 2,
                insurance_value: cartSubTotal > 5000000 ? 5000000 : cartSubTotal,
                coupon: null,
                from_district_id: 1454,
                to_district_id: toDistrictId,
                to_ward_code: toWardCode,
                height: 15,
                length: 15,
                weight: 1000,
                width: 15
            };

            const res = await calculateShippingFee(payload);
            if (res.code === 200) {
                setShippingFee(res.data.total);
            } else {
                alert("Lỗi tính phí ship GHN: " + res.message);
                setShippingFee(0);
            }

        } catch (error: any) {
            console.error("Lỗi tính ship:", error);
            alert("Không thể tính phí vận chuyển lúc này.");
        } finally {
            setIsCalculatingShip(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleApplyVoucher = () => {
        if (!voucherCode) return;
        if (voucherCode.toUpperCase() === "SALE50") {
            setDiscount(50000);
            alert("Áp dụng mã SALE50: Giảm 50.000₫");
        } else {
            setDiscount(0);
            alert("Mã giảm giá không hợp lệ.");
        }
    };

    const handlePlaceOrder = async () => {
        if (!formData.fullName || !formData.phone || !formData.addressDetail || !selectedWardCode) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng (bao gồm Tỉnh, Huyện, Xã)!");
            return;
        }

        setIsProcessing(true);

        try {
            const fullAddress = `${formData.addressDetail}, ${wardName}, ${districtName}, ${provinceName}`;

            await orderService.createOrder({
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: fullAddress,
                shippingFee: shippingFee
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

                            {/* --- SELECT KHU VỰC GHN --- */}

                            {/* 1. Chọn Tỉnh */}
                            <div className="form-group">
                                <label>Tỉnh / Thành phố</label>
                                <div className="input-wrapper">
                                    <MapPin size={18}/>
                                    <select onChange={handleProvinceChange} value={selectedProvinceId || ""}>
                                        <option value="">-- Chọn Tỉnh --</option>
                                        {provinces.map((p: any) => (
                                            <option key={p.ProvinceID} value={p.ProvinceID}>
                                                {p.ProvinceName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 2. Chọn Huyện (Chỉ hiện khi đã chọn Tỉnh) */}
                            <div className="form-group">
                                <label>Quận / Huyện</label>
                                <div className="input-wrapper">
                                    <MapPin size={18}/>
                                    <select
                                        onChange={handleDistrictChange}
                                        value={selectedDistrictId || ""}
                                        disabled={!selectedProvinceId}
                                    >
                                        <option value="">-- Chọn Huyện --</option>
                                        {districts.map((d: any) => (
                                            <option key={d.DistrictID} value={d.DistrictID}>
                                                {d.DistrictName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 3. Chọn Xã (Chỉ hiện khi đã chọn Huyện) */}
                            <div className="form-group full-width">
                                <label>Phường / Xã</label>
                                <div className="input-wrapper">
                                    <MapPin size={18}/>
                                    <select
                                        onChange={handleWardChange}
                                        value={selectedWardCode || ""}
                                        disabled={!selectedDistrictId}
                                    >
                                        <option value="">-- Chọn Xã --</option>
                                        {wards.map((w: any) => (
                                            <option key={w.WardCode} value={w.WardCode}>
                                                {w.WardName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Địa chỉ chi tiết</label>
                                <div className="input-wrapper top-align">
                                    <MapPin size={18}/>
                                    <textarea
                                        name="addressDetail"
                                        placeholder="Số nhà, tên đường (Không cần nhập lại Tỉnh/Huyện/Xã)..."
                                        value={formData.addressDetail}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phương thức thanh toán - Giữ nguyên */}
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
                                </div>
                                {paymentMethod === 'cod' && <CheckCircle size={20} className="check-icon"/>}
                            </label>
                            {/* ... */}
                        </div>
                    </div>
                </div>

                {/* --- CỘT TỔNG ĐƠN HÀNG --- */}
                <div className="checkout-summary-column">
                    <div className="checkout-summary-card">
                        <h2><ShoppingBag size={20} style={{marginBottom: -3}}/> Đơn hàng</h2>

                        {/* List items ... */}
                        <div className="mini-cart-list">
                            {cartItems.map((item) => (
                                <div className="mini-item" key={item.productId}>
                                    <div className="mini-img">
                                        <img src={item.image} alt={item.name}/>
                                        <span className="mini-qty">{item.quantity}</span>
                                    </div>
                                    <div className="mini-info">
                                        <p className="mini-name">{item.name}</p>
                                        <span className="mini-price">{formatCurrency(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Voucher ... */}

                        <div className="summary-divider"></div>

                        <div className="summary-row">
                            <span>Tạm tính</span>
                            <span>{formatCurrency(cartSubTotal)}</span>
                        </div>

                        {/* HIỂN THỊ PHÍ SHIP */}
                        <div className="summary-row">
                            <span>Phí vận chuyển (GHN)</span>
                            {isCalculatingShip ? (
                                <span style={{color: '#e29578'}}>
                                    <Loader size={14} className="spin-icon"/> Đang tính...
                                </span>
                            ) : shippingFee > 0 ? (
                                <span>{formatCurrency(shippingFee)}</span>
                            ) : (
                                <span style={{color: '#999', fontStyle: 'italic'}}>
                                    {selectedWardCode ? "Miễn phí / Lỗi" : "Chưa chọn địa chỉ"}
                                </span>
                            )}
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
                            disabled={isProcessing || isCalculatingShip}
                        >
                            {isProcessing ? "Đang xử lý..." : "Đặt hàng ngay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;