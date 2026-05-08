"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const prisma_1 = require("../database/prisma");
exports.protect = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }
    console.log('[AUTH MIDDLEWARE] Protect invoked', {
        method: req.method,
        path: req.originalUrl,
        hasBearerToken: Boolean(req.headers.authorization?.startsWith('Bearer')),
        hasCookieToken: Boolean(req.cookies?.accessToken),
    });
    if (!token) {
        console.error('[AUTH MIDDLEWARE] No access token found');
        return next(new AppError_1.AppError('You are not logged in! Please log in to get access.', 401));
    }
    const decoded = (0, jwt_1.verifyToken)(token, env_1.env.JWT_SECRET);
    console.log('[AUTH MIDDLEWARE] JWT verified', { userId: decoded.id, jti: decoded.jti });
    const currentUser = await prisma_1.prisma.user.findUnique({
        where: { id: decoded.id },
    });
    console.log('[AUTH MIDDLEWARE] Prisma user lookup result', {
        found: Boolean(currentUser),
        userId: currentUser?.id,
    });
    if (!currentUser) {
        console.error('[AUTH MIDDLEWARE] Token user no longer exists', { userId: decoded.id });
        return next(new AppError_1.AppError('The user belonging to this token does no longer exist.', 401));
    }
    // Add user to request
    req.user = currentUser;
    next();
});
