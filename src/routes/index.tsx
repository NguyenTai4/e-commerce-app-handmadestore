
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Home, Products, Cart } from "../pages";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;