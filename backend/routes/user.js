const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/order');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found"
            });
        }
        res.json({
            status: "SUCCESS",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "User not found"
            });
        }

        res.json({
            status: "SUCCESS",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
});

// Get user's purchase history
router.get('/purchases', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .sort({ date: -1 });
            
        res.json({
            status: "SUCCESS",
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
});

module.exports = router;
