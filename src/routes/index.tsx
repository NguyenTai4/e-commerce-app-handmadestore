import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Cart, Header, Footer } from "../pages";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}
