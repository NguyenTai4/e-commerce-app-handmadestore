import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound: React.FC = () => {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-code">404</h1>
                <h2 className="not-found-title">
                    <AlertCircle size={28} style={{ marginBottom: -4, marginRight: 8 }} />
                    Oops! Không tìm thấy trang
                </h2>
                <p className="not-found-desc">
                    Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không truy cập được.
                </p>

                <Link to="/" className="btn-home">
                    <Home size={18} />
                    Quay về Trang chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFound;