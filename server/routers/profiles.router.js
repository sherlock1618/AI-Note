const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } });
const {
    HTTPGetProfileByUsername,
    HTTPGetProfileById,
    HTTPUploadProfileImage,
} = require("../controllers/profiles.controller");

router.get("/username/:username", HTTPGetProfileByUsername);
router.get("/id/:id", HTTPGetProfileById);
router.put("/image-upload/:id", upload.single("image"), HTTPUploadProfileImage);

module.exports = router;