import { Request, Response } from 'express';
import { Router } from 'express';
import { prisma } from '../database/prisma';
import { protect } from '../middlewares/auth.middleware';
import { catchAsync } from '../utils/catchAsync';

const router = Router();

export const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.status(200).json({ success: true, data: { notifications } });
});

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  await prisma.notification.update({
    where: { id: req.params.id, userId: req.user!.id },
    data: { isRead: true },
  });
  res.status(200).json({ success: true, message: 'Notification marked as read' });
});

router.use(protect);
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);

export default router;