"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(2).optional(),
        theme: zod_1.z.string().optional(),
        currency: zod_1.z.string().optional(),
        notificationEmail: zod_1.z.boolean().optional(),
        notificationPush: zod_1.z.boolean().optional(),
    }),
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string(),
        newPassword: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    }),
});
