import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Products, Cart, Login, Register, Header, Footer} from "../pages";
import { getAuth } from "../utils/authStorage";
import { useEffect, useState } from "react";
import { User } from "../types/user";
import ProductDetail from "../pages/ProductDetail";

const AppRouter = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        if (auth?.accessToken) {
            setUser(auth.user);
        }
    }, []);

    return (
        <BrowserRouter>
            <Header user={user} setUser={setUser} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/register" element={<Register setUser={setUser} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;