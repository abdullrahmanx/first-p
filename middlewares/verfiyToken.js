
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return next(new AppError('Error', 401, "Authorization header is required"));
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(new AppError('Error', 401, "Token is required"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return next(new AppError('Error', 401, "Invalid token"));
    }
};

module.exports = verifyToken;