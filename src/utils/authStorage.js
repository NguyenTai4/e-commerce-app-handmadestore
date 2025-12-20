export function saveAuth(data) {
    localStorage.setItem("auth", JSON.stringify(data));
}

export function getAuth() {
    const auth = localStorage.getItem("auth");
    return auth ? JSON.parse(auth) : null;
}

export function clearAuth() {
    localStorage.removeItem("auth");
}
