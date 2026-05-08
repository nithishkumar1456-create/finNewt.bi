"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const prisma_1 = require("../database/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = require("../utils/AppError");
const getProfile = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: { settings: true },
    });
    if (!user) {
        throw new AppError_1.AppError('User not found', 404);
    }
    // exclude password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.getProfile = getProfile;
const updateProfile = async (userId, data) => {
    const { fullName, theme, currency, notificationEmail, notificationPush } = data;
    const user = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: {
            ...(fullName && { fullName }),
            settings: {
                update: {
                    ...(theme && { theme }),
                    ...(currency && { currency }),
                    ...(notificationEmail !== undefined && { notificationEmail }),
                    ...(notificationPush !== undefined && { notificationPush }),
                },
            },
        },
        include: { settings: true },
    });
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.updateProfile = updateProfile;
const changePassword = async (userId, data) => {
    const { currentPassword, newPassword } = data;
    const user = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new AppError_1.AppError('User not found', 404);
    if (!(await bcryptjs_1.default.compare(currentPassword, user.password))) {
        throw new AppError_1.AppError('Current password is incorrect', 400);
    }
    const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 12);
    await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });
};
exports.changePassword = changePassword;
