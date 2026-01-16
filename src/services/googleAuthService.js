import axios from "axios";

const API_URL = "http://localhost:3001/auth";
const CLIENT_ID =
    "990837395420-q9d7b9ots3c5edvesabe1dmi5teq5vh1.apps.googleusercontent.com";

const REDIRECT_URI = "http://localhost:3000/oauth/google";

const LINK_GET_TOKEN =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    "scope=https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&" +
    "response_type=token&" +
    `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
    `client_id=${CLIENT_ID}`;

/**
 * 1️⃣ Redirect user sang Google Login
 */
export function loginWithGoogle() {
    window.location.href = LINK_GET_TOKEN;
}

/**
 * 2️⃣ Lấy access_token từ URL sau redirect
 * VD: /#access_token=xxx&token_type=Bearer
 */
export function getGoogleAccessToken() {
    const hash = window.location.hash;
    if (!hash) return null;

    const params = new URLSearchParams(hash.substring(1));
    return params.get("access_token");
}

/**
 * 3️⃣ Gọi Google API lấy thông tin user
 */
export async function getGoogleUserInfo(accessToken) {
    if (!accessToken) {
        throw new Error("Missing Google access token");
    }

    const response = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    return {
        email: response.data.email,
        name: response.data.name,
    };
}

export async function loginWithGoogleEmail(googleUser) {
    const res = await axios.post(`${API_URL}/google-login`, {
        email: googleUser.email,
        fullName: googleUser.name
    });
    return res.data;
}

