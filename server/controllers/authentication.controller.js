const { 
    getProfileByUsername,
    getProfileByEmail,
    createProfile,
    refresh,
    login,
} = require("../models/profiles.model");
const { decodeToken } = require("../middlewares/auth");

async function HTTPRegister(req, res){
    const { password, username, email } = req.body;

    if(!username || username.length < 6){
        return res.status(400).json({
            error: "Username must be at least 6 characters long!",
        });
    }
    if(!email || !email.includes("@")){
        return res.status(400).json({
            error: "Email is required!",
        });
    }
    if(!password || password.length < 6){
        return res.status(400).json({
            error: "Password must be at least 6 characters long!",
        });
    }

    try{
        const [foundProfile, foundEmail] = await Promise.all([
            getProfileByUsername(username),
            getProfileByEmail(email)
        ]);

        if (foundProfile) {
            return res.status(409).json({
                error: "Username already exists!",
            });
        }
        if (foundEmail) {
            return res.status(409).json({
                error: "Email already exists!",
            });
        }

        const createdProfile = await createProfile(username, password, email);
        if(!createdProfile){
            return res.status(400).json({
                error: "profile creating failed!",
            });
        }
        if(createdProfile.error){
            return res.status(500).json({ error: createdProfile.error });
        }

        return res.status(201).json(createdProfile);
    } catch(err){
        console.log(err); 
        return res.status(500).json({
            error: "profile creation failed!",
        });
    }
}

async function HTTPLogin(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required!" });
    }
    try {
        const loginResult = await login(username, password);
        if(loginResult.error){
            return res.status(401).json({ error: loginResult.error });
        }
        if(!loginResult){
            return res.status(500).json({ error: "Failed to sign token" });
        }

        res.cookie("token", loginResult.token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 12 * 60 * 60 * 1000, // 1/2 day
        });

        res.cookie("refreshToken", loginResult.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ message: "Login successful!" });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

async function HTTPLogout(req, res) {
    try {
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Logout successful!" });
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

async function HTTPRefresh(req, res){
    const { refreshToken } = req.cookies;
    if(!refreshToken){
        return res.status(401).json({ error: "Refresh token not found!" });
    }

    try{
        const newAccessToken = await refresh(refreshToken);
        if(newAccessToken?.error || !newAccessToken){
            return res.status(newAccessToken?.error_code || 401).json({ 
                error: newAccessToken?.error || "Failed to refresh token!" 
            });
        }

        res.cookie("token", newAccessToken.token, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 12 * 60 * 60 * 1000, // 1/2 day
        });

        return res.status(200).json({ message: "Token refreshed successfully!" });
    } catch(err){
        console.log(err); 
        return res.status(500).json({
            error: "Failed to refresh token!",
        });
    }
}

async function HTTPVerifyEmail(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required!" });
    }
    try {

        return res.status(200).json({ message: "Verification email sent!" });
    } catch (error) {
        console.error("Error verifying email:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

async function HTTPCheckAuth(req, res) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            console.log("Token not found in cookies:", req.cookies);
            return res.status(401).json({ isAuthenticated: false, error: "Authentication token not found." });
        }
        const decodedToken = await decodeToken(token);
        if (decodedToken?.error || !decodedToken) {
            return res.status(+decodedToken?.error_code || 401).json({ 
                isAuthenticated: false, 
                error: decodedToken?.error || "Failed to decode token!" 
            });
        }
        
        return res.status(200).json({ isAuthenticated: true, user: decodedToken });
    } catch (error) {
        console.error("Error checking auth:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

module.exports = {
    HTTPRegister,
    HTTPLogin,
    HTTPLogout,
    HTTPRefresh,
    HTTPVerifyEmail,
    HTTPCheckAuth,
};