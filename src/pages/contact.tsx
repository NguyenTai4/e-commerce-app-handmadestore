import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log('Form submitted:', formData);
        alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            <div className="contact-header">
                <h1>Liên Hệ Với Chúng Tôi</h1>
                <p>Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn mọi lúc.</p>
            </div>

            <div className="contact-container">
                {/* Contact Info Section */}
                <div className="contact-info">
                    <div>
                        <h3>Thông Tin Liên Hệ</h3>

                        <div className="info-item">
                            <div className="info-icon"></div>
                            <div className="info-content">
                                <h4>Địa Chỉ</h4>
                                <p>123 Đường Handmade, Quận 1, TP. Hồ Chí Minh</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"></div>
                            <div className="info-content">
                                <h4>Điện Thoại</h4>
                                <p>+84 123 456 789</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"></div>
                            <div className="info-content">
                                <h4>Email</h4>
                                <p>support@handmadestore.com</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <div className="info-icon"></div>
                            <div className="info-content">
                                <h4>Giờ Làm Việc</h4>
                                <p>Thứ 2 - Chủ Nhật: 8:00 - 22:00</p>
                            </div>
                        </div>
                    </div>

                    <div className="social-links">
                        <h4>Theo Dõi Chúng Tôi</h4>
                        <div className="social-icons">
                            <a href="#" className="social-icon">f</a>
                            <a href="#" className="social-icon">in</a>
                            <a href="#" className="social-icon">ig</a>
                        </div>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="contact-form-wrapper">
                    <h3>Gửi Tin Nhắn</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Họ và Tên</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nhập họ tên của bạn"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập địa chỉ email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Tiêu Đề</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Bạn cần hỗ trợ vấn đề gì?"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Nội Dung</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Nhập nội dung tin nhắn..."
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Gửi Tin Nhắn</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
