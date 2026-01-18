import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./routes/index";
import "./css/index.css";
import "./css/Header.css";
import "./css/Footer.css";
import "./css/Login.css";
import "./css/Cart.css";
import "./css/Product.css";
import "./css/Checkout.css";
import "./css/Register.css";
import "./css//ProfileUser.css";
import "./css/ProductDetail.css";
import "./css/NotFound.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <AppRouter/>
    </React.StrictMode>
);
    