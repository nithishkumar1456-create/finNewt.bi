import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import transactionRoutes from './transaction.routes';
import budgetRoutes from './budget.routes';
import goalRoutes from './goal.routes';
import analyticsRoutes from './analytics.routes';
import exportRoutes from './export.routes';
import notificationRoutes from './notification.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/goals', goalRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/export', exportRoutes);
router.use('/notifications', notificationRoutes);

export default router;