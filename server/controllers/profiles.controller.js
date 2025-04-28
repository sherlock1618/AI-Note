const {
    getProfileById,
    getProfileByUsername,
} = require("../models/profiles.model");
const fs = require("fs");
const path = require("path");

async function HTTPGetProfileByUsername(req, res) {
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ error: "Username is required!" });
    }
    try {
        const profile = await getProfileByUsername(username);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found!" });
        }
        return res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

async function HTTPGetProfileById(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "ID is required!" });
    }
    try {
        const profile = await getProfileById(id);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found!" });
        }
        return res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}

async function HTTPUploadProfileImage(req, res) {
    const { id } = req.params;
    const { file } = req;
    if (!file || !id || !file.filename) {
        return res.status(400).json({ 
            error: !file ? "Image file is required!" : 
                   !id ? "ID is required!" : 
                   "Filename is invalid!" 
        });
    }
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
        return res.status(400).json({ error: 'Only JPEG or png files are allowed' });
    }
    try {
        const profile = await getProfileById(id);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found!" });
        }
        
        const targetPath = path.join(__dirname, "..", "public", "profile-images", file.filename);
        fs.renameSync(file.path, targetPath);

        const profileImageUrl = `/profile-images/${file.filename}`;
        profile.profileImage = profileImageUrl;
        await profile.save();

        return res.status(200).json({ message: "Image uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        return res.status(500).json({ error: "Internal server error!" });
    }
}


module.exports = {
    HTTPGetProfileByUsername,
    HTTPGetProfileById,
    HTTPUploadProfileImage,
};