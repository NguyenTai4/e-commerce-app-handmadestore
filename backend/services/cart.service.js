import fs from "fs/promises";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARTS_FILE = path.join(__dirname, "../../db_json/carts.json");
const PRODUCTS_FILE = path.join(__dirname, "../../db_json/products.json");

async function readJson(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

async function writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export const cartService = {
    async getCartByUserId(userId) {
        // Đọc file
        const cartsData = await readJson(CARTS_FILE);
        const productsData = await readJson(PRODUCTS_FILE);
        const carts = cartsData?.carts || [];
        const products = productsData?.products || [];

        // Tìm cart
        const cart = carts.find(c => String(c.userId) === String(userId));
        if (!cart) return {items: []};

        // Merge dữ liệu
        const enrichedItems = cart.items.map(item => {
            const product = products.find(p => String(p.id) === String(item.productId));
            if (!product) {
                console.warn(`⚠️ Cảnh báo: Không tìm thấy sản phẩm ID ${item.productId} trong products.json`);
                return {
                    ...item,
                    name: `Sản phẩm lỗi (ID: ${item.productId})`,
                    price: 0,
                    image: ""
                };
            }
            return {
                ...item,
                name: product.name,
                price: product.price,
                image: product.image
            };
        });

        return {...cart, items: enrichedItems};
    },
    async addToCart(userId, productId, quantity) {
        const data = await readJson(CARTS_FILE);
        let carts = data?.carts || [];

        let userCartIndex = carts.findIndex(c => String(c.userId) === String(userId));

        if (userCartIndex === -1) {
            const newCart = {
                id: Date.now(),
                userId,
                items: [{productId, quantity}],
                updatedAt: new Date()
            };
            carts.push(newCart);
        } else {
            let cartItems = carts[userCartIndex].items;
            const itemIndex = cartItems.findIndex(i => String(i.productId) === String(productId));

            if (itemIndex > -1) {
                cartItems[itemIndex].quantity += quantity;
            } else {
                cartItems.push({productId, quantity});
            }

            carts[userCartIndex].updatedAt = new Date();
        }
        await writeJson(CARTS_FILE, {carts});

        return this.getCartByUserId(userId);
    },
    async updateCart(userId, newItems) {
        const data = await readJson(CARTS_FILE);
        let carts = data?.carts || [];

        const itemsToSave = newItems.map(i => ({
            productId: i.productId,
            quantity: i.quantity
        }));

        const index = carts.findIndex(c => String(c.userId) === String(userId));
        if (index === -1) {
            // Tạo mới
            carts.push({id: Date.now(), userId, items: itemsToSave, updatedAt: new Date()});
        } else {
            // Cập nhật
            carts[index].items = itemsToSave;
            carts[index].updatedAt = new Date();
        }

        await writeJson(CARTS_FILE, {carts});
        return this.getCartByUserId(userId);
    }

};