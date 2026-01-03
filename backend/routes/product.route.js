import express from "express";
import {getAllProducts, getProductById, getProductsByCategory} from "../services/product.service.js";

const router = express.Router();

// GET /products
router.get("/", async (req, res) => {
    try {
        const { category } = req.query;

        if (category) {
            const products = await getProductsByCategory(category);
            return res.json(products);
        }

        const products = await getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// GET /products/:id
router.get("/:id", async (req, res) => {
    try {
        const product = await getProductById(req.params.id);
        res.json(product);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
});

export default router;
