import {fileURLToPath} from "url";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORDERS_FILE = path.join(__dirname, "../../db_json/orders.json");
const CARTS_FILE = path.join(__dirname, "../../db_json/carts.json");
const PRODUCTS_FILE = path.join(__dirname, "../../db_json/products.json");

async function readJson(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        console.error(`❌ Lỗi đọc file ${filePath}:`, e.message);
        return null;
    }
}

async function writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export const orderService = {
    async createOrder(userId, locateShipDetail) {
        const ordersData = await readJson(ORDERS_FILE);
        const cartsData = await readJson(CARTS_FILE);
        const product = await readJson(PRODUCTS_FILE);

        if (!cartsData) {
            throw new Error("Lỗi Server: Không đọc được dữ liệu giỏ hàng (File carts.json lỗi hoặc không tồn tại)");
        }
        if (!ordersData) {
            throw new Error("Lỗi Server: Không đọc được dữ liệu đơn hàng");
        }

        const cartList = cartsData.carts || cartsData;
        const orderList = ordersData.orders || ordersData;
        const products = product.products || product;

        console.log("👉 ID cần tìm:", userId);
        console.log("👉 Tổng số giỏ hàng load được:", cartList.length);

        const cartIndex = cartList.findIndex(c => c.userId == userId);
        const userCart = cartList[cartIndex];

        if (userCart) {
            console.log("✅ Đã tìm thấy giỏ hàng của User", userId);
        } else {
            console.log("❌ Vẫn không thấy giỏ hàng. Danh sách UserID đang có:", cartList.map(c => c.userId));
        }

        if (!userCart || userCart.items.length === 0) {
            throw new Error("Giỏ hàng trống");
        }

        let calculatedTotal = 0;

        const orderItems = userCart.items.map(cartItem => {
            const productInfo = products.find(p => p.id === cartItem.productId);
            if (!productInfo) return null;

            const lineTotal = productInfo.price * cartItem.quantity;
            calculatedTotal += lineTotal;

            return {
                productId: cartItem.productId,
                name: productInfo.name,
                price: productInfo.price,
                image: productInfo.image,
                quantity: cartItem.quantity
            };
        }).filter(Boolean);

        const newOrder = {
            id: Date.now(),
            userId: userId,
            items: orderItems,
            totalAmount: calculatedTotal,
            shippingInfo: locateShipDetail,
            status: "pending",
            createdAt: new Date().toISOString()
        };

        orderList.push(newOrder);
        await writeJson(ORDERS_FILE, {orders: orderList});

        cartList[cartIndex].items = [];
        cartList[cartIndex].updatedAt = new Date().toISOString();
        await writeJson(CARTS_FILE, {carts: cartList});

        return newOrder;
    }
}