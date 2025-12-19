import React from "react";

const Checkout = () => {
    return (
        <div className="checkout-page-container">
            <h1>Thanh toán</h1>

            <div className="checkout-layout">
                <div className="checkout-form">
                    <h2>Thông tin giao hàng</h2>

                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" placeholder="Nguyễn Văn A"/>
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="tel" placeholder="0123 456 789"/>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="email@example.com"/>
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ giao hàng</label>
                        <textarea placeholder="Số nhà, đường, quận/huyện, tỉnh/thành"></textarea>
                    </div>

                    <button className="place-order-btn">
                        Đặt hàng
                    </button>
                </div>

                <div className="checkout-summary">
                    <h2>Đơn hàng</h2>

                    <div className="summary-row">
                        <span>Tạm tính</span>
                        <span>—</span>
                    </div>

                    <div className="summary-row">
                        <span>Phí vận chuyển</span>
                        <span>30.000₫</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                        <span>Tổng cộng</span>
                        <span>—</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
