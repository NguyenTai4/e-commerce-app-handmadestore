import productsData from "../../db_json/products.json" with { type: "json" };
import { delay } from "../utils/delay.js";

export async function getAllProducts() {
    await delay();
    return productsData.products;
}

export async function getProductById(id) {
    await delay();

    const product = productsData.products.find(
        p => p.id === Number(id)
    );

    if (!product) {
        throw {
            status: 404,
            message: "Product not found"
        };
    }

    return product;
}

export async function getProductsByCategory(category) {
    await delay();

    return productsData.products.filter(
        p => p.category === category
    );
}
