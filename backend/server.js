// mongodb
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
const UserRouter = require('./api/User');
const AuthRouter = require('./api/Auth');
const SolarPanel = require('./api/SolarPanel');
const ProductRouter = require('./routes/products');

app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/solar-panel', SolarPanel);
app.use('/api/products', ProductRouter);

// Root route
app.get('/', (req, res) => {
    res.send('Lithium Power API Server');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'ERROR', message: 'Something went wrong!' });
});

const port = process.env.PORT || 3002;

// Connect to MongoDB and start server
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

startServer();