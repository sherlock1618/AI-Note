const express = require('express');
const router = express.Router();
const {
    HTTPRegister,
    HTTPLogin,
    HTTPLogout,
    HTTPRefresh,
    HTTPVerifyEmail,
    HTTPCheckAuth,
} = require("../controllers/authentication.controller");

router.post("/register", HTTPRegister);
router.post("/verify-email", HTTPVerifyEmail);
router.get("/check", HTTPCheckAuth);
router.post("/login", HTTPLogin);
router.post("/logout", HTTPLogout);
router.get("/refresh", HTTPRefresh);

module.exports = router;
