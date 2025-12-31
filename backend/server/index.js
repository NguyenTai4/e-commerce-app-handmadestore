import express from "express";
import cors from "cors";
import authRoute from "../routes/auth.route.js";
import cartRoute from "../routes/cart.route.js";

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());

app.use("/auth", authRoute);
app.use("/carts", cartRoute);

app.listen(3001, () => {
    console.log("🚀 Fake API running at http://localhost:3001");
});
