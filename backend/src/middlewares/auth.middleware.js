const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return response.error(res, 'NO_TOKEN', 'No token provided', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return response.error(res, 'INVALID_TOKEN', 'Invalid token', 401);
    }
};
