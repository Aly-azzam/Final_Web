const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const auth = require('../middleware/auth');

// Create a new order
router.post('/', auth, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        const userId = req.user.userId;

        const order = new Order({
            userId,
            items,
            totalAmount
        });

        const savedOrder = await order.save();
        res.status(201).json({
            status: "SUCCESS",
            data: savedOrder
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
});

// Get user's orders
router.get('/user', auth, async (req, res) => {
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

// Get specific order
router.get('/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            userId: req.user.userId
        });

        if (!order) {
            return res.status(404).json({
                status: "FAILED",
                message: "Order not found"
            });
        }

        res.json({
            status: "SUCCESS",
            data: order
        });
    } catch (error) {
        res.status(500).json({
            status: "FAILED",
            message: error.message
        });
    }
});

module.exports = router;
