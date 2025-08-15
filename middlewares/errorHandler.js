const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const errors = Object.fromEntries(
            Object.values(err.errors).map((err) => [err.path, err.message])
        );
        const appError = new AppError('Fail', 400, errors);
        return res.status(appError.statusCode).json({
            status: appError.status,
            message: appError.message
        });
    }

    // Handle Mongoose Cast Error (Invalid ID)
    if (err.name === 'CastError') {
        const appError = new AppError('Fail', 400, `Invalid ID: ${err.value}`);
        return res.status(appError.statusCode).json({
            status: appError.status,
            message: appError.message
        });
    }

    // Default error handler
    res.status(err.statusCode || 500).json({
        status: err.status || 'error',
        message: err.message || 'Something went wrong'
    });
};

module.exports = errorHandler;
