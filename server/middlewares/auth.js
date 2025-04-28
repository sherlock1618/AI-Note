const jwt = require("jsonwebtoken");
require("dotenv").config();

async function authenticateToken(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            console.log("No token found in cookies.");
            return res.status(401).json({ error: "Authentication token not found." });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;
        console.log("Decoded token:", decodedToken);
        console.log(req.user.id);

        next();
    } catch (err) {
        console.error("Authentication error:", err);

        if (err.name === "TokenExpiredError") {
            return res.status(403).json({ error: "Authentication token expired." });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(400).json({ error: "Invalid authentication token." });
        }

        return res.status(500).json({ error: "An internal server error occurred." });
    }
}

async function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error("Error decoding token:", err);
        if(err.name === "TokenExpiredError") {
            return { error: "Token expired.", error_code: 403 };
        }
        if(err.name === "JsonWebTokenError") {
            return { error: "Invalid token.", error_code: 400 };
        }
        return { error: "Failed to decode token.", error_code: 500 };
    }
}

module.exports = {
    authenticateToken,
    decodeToken,
};
