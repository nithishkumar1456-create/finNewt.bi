"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.verifyOtp = exports.register = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const authService = __importStar(require("../services/auth.service"));
const setCookies = (res, accessToken, refreshToken) => {
    const isProd = process.env.NODE_ENV === 'production';
    console.log('[AUTH CONTROLLER] Setting auth cookies', {
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
        hasAccessToken: Boolean(accessToken),
        hasRefreshToken: Boolean(refreshToken),
    });
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax', // Relaxed in development for local testing
        maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};
const clearCookies = (res) => {
    const isProd = process.env.NODE_ENV === 'production';
    const options = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'strict' : 'lax',
    };
    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);
};
exports.register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, message: result.message });
});
exports.verifyOtp = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, otp } = req.body;
    console.log('[AUTH CONTROLLER] Verify OTP request received', { email, otpLength: otp?.length });
    const { user, accessToken, refreshToken } = await authService.verifyOtp(email, otp);
    setCookies(res, accessToken, refreshToken);
    console.log('[AUTH CONTROLLER] Verify OTP response ready', { userId: user.id, hasAccessToken: Boolean(accessToken) });
    res.status(200).json({
        success: true,
        message: 'Email verified successfully',
        accessToken,
        user,
        data: { user },
    });
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    console.log('[AUTH CONTROLLER] Login request received', {
        email: req.body.email,
        hasPassword: Boolean(req.body.password),
        passwordLength: req.body.password?.length,
    });
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    console.log('[AUTH CONTROLLER] Login successful. Setting cookies and returning token contract', {
        userId: user.id,
        hasAccessToken: Boolean(accessToken),
    });
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({
        success: true,
        message: 'Login successful',
        accessToken,
        user,
        data: { user },
    });
});
exports.logout = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    const user = req.user;
    console.log('[AUTH CONTROLLER] Logout request received', {
        userId: user?.id,
        hasRefreshToken: Boolean(refreshToken),
    });
    if (user && refreshToken) {
        await authService.logout(user.id, refreshToken);
    }
    clearCookies(res);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});
exports.refresh = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    console.log('[AUTH CONTROLLER] Refresh request received', { hasRefreshToken: Boolean(refreshToken) });
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'No refresh token found' });
    }
    const { user, accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
    setCookies(res, accessToken, newRefreshToken);
    console.log('[AUTH CONTROLLER] Refresh response ready', { userId: user.id, hasAccessToken: Boolean(accessToken) });
    res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        accessToken,
        user,
        data: { user },
    });
});
exports.forgotPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({ success: true, message: 'Reset link sent to your email' });
});
exports.resetPassword = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { token, newPassword } = req.body;
    await authService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, message: 'Password reset successful' });
});
