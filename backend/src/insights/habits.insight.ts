import { prisma } from '../database/prisma';

export const analyzeHabits = async (userId: string) => {
  const insights = [];

  const transactions = await prisma.transaction.findMany({
    where: { userId, type: 'EXPENSE' },
  });

  let weekendExpenses = 0;
  let weekdayExpenses = 0;

  transactions.forEach(t => {
    const day = new Date(t.date).getDay();
    if (day === 0 || day === 6) weekendExpenses += Number(t.amount);
    else weekdayExpenses += Number(t.amount);
  });

  if (weekendExpenses > weekdayExpenses * 0.6) {
    insights.push({
      userId,
      type: 'behavior',
      title: 'Weekend Spending Habit',
      description: 'You tend to spend a significant portion of your money on weekends.',
    });
  }

  return insights;
};