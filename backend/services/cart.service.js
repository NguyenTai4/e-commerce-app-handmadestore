import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CARTS_FILE = path.join(__dirname, "../../db_json/carts.json");
const PRODUCTS_FILE = path.join(__dirname, "../../db_json/products.json");

async function readJson(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (e) { return null; }
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
        const cart = carts.find(c => c.userId === userId);
        if (!cart) return { items: [] };

        // Merge dữ liệu
        const enrichedItems = cart.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return null;
            return {
                ...item,
                name: product.name,
                price: product.price,
                image: product.image
            };
        }).filter(Boolean);

        return { ...cart, items: enrichedItems };
    },

    async updateCart(userId, newItems) {
        const data = await readJson(CARTS_FILE);
        let carts = data?.carts || [];

        const itemsToSave = newItems.map(i => ({
            productId: i.productId,
            quantity: i.quantity
        }));

        const index = carts.findIndex(c => c.userId === userId);
        if (index === -1) {
            // Tạo mới
            carts.push({ id: Date.now(), userId, items: itemsToSave, updatedAt: new Date() });
        } else {
            // Cập nhật
            carts[index].items = itemsToSave;
            carts[index].updatedAt = new Date();
        }

        await writeJson(CARTS_FILE, { carts });
        return this.getCartByUserId(userId);
    }
};