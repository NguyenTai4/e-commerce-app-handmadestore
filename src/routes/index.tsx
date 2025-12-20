import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Cart, Header, Footer, Login } from "../pages";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}
