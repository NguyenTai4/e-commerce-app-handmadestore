import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home, Cart, Header, Footer, Login, Products, Checkout} from "../pages";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/products" element={<Products/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;