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
        type: String,
    },
    otpExpires: {
        type: Date,
    }
}, {timestamps: true});

// Check if the model is already defined
const User = mongoose.models.User || mongoose.model('User', userSchema);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET); // JWT generation
}

module.exports = { User, generateToken };
