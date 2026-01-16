import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGoogleAccessToken, getGoogleUserInfo, loginWithGoogleEmail } from "../services/googleAuthService";
import { saveAuth } from "../utils/authStorage";
import { User } from "../types/user";

interface Props {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function GoogleOAuthCallback({ setUser }: Props) {
    const navigate = useNavigate();

    useEffect(() => {
        async function handleOAuth() {
            try {
                const accessToken = getGoogleAccessToken();
                if (!accessToken) throw new Error("Missing token");

                const googleUser = await getGoogleUserInfo(accessToken);
                console.log("GOOGLE USER:", googleUser);

                const authData = await loginWithGoogleEmail(googleUser);

                saveAuth(authData);
                setUser(authData.user);

                // clear hash
                window.location.hash = "";

                navigate("/");
            } catch (err) {
                console.error("Google OAuth error:", err);
                navigate("/login");
            }
        }

        handleOAuth();
    }, [navigate, setUser]);

    return <p>Đang xử lý đăng nhập Google...</p>;
}
