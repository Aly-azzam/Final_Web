const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MongoDB user model
const User = require('./../models/User');

// Functions for validation
function validateEmail(email) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}

function validateUsername(username) {
    const nameRegex = /^.{3,}$/; //minimum 3 chars
    return nameRegex.test(username);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
    return passwordRegex.test(password);
}

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(03|70|71|76|80|81)\d{6}$/;
    return phoneRegex.test(phoneNumber);
}

// Generate JWT token
function generateAccessToken(user) {
    return jwt.sign(
        { userId: user._id, roles: user.roles },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '24h' }
    );
}

// Signup
router.post('/signup', async (req, res) => {
    try {
        let { firstName, lastName, username, phoneNumber, email, password, dateOfBirth, location, roleChoice } = req.body;

        // Validate input fields
        if (Object.values({ firstName, lastName, username, phoneNumber, email, password }).some(value => !value)) {
            return res.json({
                status: "FAILED",
                message: "Empty input fields!",
            });
        }

        if (!validateUsername(username)) {
            return res.json({
                status: "FAILED",
                message: "Username must be at least 3 characters.",
            });
        }

        if (!validateEmail(email)) {
            return res.json({
                status: "FAILED",
                message: "Invalid email entered",
            });
        }

        if (!validatePhoneNumber(phoneNumber)) {
            return res.json({
                status: "FAILED",
                message: "Invalid phone number.",
            });
        }

        if (!validatePassword(password)) {
            return res.json({
                status: "FAILED",
                message: "Password must be at least 8 characters with one uppercase letter, one lowercase letter, one digit, and one special character.",
            });
        }

        // Assigning roles
        const roles = (roleChoice === 'buyAndSell') ? ['buyer', 'seller'] : (roleChoice === 'admin') ? ['buyer', 'seller', 'admin'] : ['buyer'];

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }, { phoneNumber }] });
        if (existingUser) {
            return res.json({
                status: "FAILED",
                message: `User with this ${existingUser.email === email ? 'email' : existingUser.username === username ? 'username' : 'phone number'} already exists`,
            });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            username,
            phoneNumber,
            email,
            password: hashedPassword,
            dateOfBirth,
            location,
            roles,
        });

        const savedUser = await newUser.save();
        const token = generateAccessToken(savedUser);

        return res.json({
            status: "SUCCESS",
            message: "Signup successful!",
            accessToken: token,
            data: [{
                _id: savedUser._id,
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                roles: savedUser.roles
            }]
        });
    } catch (error) {
        return res.json({
            status: "FAILED",
            message: "An error occurred during signup",
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                status: "FAILED",
                message: "Please provide both email and password",
            });
        }

        // Find user by email or username
        const user = await User.findOne({ $or: [{ email }, { username: email }] });

        if (!user) {
            return res.json({
                status: "FAILED",
                message: "Invalid email or password",
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.json({
                status: "FAILED",
                message: "Invalid email or password",
            });
        }

        // Generate token
        const token = generateAccessToken(user);

        return res.json({
            status: "SUCCESS",
            message: "Login successful",
            accessToken: token,
            data: [{
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles
            }]
        });
    } catch (error) {
        return res.json({
            status: "FAILED",
            message: "An error occurred during login",
        });
    }
});

// Google OAuth route
router.post('/google', async (req, res) => {
    try {
        const { userInfo } = req.body;

        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                email: userInfo.email,
                googleId: userInfo.sub,
                profilePicture: userInfo.picture,
                roles: ['buyer']
            });
            await user.save();
        }

        const token = generateAccessToken(user);

        return res.json({
            status: "SUCCESS",
            message: "Google login successful",
            accessToken: token,
            data: [{
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles
            }]
        });
    } catch (error) {
        return res.json({
            status: "FAILED",
            message: "An error occurred during Google login",
        });
    }
});

// Token validation endpoint
router.post('/check-token', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ valid: false });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.json({ valid: false });
        }

        return res.json({
            valid: true,
            data: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles
            }
        });
    } catch (error) {
        return res.json({ valid: false });
    }
});

module.exports = router;