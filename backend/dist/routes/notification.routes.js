"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getNotifications = void 0;
const express_1 = require("express");
const prisma_1 = require("../database/prisma");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const catchAsync_1 = require("../utils/catchAsync");
const router = (0, express_1.Router)();
exports.getNotifications = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const notifications = await prisma_1.prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
    res.status(200).json({ success: true, data: { notifications } });
});
exports.markAsRead = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await prisma_1.prisma.notification.update({
        where: { id: req.params.id, userId: req.user.id },
        data: { isRead: true },
    });
    res.status(200).json({ success: true, message: 'Notification marked as read' });
});
router.use(auth_middleware_1.protect);
router.get('/', exports.getNotifications);
router.put('/:id/read', exports.markAsRead);
exports.default = router;
