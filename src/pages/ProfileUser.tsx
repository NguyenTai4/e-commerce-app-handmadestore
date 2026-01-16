import React, { useState, useEffect } from "react";
import { User } from "../types/user";
import { updateUser } from "../services/userService";

interface ProfileUserProps {
    user: User | null; // Nhận user từ App (giống Header)
    setUser: React.Dispatch<React.SetStateAction<User | null>>; // Để cập nhật lại App sau khi sửa xong
}

const ProfileUser: React.FC<ProfileUserProps> = ({ user, setUser }) => {
    // State cục bộ để quản lý form nhập liệu
    const [formData, setFormData] = useState<Partial<User>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Khi component mount hoặc user thay đổi (từ cha), đồng bộ dữ liệu vào form
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName,
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [user]);

    // Xử lý khi nhập liệu
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Xử lý lưu
    const handleSave = async () => {
        if (!user) return;

        try {
            setIsSaving(true);

            // Hàm updateUser bây giờ sẽ gọi API thật sự
            const updatedData = await updateUser(user.id, formData);

            setUser({ ...user, ...updatedData });

            alert("Cập nhật thành công!");
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi lưu.");
        } finally {
            setIsSaving(false);
        }
    };

    // Nếu chưa đăng nhập (user = null)
    if (!user) {
        return <div style={{ padding: 50, textAlign: 'center' }}>Vui lòng đăng nhập để xem thông tin.</div>;
    }

    return (
        <div className="profile-page">
            <div className="container">
                <h2 className="page-heading">Hồ sơ cá nhân</h2>

                <div className="profile-layout">
                    {/* KHUNG THÔNG TIN */}
                    <div className="profile-card info-section">
                        <div className="avatar-wrapper">
                            <div className="avatar-circle">
                                {/* Lấy ký tự đầu của tên để làm avatar */}
                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>
                            <h3 className="user-name">{user.fullName}</h3>
                            <p className="user-role">
                                {user.role === "admin" ? "Quản trị viên" : "Khách hàng thân thiết"}
                            </p>
                        </div>

                        <div className="info-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="text"
                                    value={user.email}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Họ và tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={isEditing ? "editable" : ""}
                                />
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone || ""}
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
                                    value={formData.address || ""}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={isEditing ? "editable" : ""}
                                />
                            </div>

                            {/* NÚT BẤM */}
                            <div className="btn-group">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="btn-save"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset lại form về dữ liệu gốc nếu hủy
                                                setFormData({
                                                    fullName: user.fullName,
                                                    phone: user.phone,
                                                    address: user.address
                                                });
                                            }}
                                            className="btn-cancel"
                                        >
                                            Hủy
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="btn-edit">
                                        Chỉnh sửa thông tin
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* KHUNG LỊCH SỬ (Placeholder) */}
                    <div className="profile-card orders-section">
                        <h3 className="section-title">Lịch sử đơn hàng</h3>
                        <p style={{ color: "#666" }}>Bạn chưa có đơn hàng nào.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUser;