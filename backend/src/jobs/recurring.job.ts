import cron from 'node-cron';
import { prisma } from '../database/prisma';
import { sendEmail } from '../utils/email';

export const processRecurringTransactions = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const recurring = await prisma.recurringTransaction.findMany({
    where: {
      isActive: true,
      nextRunDate: { lte: today },
    },
  });

  for (const rt of recurring) {
    try {
      await prisma.transaction.create({
        data: {
          userId: rt.userId,
          amount: rt.amount,
          type: rt.type,
          category: rt.category,
          date: today,
          note: `Recurring: ${rt.note || rt.category}`,
          recurring: true,
          recurringType: rt.frequency,
        },
      });

      // Calculate next run date
      const nextRunDate = new Date(today);
      if (rt.frequency === 'daily') nextRunDate.setDate(today.getDate() + 1);
      if (rt.frequency === 'weekly') nextRunDate.setDate(today.getDate() + 7);
      if (rt.frequency === 'monthly') nextRunDate.setMonth(today.getMonth() + 1);
      if (rt.frequency === 'yearly') nextRunDate.setFullYear(today.getFullYear() + 1);

      await prisma.recurringTransaction.update({
        where: { id: rt.id },
        data: {
          lastRunDate: today,
          nextRunDate,
        },
      });
    } catch (error) {
      console.error(`Failed to process recurring transaction ${rt.id}:`, error);
    }
  }
};