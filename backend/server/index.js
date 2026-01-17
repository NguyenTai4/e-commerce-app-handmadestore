import express from "express";
import cors from "cors";
import authRoute from "../routes/auth.route.js";
import cartRoute from "../routes/cart.route.js";
import productRoute from "../routes/product.route.js";
import reviewRoutes from "../routes/review.routes.js";
import userRoute from "../routes/user.route.js";

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());

app.use("/auth", authRoute);
app.use("/carts", cartRoute);
app.use("/products", productRoute);
app.use("/reviews", reviewRoutes);
app.use("/users", userRoute);

app.listen(3001, () => {
    console.log("🚀 Fake API running at http://localhost:3001");
});
