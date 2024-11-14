const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String
    },
    password: {
        type: String,
        required: true
        
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
},{timestamps:true});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET); // Generate JWT using the secret key from environment
}

const User = mongoose.model("User", userSchema);

module.exports = { User, generateToken };
