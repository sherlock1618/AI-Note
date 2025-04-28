const express = require('express');
const app = express();
const api = require('./api');
const path = require('path');''
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use(morgan('combined'));

app.use("/api", api);
app.use("/public", express.static(path.join(__dirname, "public/profile-images")));

module.exports = app;