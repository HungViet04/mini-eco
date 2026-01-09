const response = require('../utils/response');

// `roles` can be a single role string or an array of allowed roles
module.exports = (roles) => {
    const allowed = Array.isArray(roles)
        ? roles.map(r => String(r || '').toLowerCase())
        : [String(roles || '').toLowerCase()];

    return (req, res, next) => {
        if (!req.user) {
            return response.error(res, 'UNAUTHORIZED', 'Unauthorized', 401);
        }

        const userRole = String(req.user.role || '').toLowerCase();
        if (!allowed.includes(userRole)) {
            return response.error(res, 'FORBIDDEN', 'Forbidden', 403);
        }

        next();
    };
};
