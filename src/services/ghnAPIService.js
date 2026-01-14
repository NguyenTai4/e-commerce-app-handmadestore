import axios from "axios";

/**
 * ===============================
 * GHN CONFIG (HARDCODE - DEMO)
 * ===============================
 */
const GHN_BASE_URL =
    "https://online-gateway.ghn.vn/shiip/public-api";

const GHN_TOKEN = "4f039e5e-ef94-11f0-af82-f2e024fc9595";
const GHN_SHOP_ID = 6211695;

/**
 * Axios client cho GHN
 */
const ghnClient = axios.create({
    baseURL: GHN_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Token": GHN_TOKEN,
        "ShopId": GHN_SHOP_ID,
    },
});

/**
 * Call API tính phí vận chuyển GHN
 */
export const calculateShippingFee = async (payload) => {
    const response = await ghnClient.post(
        "/v2/shipping-order/fee",
        payload
    );
    return response.data;
};

export const getProvinces = async () => {
    const response = await ghnClient.get(
        "/master-data/province"
    );
    return response.data;
};

export const getDistricts = async (provinceId) => {
    const response = await ghnClient.get(
        "/master-data/district",
        {
            params: {
                province_id: provinceId,
            },
        }
    );
    return response.data;
};


export const getWards = async (districtId) => {
    const response = await ghnClient.post(
        "/master-data/ward",
        {
            district_id: districtId, // body
        }
    );
    return response.data;
};

// ===============================
// TEST calculateShippingFee ONLY
// ===============================
if (process.argv[1]?.includes("ghnAPIService.js")) {
    (async () => {
        try {
            console.log("=== TEST calculateShippingFee ===");

            const payload = {
                to_district_id: 1448,
                to_ward_code: "20614",
                service_type_id: 2,
                weight: 500,
                length: 20,
                width: 15,
                height: 10,
            };

            const result = await calculateShippingFee(payload);

            console.log("Shipping fee result:");
            console.log(JSON.stringify(result, null, 2));

            console.log("=== TEST SUCCESS ===");
        } catch (error) {
            console.error(
                "TEST ERROR:",
                error.response?.data || error.message
            );
        }
    })();
}
