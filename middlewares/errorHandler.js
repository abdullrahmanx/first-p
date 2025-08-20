const AppError = require('../utils/AppError');
const logger= require('../utils/logger')

const errorHandler = (err, req, res, next) => {

    
    logger.error(`${err.message} - ${req.method} ${req.url}`);
    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const errors = Object.fromEntries(
            Object.values(err.errors).map((err) => [err.path,err.message])
        );
        console.log(errors)
        const appError = new AppError('Error', 401, errors);
        return res.status(appError.statusCode).json({
            status: appError.status,
            message: appError.message,
        });
    }


    if (err.name === 'CastError') {
        const appError = new AppError('Error', 400, `Invalid ID: ${err.value}`);
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
