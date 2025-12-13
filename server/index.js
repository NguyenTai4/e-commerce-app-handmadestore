import express from "express";
import authRoute from "../routes/auth.route.js";

const app = express();

app.use(express.json());

// gắn auth api
app.use("/auth", authRoute);

app.listen(3001, () => {
    console.log("🚀 Fake API running at http://localhost:3001");
});
