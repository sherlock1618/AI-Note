const express = require('express');
const api = express();

api.use("/auth", require("./routers/authentication.router"));
const { authenticateToken } = require("./middlewares/auth");

api.use(authenticateToken);
api.use("/profile", require("./routers/profiles.router"));
api.use("/notes", require("./routers/notes.router"));

module.exports = api;
