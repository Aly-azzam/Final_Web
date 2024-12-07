const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Handle favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logo.png'));
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/solar_panels', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// Routes
const authRoutes = require('./api/Auth');
const userRoutes = require('./api/User');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const googleAuthRoutes = require('./routes/auth');

// Use Routes
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Combine all auth routes
app.use('/api/auth', [authRoutes, googleAuthRoutes]);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
