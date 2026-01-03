import React, { useState, useEffect } from "react";

const ProfileUser = () => {
    // Giả sử user đang đăng nhập có ID = 21 (Võ Đại Thành Tài)
    // Trong thực tế, bạn sẽ lấy ID này từ localStorage sau khi login
    const currentUserId = 21;

    const [userInfo, setUserInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- GỌI API LẤY DỮ LIỆU ---
    useEffect(() => {
        // Gọi API ở cổng 5000
        fetch(`http://localhost:5000/users/${currentUserId}`)
            .then((res) => res.json())
            .then((data) => {
                setUserInfo(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi gọi API:", err);
                setIsLoading(false);
            });
    }, [currentUserId]);

    // --- XỬ LÝ SỬA DỮ LIỆU (PUT API) ---
    const handleSave = () => {
        // Gửi dữ liệu mới lên Server để lưu lại vào file db.json
        fetch(`http://localhost:5000/users/${currentUserId}`, {
            method: "PATCH", // PATCH: chỉ sửa những trường thay đổi
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: userInfo.fullName,
                phone: userInfo.phone,
                address: userInfo.address
            })
        })
            .then(res => res.json())
            .then(() => {
                alert("Đã cập nhật thành công!");
                setIsEditing(false);
            })
            .catch(err => alert("Lỗi cập nhật: " + err));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    if (isLoading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="profile-page">
            <div className="container">
                <h2 className="page-heading">Quản lý tài khoản</h2>

                <div className="profile-layout">
                    {/* CỘT TRÁI: THÔNG TIN USER TỪ API */}
                    <div className="profile-card info-section">
                        <div className="avatar-wrapper">
                            <div className="avatar-circle">
                                {userInfo.fullName ? userInfo.fullName.charAt(0) : "U"}
                            </div>
                            <h3 className="user-name">{userInfo.fullName}</h3>
                            <p className="user-role">
                                {userInfo.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                            </p>
                        </div>

                        <div className="info-form">
                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={userInfo.fullName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={isEditing ? "editable" : ""}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={userInfo.email}
                                    disabled={true}
                                    className="disabled-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={userInfo.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={isEditing ? "editable" : ""}
                                />
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={userInfo.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={isEditing ? "editable" : ""}
                                />
                            </div>

                            <div className="btn-group">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="btn-save">Lưu lại</button>
                                        <button onClick={() => setIsEditing(false)} className="btn-cancel">Hủy</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="btn-edit">Chỉnh sửa</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: LỊCH SỬ ĐƠN HÀNG (Vẫn Mock vì chưa có JSON đơn hàng) */}
                    <div className="profile-card orders-section">
                        <h3 className="section-title">Lịch sử mua hàng</h3>
                        <p>Tính năng đang phát triển...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;