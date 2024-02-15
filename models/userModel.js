const mongoose = require('mongoose');

const userModel = mongoose.model('user', new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
}),'users');

module.exports = userModel;