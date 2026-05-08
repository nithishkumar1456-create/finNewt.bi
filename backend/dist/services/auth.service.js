"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.refresh = exports.logout = exports.login = exports.verifyOtp = exports.register = void 0;
const prisma_1 = require("../database/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const env_1 = require("../config/env");
const redis_1 = __importDefault(require("../cache/redis"));
const email_1 = require("../utils/email");
const normalizeEmail = (email) => email.trim().toLowerCase();
const sanitizeUser = (user) => {
    const { password, ...safeUser } = user;
    return safeUser;
};
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const register = async (data) => {
    const { fullName, phone, password } = data;
    const email = normalizeEmail(data.email);
    console.log('[AUTH REGISTER] Registration payload received', {
        email,
        hasPassword: Boolean(password),
        passwordLength: password?.length,
        hasPhone: Boolean(phone?.trim()),
    });
    const orConditions = [{ email }];
    if (phone && phone.trim() !== '') {
        orConditions.push({ phone });
    }
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: { OR: orConditions },
    });
    if (existingUser) {
        throw new AppError_1.AppError('User with this email or phone already exists', 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    // Generate and send OTP
    const otp = generateOTP();
    // Store user data in Redis pending verification
    const pendingUserData = {
        fullName,
        email,
        phone: phone && phone.trim() !== '' ? phone : null,
        password: hashedPassword,
    };
    await redis_1.default.set(`otp:${email}`, otp, 'EX', 600); // 10 minutes expiry
    await redis_1.default.set(`pending_user:${email}`, JSON.stringify(pendingUserData), 'EX', 600); // 10 minutes expiry
    console.log('[AUTH REGISTER] OTP and pending user written to Redis', { email });
    await (0, email_1.sendEmail)({
        to: email,
        subject: 'FinNewt.bi - Verify your email',
        text: `Your FinNewt OTP is: ${otp}. It is valid for 10 minutes. Please do not share it.`,
    });
    return { message: 'User registration initiated. Please check email for OTP to verify.' };
};
exports.register = register;
const verifyOtp = async (email, otp) => {
    email = normalizeEmail(email);
    console.log('[AUTH VERIFY OTP] Verification attempt', { email, otpLength: otp?.length });
    const storedOtp = await redis_1.default.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
        console.error('[AUTH VERIFY OTP] Invalid or expired OTP', { email, hasStoredOtp: Boolean(storedOtp) });
        throw new AppError_1.AppError('Invalid or expired OTP', 400);
    }
    const pendingUserString = await redis_1.default.get(`pending_user:${email}`);
    if (!pendingUserString) {
        throw new AppError_1.AppError('Registration session expired. Please register again.', 400);
    }
    const pendingUser = JSON.parse(pendingUserString);
    // Double check if user was created while pending
    const orConditions = [{ email: pendingUser.email }];
    if (pendingUser.phone) {
        orConditions.push({ phone: pendingUser.phone });
    }
    const existingUser = await prisma_1.prisma.user.findFirst({
        where: { OR: orConditions },
    });
    if (existingUser) {
        throw new AppError_1.AppError('User already exists', 400);
    }
    const user = await prisma_1.prisma.user.create({
        data: {
            fullName: pendingUser.fullName,
            email: pendingUser.email,
            phone: pendingUser.phone,
            password: pendingUser.password,
            isEmailVerified: true,
        },
    });
    // Create default settings
    await prisma_1.prisma.settings.create({
        data: { userId: user.id },
    });
    await redis_1.default.del(`otp:${email}`);
    await redis_1.default.del(`pending_user:${email}`);
    const accessToken = (0, jwt_1.signToken)(user.id, env_1.env.JWT_SECRET, '15m');
    const refreshToken = (0, jwt_1.signToken)(user.id, env_1.env.JWT_REFRESH_SECRET, '7d');
    console.log('[AUTH VERIFY OTP] JWT and refresh token generated', {
        userId: user.id,
        hasAccessToken: Boolean(accessToken),
        hasRefreshToken: Boolean(refreshToken),
    });
    await prisma_1.prisma.session.create({
        data: {
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
    });
    console.log('[AUTH VERIFY OTP] Session created', { userId: user.id });
    return { user: sanitizeUser(user), accessToken, refreshToken };
};
exports.verifyOtp = verifyOtp;
const login = async (data) => {
    const { email, password } = data;
    console.log('[AUTH LOGIN] Incoming login payload', {
        email,
        hasPassword: Boolean(password),
        passwordLength: password?.length,
    });
    if (!email || !password) {
        console.error('[AUTH LOGIN] Missing email or password');
        throw new AppError_1.AppError('Email and password are required', 400);
    }
    const normalizedEmail = normalizeEmail(email);
    console.log('[AUTH LOGIN] Normalized email', { normalizedEmail });
    const user = await prisma_1.prisma.user.findUnique({ where: { email: normalizedEmail } });
    console.log('[AUTH LOGIN] Prisma lookup result', {
        found: Boolean(user),
        userId: user?.id,
        isEmailVerified: user?.isEmailVerified,
        storedHashExists: Boolean(user?.password),
    });
    if (!user) {
        console.error('[AUTH LOGIN] User not found', { normalizedEmail });
        throw new AppError_1.AppError('Invalid credentials', 401);
    }
    console.log('[AUTH LOGIN] User found. Running bcrypt.compare');
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    console.log('[AUTH LOGIN] bcrypt comparison result', { userId: user.id, isPasswordValid });
    if (!isPasswordValid) {
        console.error('[AUTH LOGIN] Invalid password', { normalizedEmail, userId: user.id });
        throw new AppError_1.AppError('Invalid credentials', 401);
    }
    if (!user.isEmailVerified) {
        console.error('[AUTH LOGIN] User email not verified', { normalizedEmail, userId: user.id });
        throw new AppError_1.AppError('Please verify your email first', 401);
    }
    console.log('[AUTH LOGIN] Password verified. Generating tokens', { userId: user.id });
    const accessToken = (0, jwt_1.signToken)(user.id, env_1.env.JWT_SECRET, '15m');
    const refreshToken = (0, jwt_1.signToken)(user.id, env_1.env.JWT_REFRESH_SECRET, '7d');
    console.log('[AUTH LOGIN] JWT and refresh token generated', {
        userId: user.id,
        hasAccessToken: Boolean(accessToken),
        hasRefreshToken: Boolean(refreshToken),
    });
    await prisma_1.prisma.session.create({
        data: {
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    console.log('[AUTH LOGIN] Session created in DB. Returning sanitized response', { userId: user.id });
    return { user: sanitizeUser(user), accessToken, refreshToken };
};
exports.login = login;
const logout = async (userId, refreshToken) => {
    await prisma_1.prisma.session.deleteMany({
        where: {
            userId,
            refreshToken,
        },
    });
};
exports.logout = logout;
const refresh = async (refreshToken) => {
    console.log('[AUTH REFRESH] Refresh requested', { hasRefreshToken: Boolean(refreshToken) });
    if (!refreshToken) {
        throw new AppError_1.AppError('No refresh token provided', 401);
    }
    let decoded;
    try {
        decoded = (0, jwt_1.verifyToken)(refreshToken, env_1.env.JWT_REFRESH_SECRET);
        console.log('[AUTH REFRESH] Refresh token verified', { userId: decoded.id, jti: decoded.jti });
    }
    catch (error) {
        console.error('[AUTH REFRESH] Refresh token verification failed', error);
        throw new AppError_1.AppError('Invalid or expired refresh token', 401);
    }
    const session = await prisma_1.prisma.session.findUnique({
        where: { refreshToken },
        include: { user: true },
    });
    if (!session || session.expiresAt < new Date()) {
        console.error('[AUTH REFRESH] Session missing or expired', {
            found: Boolean(session),
            expiresAt: session?.expiresAt,
        });
        throw new AppError_1.AppError('Session expired. Please log in again.', 401);
    }
    const newAccessToken = (0, jwt_1.signToken)(session.user.id, env_1.env.JWT_SECRET, '15m');
    const newRefreshToken = (0, jwt_1.signToken)(session.user.id, env_1.env.JWT_REFRESH_SECRET, '7d');
    await prisma_1.prisma.session.update({
        where: { id: session.id },
        data: {
            refreshToken: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });
    console.log('[AUTH REFRESH] Session rotated and tokens regenerated', { userId: session.user.id });
    return { user: sanitizeUser(session.user), accessToken: newAccessToken, refreshToken: newRefreshToken };
};
exports.refresh = refresh;
const forgotPassword = async (email) => {
    email = normalizeEmail(email);
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    // For security, always return success even if user doesn't exist
    if (!user)
        return;
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    // Store hashed token in Redis with 1 hour expiry
    await redis_1.default.set(`password_reset:${hashedToken}`, user.id, 'EX', 3600);
    const resetURL = `${env_1.env.CLIENT_URL}/reset-password/${resetToken}`;
    await (0, email_1.sendEmail)({
        to: email,
        subject: 'FinNewt.bi - Password Reset',
        text: `You requested a password reset. Please click on the link to reset your password: ${resetURL}\n\nThis link is valid for 1 hour.`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb; text-align: center;">FinNewt.bi</h2>
        <p>You requested a password reset for your account.</p>
        <p>Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetURL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `
    });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (token, newPassword) => {
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    const userId = await redis_1.default.get(`password_reset:${hashedToken}`);
    if (!userId) {
        throw new AppError_1.AppError('Token is invalid or has expired', 400);
    }
    const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
    // Delete all sessions for the user to force logout everywhere
    await prisma_1.prisma.session.deleteMany({ where: { userId } });
    // Delete the reset token
    await redis_1.default.del(`password_reset:${hashedToken}`);
};
exports.resetPassword = resetPassword;
