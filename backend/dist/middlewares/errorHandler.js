"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const env_1 = require("../config/env");
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    // Log error for dev
    console.error(`[ERROR HANDLER] ${req.method} ${req.originalUrl}`);
    console.error(err);
    // Zod Validation Error
    if (err instanceof zod_1.ZodError) {
        console.error(`[ZOD ERROR]`, JSON.stringify(err.errors, null, 2));
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        error = new AppError_1.AppError(message, 400);
    }
    // Prisma Errors
    if (err.code === 'P2002') {
        error = new AppError_1.AppError('Duplicate field value entered', 400);
    }
    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError_1.AppError('Invalid token. Please log in again!', 401);
    }
    if (err.name === 'TokenExpiredError') {
        error = new AppError_1.AppError('Your token has expired! Please log in again.', 401);
    }
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        ...(env_1.env.NODE_ENV === 'development' && { error: err.stack }),
    });
};
exports.errorHandler = errorHandler;
