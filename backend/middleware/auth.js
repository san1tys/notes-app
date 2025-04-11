const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        logger.warn('Access token missing');
        return res.status(401).json({ error: true, message: 'Access token missing' });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            logger.warn('Invalid access token');
            return res.status(403).json({ error: true, message: 'Invalid access token' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
