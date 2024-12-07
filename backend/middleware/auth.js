const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                status: "FAILED",
                message: "No authentication token, access denied"
            });
        }

        // Verify token
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'your-secret-key');
        
        if (!verified) {
            return res.status(401).json({
                status: "FAILED",
                message: "Token verification failed, authorization denied"
            });
        }

        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({
            status: "FAILED",
            message: "Token is not valid"
        });
    }
};

module.exports = auth;
