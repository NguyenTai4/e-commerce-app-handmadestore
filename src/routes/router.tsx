import {BrowserRouter, Routes, Route} from "react-router-dom";
import {Home, Cart, Header, Footer, Checkout} from "../pages";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/cart" element={<Cart/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}
