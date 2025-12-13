const Cart = () => {
    return (
        <div className="cart-page">
            <h1>Giỏ hàng</h1>

            <div className="cart-content">
                {/* Danh sách sản phẩm */}
                <div className="cart-items">
                    <div className="cart-item">
                        <img
                            src={"img/hand_made_1.jpg"}
                            alt="Sản phẩm"
                        />

                        <div className="item-info">
                            <h3>Sản phẩm handmade</h3>
                            <p>Giá: 150.000 ₫</p>
                        </div>

                        <div className="item-quantity">
                            <button>-</button>
                            <span>1</span>
                            <button>+</button>
                        </div>

                        <div className="item-total">
                            150.000 ₫
                        </div>
                    </div>
                </div>

                {/* Tổng tiền */}
                <div className="cart-summary">
                    <h2>Tổng cộng</h2>
                    <p>150.000 ₫</p>
                    <button className="checkout-btn">
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;

