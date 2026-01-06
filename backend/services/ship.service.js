// 1. ĐỊNH NGHĨA DANH SÁCH TỈNH THÀNH THEO VÙNG (Dữ liệu mẫu)
const REGIONS = {
    // Vùng 1: Nội thành
    HO_CHI_MINH: ["hồ chí minh", "hcm", "sài gòn"],

    // Vùng 2: Miền Nam & Miền Tây (Lân cận)
    SOUTH_WEST: [
        "bình dương", "đồng nai", "bà rịa - vũng tàu", "tây ninh", "bình phước", // Đông Nam Bộ
        "long an", "tiền giang", "bến tre", "trà vinh", "vĩnh long", "đồng tháp",
        "an giang", "kiên giang", "cần thơ", "hậu giang", "sóc trăng", "bạc liêu", "cà mau" // Miền Tây
    ],

    // Vùng 3: Miền Trung & Tây Nguyên
    CENTRAL: [
        "thanh hóa", "nghệ an", "hà tĩnh", "quảng bình", "quảng trị", "thừa thiên huế",
        "đà nẵng", "quảng nam", "quảng ngãi", "bình định", "phú yên", "khánh hòa", "ninh thuận", "bình thuận",
        "kon tum", "gia lai", "đắk lắk", "đắk nông", "lâm đồng"
    ]
    // Còn lại là Miền Bắc (Mặc định)
};

export const shippingService = {
    calculateFee(province) {
        if (!province) return {fee: 0, method: "Chưa xác định"};

        const location = province.trim().toLowerCase();

        if (REGIONS.HO_CHI_MINH.some(p => location.includes(p))) {
            return {
                fee: 15000,
                method: "Hỏa tốc nội thành (TP.HCM)",
                estimatedDays: "1-2 ngày"
            };
        }

        if (REGIONS.SOUTH_WEST.some(p => location.includes(p))) {
            return {
                fee: 25000,
                method: "Nhanh - Miền Nam/Tây",
                estimatedDays: "2-3 ngày"
            };
        }

        if (REGIONS.CENTRAL.some(p => location.includes(p))) {
            return {
                fee: 35000,
                method: "Tiêu chuẩn - Miền Trung",
                estimatedDays: "3-4 ngày"
            };
        }

        return {
            fee: 50000,
            method: "Chuyển phát đường bay - Miền Bắc",
            estimatedDays: "4-5 ngày"
        };
    }
};