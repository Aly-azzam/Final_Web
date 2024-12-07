const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const multer = require('multer');

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product
router.post('/products', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, location } = req.body;
    const image = req.file.path; // Get the uploaded file path

    const product = new Product({
      title,
      description,
      price,
      image: `http://localhost:3001/${image}`, // Format the image URL
      location,
      seller: req.user.id
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Invalid search query' });
    }

    const searchRegex = new RegExp(query, 'i');
    const products = await Product.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    })
    .select('_id title image price')
    .limit(5)
    .sort({ createdAt: -1 })
    .lean();

    const productsWithUrls = products.map(product => ({
      ...product,
      image: product.image ? `/uploads/${product.image}` : null
    }));

    res.json(productsWithUrls);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Create payment intent
router.post('/create-payment', auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
