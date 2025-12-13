import usersData from "../db_json/users.json" with { type: "json" };

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {x
        return res.status(401).json({
            message: "Missing Authorization header"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token || !token.startsWith("fake-jwt-token-")) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    const userId = Number(token.replace("fake-jwt-token-", ""));
    const user = usersData.users.find(u => u.id === userId);

    if (!user) {
        return res.status(401).json({
            message: "User not found"
        });
    }

    // gắn user vào request
    req.user = {
        id: user.id,
        email: user.email,
        role: user.role
    };

    next();
}
