
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Cart, Header, Footer, Login } from "../pages";

import { Home, Products, Cart } from "../pages";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;