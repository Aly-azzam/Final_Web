const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// MongoDB user model
const User = require('./../models/User');
const Order = require('./../models/Order');

// Middleware for token authentication (json web token verification function)
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // No token given => no access

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Not a valid token
        req.user = user;
        next();
    });
}

// API endpoint to check if a token is valid
router.post('/check-token', authenticateToken, (req, res) => {
    // If the middleware (authenticateToken) is reached, it means the token is valid
    return res.status(200).json({
        valid: true,
        message: 'Token is valid',
        data: {
            userId: req.user.userId,
            roles: req.user.roles,
        },
    });
});

// Functions for validation
function validateEmail(email) {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
}

function validateUsername(username) {
    const nameRegex = /^.{3,}$/; //minimum 3 chars, lower or upper characters only
    return nameRegex.test(username);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&.]{8,}$/;
    return passwordRegex.test(password);
}

function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^(03|70|71|76|80|81)\d{6}$/;
    return phoneRegex.test(phoneNumber);
}

// Update User Information
router.put('/update/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;

        // Check same user
        if (req.user.userId !== userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "Forbidden: You don't have permission to update this user",
            });
        }

        // Check if the user exists
        const existingUser = await User.findById(userId);

        if (!existingUser) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found",
            });
        }

        if (updatedData.email && !validateEmail(updatedData.email)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email entered",
            });
        }

        if (updatedData.email) {
            const emailExists = await User.findOne({ email: updatedData.email, _id: { $ne: userId } });
            if (emailExists) {
                return res.status(400).json({
                    status: "FAILED",
                    message: "Email already exists for another user",
                });
            }

            if (!validateEmail(updatedData.email)) {
                return res.status(400).json({
                    status: "FAILED",
                    message: "Invalid email entered",
                });
            }
        }

        if (updatedData.username) {
            const usernameExists = await User.findOne({ username: updatedData.username, _id: { $ne: userId } });
            if (usernameExists) {
                return res.status(400).json({
                    status: "FAILED",
                    message: "Username already exists for another user",
                });
            }

            if (!validateUsername(updatedData.username)) {
                return res.status(400).json({
                    status: "FAILED",
                    message: "Username must be at least 3 characters, containing only letters.",
                });
            }
        }

        if (updatedData.phoneNumber) {
            const phoneExists = await User.findOne({ phoneNumber: updatedData.phoneNumber, _id: { $ne: userId } });
            if (phoneExists) {
                return res.status(400).json({
                    status: "FAILED",
                    message: "Phone number already exists for another user",
                });
            }

            if (!validatePhoneNumber(updatedData.phoneNumber)) {
                return res.status(400).json({
                    status: "FAILED",
                    message: "Invalid phone number",
                });
            }
        }

        Object.keys(updatedData).forEach((key) => {
            existingUser[key] = updatedData[key]; //we update only the fields specified by the user
        });

        const savedUser = await existingUser.save(); //save the updated user

        return res.status(200).json({
            status: "SUCCESS",
            message: "User information updated successfully",
            data: savedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});

// Change password endpoint
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        status: 'FAILED', 
        message: 'User not found' 
      });
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ 
        status: 'FAILED', 
        message: 'Invalid new password. Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.' 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        status: 'FAILED', 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ 
      status: 'SUCCESS', 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ 
      status: 'FAILED', 
      message: 'An error occurred while changing the password' 
    });
  }
});

// Get User by ID
router.get('/get-user/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found",
            });
        }

        // Check if the requester has permission to view this user's information
        if (req.user.userId === userId || req.user.roles.includes('admin')) {
            return res.status(200).json({
                status: "SUCCESS",
                message: "User information retrieved successfully",
                data: user,
            });
        } else {
            return res.status(403).json({
                status: "FAILED",
                message: "Forbidden: You don't have permission to update this user",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});

// Get All Users
router.get('/users', authenticateToken, async (req, res) => {
    try {
        // Check if the requester has permission to view all users' information
        if (!req.user.roles.includes('admin')) {
            return res.status(403).json({
                status: "FAILED",
                message: "Forbidden: You don't have permission to view all users' information",
            });
        }

        // Retrieve all users
        const users = await User.find();

        return res.status(200).json({
            status: "SUCCESS",
            message: "All users' information retrieved successfully",
            data: users,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: user
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).json({
            status: "FAILED",
            message: "Error fetching user profile"
        });
    }
});

// Get user purchase history
router.get('/purchases', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
        
        const totalSpent = orders.reduce((total, order) => total + order.totalAmount, 0);

        return res.status(200).json({
            status: "SUCCESS",
            data: {
                purchases: orders,
                totalSpent: totalSpent
            }
        });
    } catch (error) {
        console.error('Error fetching purchase history:', error);
        return res.status(500).json({
            status: "FAILED",
            message: "Error fetching purchase history"
        });
    }
});

module.exports = router;