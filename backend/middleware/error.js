// backend/middleware/error.js
// FIX: [Global Error Handler] consistent JSON response format

const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        // Only show stack in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
