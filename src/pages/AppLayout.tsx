import { Outlet } from "react-router-dom";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import { User } from "../types/user";

interface Props {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function AppLayout({ user, setUser }: Props) {
    return (
        <>
            <Header user={user} setUser={setUser} />
            <Outlet />
            <Footer />
        </>
    );
}
