const AppError = require('../utils/AppError');

const authorizedRules = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError('Fail', 400, 'You do not have access to this data'));
        }
        next();
    };
};

module.exports = authorizedRules;