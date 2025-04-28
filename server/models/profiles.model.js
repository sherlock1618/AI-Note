require("dotenv").config();
const jwt = require("jsonwebtoken");
const Profile = require("./schemas/profiles.mongo");
const bycrypt = require("bcrypt");

async function getProfileByUsername(username) {
    try {
        const profile = await Profile.findOne({ username });
        return profile;
    }
    catch (error) {
        console.error("Error fetching profile by username:", error);
        return null;
    }
}

async function getProfileByEmail(email) {
    try {
        const profile = await Profile.findOne({ email });
        return profile;
    }
    catch (error) {
        console.error("Error fetching profile by email:", error);
        return null;
    }
}

async function getProfileById(id) {
    try {
        const profile = await Profile.findById(id);
        return profile;
    } catch (error) {
        console.error("Error fetching profile by ID:", error);
        return null;
    }
}

async function createProfile(username, password, email) {
    try {
        const profile = {
            username,
            email,
        };

        const hashedPassword = await bycrypt.hash(password, 10);
        profile.password = hashedPassword;

        const newProfile = new Profile(profile);
        await newProfile.save();
        return newProfile;
    } catch (error) {
        console.error("Error creating profile:", error);
        return { error: "Profile creation failed!" };
    }
}

async function login(username, password){
    try{
        const profile = await Profile.findOne({ username });
        if(!profile){
            return { error: "Profile not found!" };
        }
        const isPasswordValid = await bycrypt.compare(password, profile.password);
        if(!isPasswordValid){
            return { error: "Invalid password!" };
        }

        const token = {
            id: profile._id,
            username: profile.username,
        }

        const jwtToken = jwt.sign(
            token, process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRATION || "12h" }
        );
        const refreshToken = jwt.sign(
            token, process.env.JWT_REFRESH_SECRET, 
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION || "7d" }
        );

        return { token: jwtToken, refreshToken };
    } catch(error){
        console.error("Error logging in:", error);
        return { error: "Login failed!" };
    }
};

async function refresh(refreshToken){
    try{
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newToken = jwt.sign(
            { id: decoded.id, username: decoded.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRATION || "12h" }
        );
        return { token: newToken };
    } catch(error){
        console.error("Error refreshing token:", error);
        const errorCode = error.name === "TokenExpiredError" ? 401 : 403;
        return { error: "Token refresh failed!", error_code: errorCode };
    }
}

module.exports = {
    getProfileByUsername,
    getProfileByEmail,
    getProfileById,
    createProfile,
    refresh,
    login,
};