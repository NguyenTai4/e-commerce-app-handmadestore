import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home, Products, Cart, Login, Register, Checkout, ProfileUser, ProductDetail, AppLayout} from "../pages";
import {getAuth} from "../utils/authStorage";
import {useEffect, useState} from "react";
import {User} from "../types/user";
import GoogleOAuthCallback from "../pages/GoogleOAuthCallback";

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
            <Routes>
                <Route path="/oauth/google" element={<GoogleOAuthCallback setUser={setUser}/>}/>

                <Route element={<AppLayout user={user} setUser={setUser}/>}>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/product/:id" element={<ProductDetail/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/profileUser" element={<ProfileUser user={user} setUser={setUser}/>}/>
                    <Route path="/login" element={<Login setUser={setUser}/>}/>
                    <Route path="/register" element={<Register setUser={setUser}/>}/>
                    <Route path="/checkout" element={<Checkout/>}/>
                </Route>

            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;