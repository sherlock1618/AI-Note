const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', profileSchema);
