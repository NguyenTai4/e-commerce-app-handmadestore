import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home, Products, Cart, Login, Register, Checkout, Header, Footer,ProfileUser,ProductDetail} from "../pages";
import {getAuth} from "../utils/authStorage";
import {useEffect, useState} from "react";
import {User} from "../types/user";

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
            <Header user={user} setUser={setUser}/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/product/:id" element={<ProductDetail />}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/ProfileUser" element={<ProfileUser user={user} setUser={setUser}/>}/>
                <Route path="/login" element={<Login setUser={setUser}/>}/>
                <Route path="/register" element={<Register setUser={setUser}/>}/>
                <Route path="/login" element={<Login setUser={setUser}/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;