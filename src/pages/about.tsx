import React from 'react';
import '../css/About.css';

const About: React.FC = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                <h1>Về Chúng Tôi</h1>
                <p>Nơi đam mê thủ công kết tinh thành những tác phẩm nghệ thuật độc đáo</p>
            </div>

            <div className="about-container">
                {/* Story Section */}
                <div className="story-section">
                    <div className="story-image">
                        <img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Làm đồ handmade" />
                    </div>
                    <div className="story-content">
                        <h2>Câu Chuyện Của Chúng Tôi</h2>
                        <p>
                            Bắt đầu từ một cửa hàng nhỏ vào năm 2015, Handmade Store ra đời với sứ mệnh tôn vinh vẻ đẹp của sự tỉ mỉ và sáng tạo.
                            Chúng tôi tin rằng mỗi món đồ thủ công không chỉ là vật vô tri, mà là sự kết tinh của thời gian, tâm huyết và tâm hồn người nghệ nhân.
                        </p>
                        <p>
                            Tại Handmade Store, chúng tôi cam kết mang đến những sản phẩm độc đáo, thân thiện với môi trường và mang đậm dấu ấn cá nhân.
                            Mỗi sản phẩm đều được chọn lọc kỹ càng để đảm bảo chất lượng tốt nhất khi đến tay khách hàng.
                        </p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="why-choose-us">
                    <h2>Tại Sao Chọn Handmade Store?</h2>
                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon">✨</div>
                            <h3>Độc Đáo & Sáng Tạo</h3>
                            <p>Mỗi sản phẩm là một tác phẩm riêng biệt, không đụng hàng, mang đậm dấu ấn nghệ thuật.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">🌿</div>
                            <h3>Thân Thiện Môi Trường</h3>
                            <p>Sử dụng nguyên liệu tái chế và tự nhiên, góp phần bảo vệ hành tinh xanh của chúng ta.</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">💖</div>
                            <h3>Làm Bằng Cả Trái Tim</h3>
                            <p>Từng đường kim mũi chỉ đều được thực hiện tỉ mỉ với niềm đam mê cháy bỏng.</p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="team-section">
                    <h2>Đội Ngũ Của Chúng Tôi</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Team member" />
                            </div>
                            <div className="member-info">
                                <h3>Nguyễn Trung Thành</h3>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Team member" />
                            </div>
                            <div className="member-info">
                                <h3>Nguyễn Văn Tân</h3>
                            </div>
                        </div>
                        <div className="team-member">
                            <div className="member-image">
                                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Team member" />
                            </div>
                            <div className="member-info">
                                <h3>Nguyễn Hữu Tài</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
