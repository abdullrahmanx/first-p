class AppError extends Error {
    constructor(status, statusCode, message) {
        super()
        this.message = message
        this.statusCode = statusCode;
        this.status = status
    }

}

module.exports = AppError;