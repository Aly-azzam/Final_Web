const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const multer = require('multer');

// MongoDB SolarPanel Model
const SolarPanel = require('./../models/SolarPanel');

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

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file to avoid conflicts
    },
});

// Create Multer instance with the configured storage
const upload = multer({ storage: storage });

// Add new solar panel ad
router.post('/solar-panels', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { title, description, price, location } = req.body;
        const image = req.file.path; // Multer adds a "file" property to the request object


        // Validate input fields
        if (Object.values(req.body).some(value => value === "")) {
            return res.status(400).json({
                status: "FAILED",
                message: "Empty input fields!",
            });
        }

        const userId = req.user.userId; //userID from auth user
        const firstName = req.user.firstName;
        const lastName = req.user.lastName;
        const email = req.user.email;
        const phoneNumber = req.user.phoneNumber;

        const newSolarPanel = new SolarPanel({
            title,
            description,
            price,
            location,
            image,
            user: {
                _id: userId,
                email: email,
                phoneNumber: phoneNumber,
                firstName: firstName,
                lastName: lastName,
            },

        });

        const savedSolarPanel = await newSolarPanel.save();

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product ad posted successfully!",
            data: savedSolarPanel,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});


// Delete a solar panel by ID
router.delete('/solar-panels/:id', authenticateToken, async (req, res) => {
    try {
        const solarPanel = await SolarPanel.findById(req.params.id); //id from the api link

        if (!solarPanel) {
            return res.status(404).json({
                status: "FAILED",
                message: "Product not found",
            });
        }

        // Make sure that it is the same user that is linked to the solar panel
        if (solarPanel.user._id.toString() !== req.user.userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "You do not have permission to delete this solar panel",
            });
        }

        const deletedSolarPanel = await SolarPanel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product deleted successfully!",
            data: deletedSolarPanel,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});


// Update a solar panel
router.put('/solar-panels/:id', authenticateToken, async (req, res) => {
    try {
        const solarPanel = await SolarPanel.findById(req.params.id);

        if (!solarPanel) {
            return res.status(404).json({
                status: "FAILED",
                message: "Product not found",
            });
        }

        // Make sure that it is the same user that is linked to the solar panel
        if (solarPanel.user._id.toString() !== req.user.userId) {
            return res.status(403).json({
                status: "FAILED",
                message: "You do not have permission to update this solar panel",
            });
        }

        const { title, description, price, location, image } = req.body;

        solarPanel.title = title;
        solarPanel.description = description;
        solarPanel.price = price;
        solarPanel.location = location;
        solarPanel.image = image;

        const updatedSolarPanel = await solarPanel.save(); //save new solar panel

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product updated successfully!",
            data: updatedSolarPanel,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});

// Get all solar panels
router.get('/solar-panels', async (req, res) => {
    try {

        const solarPanels = await SolarPanel.find()
        
        return res.status(200).json({
            status: "SUCCESS",
            message: "Product retrieved successfully!",
            data: solarPanels,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});

// Get first 10 solar panels
router.get('/solar-panels/first-10', async (req, res) => {
    try {
        const solarPanels = await SolarPanel.find().limit(10);
        return res.status(200).json({
            status: "SUCCESS",
            message: "First 10 product retrieved successfully!",
            data: solarPanels,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});


// Get a specific solar panel by ID
router.get('/solar-panels/:id', async (req, res) => {
    try {
        const solarPanel = await SolarPanel.findById(req.params.id);
        if (!solarPanel) {
            return res.status(404).json({
                status: "FAILED",
                message: "Product panel found",
            });
        }
        return res.status(200).json({
            status: "SUCCESS",
            message: "Product  retrieved successfully!",
            data: solarPanel,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});

// Get solar panels for the logged in user
router.get('/user-solar-panels', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const userSolarPanels = await SolarPanel.find({ 'user._id': userId });
        return res.status(200).json({
            status: "SUCCESS",
            message: "User's product retrieved successfully!",
            data: userSolarPanels,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});

// Search for solar panels using the search engine (?q= in the url)
router.get('/search-solar-panels', async (req, res) => {
    try {
        const searchTerm = req.query.q;

        if (!searchTerm) {
            return res.status(400).json({
                status: "FAILED",
                message: "Search term is required.",
            });
        }

        // Split the search term into an array of words
        const searchWords = searchTerm.split(/\s+/);

        const searchConditions = searchWords.map(word => ({
            $or: [
                { title: { $regex: word, $options: 'i' } },
                { description: { $regex: word, $options: 'i' } },
                { location: { $regex: word, $options: 'i' } },
                { 'user.username': { $regex: word, $options: 'i' } },
                { 'user.firstName': { $regex: word, $options: 'i' } },
                { 'user.lastName': { $regex: word, $options: 'i' } },
                { 'user.email': { $regex: word, $options: 'i' } },
            ],
        }));

        // Combine the conditions using $and to match all words
        const searchResults = await SolarPanel.find({ $and: searchConditions });

        return res.status(200).json({
            status: "SUCCESS",
            message: "Product retrieved based on search criteria!",
            data: searchResults,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while processing the request",
        });
    }
});







module.exports = router;
