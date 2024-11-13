const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 5
    },
    position: {
        type: String
    },
    experience: {
        type: String
    },
    location: {
        type: String
    },
    otp: {
        type: String,  // OTP code field
    },
    otpExpires: {
        type: Date,  // Expiration time for OTP
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.secretKey); // Generate JWT using the secret key from environment
}

const User = mongoose.model("user", userSchema);

module.exports = { User, generateToken };
