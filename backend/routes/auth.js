const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client('716688971918-iup3ekqigrasvp396fp524kl9floser0.apps.googleusercontent.com');

// Google Sign In/Sign Up
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '716688971918-iup3ekqigrasvp396fp524kl9floser0.apps.googleusercontent.com'
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if user exists in your database
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if doesn't exist
            user = new User({
                email,
                firstName: name.split(' ')[0],
                lastName: name.split(' ')[1] || '',
                profilePicture: picture,
                googleId: payload.sub,
                roles: ['user'],
                username: email.split('@')[0], // Use email prefix as username
                phoneNumber: '000000000', // Default phone number
                dateOfBirth: new Date(), // Default date
                location: 'Not specified' // Default location
            });
            await user.save();
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { userId: user._id, roles: user.roles },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            status: 'SUCCESS',
            accessToken,
            data: [{
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles
            }]
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Authentication failed'
        });
    }
});

module.exports = router;
