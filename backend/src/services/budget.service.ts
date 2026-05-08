import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';

export const createBudget = async (userId: string, data: any) => {
  const { category, period = 'monthly', startDate, endDate } = data;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const existingBudget = await prisma.budget.findFirst({
    where: { userId, category, period, startDate: start, endDate: end },
  });

  if (existingBudget) {
    throw new AppError('Budget for this category and period already exists', 400);
  }

  return await prisma.budget.create({
    data: { 
      ...data, 
      userId,
      startDate: start,
      endDate: end
    },
  });
};

export const updateBudget = async (userId: string, budgetId: string, data: any) => {
  const budget = await prisma.budget.findFirst({ where: { id: budgetId, userId } });
  if (!budget) throw new AppError('Budget not found', 404);

  const { limit, endDate } = data;
  const updateData: any = {};
  if (limit !== undefined) updateData.limit = limit;
  if (endDate !== undefined) updateData.endDate = new Date(endDate);

  return await prisma.budget.update({
    where: { id: budgetId },
    data: updateData,
  });
};

export const deleteBudget = async (userId: string, budgetId: string) => {
  const budget = await prisma.budget.findFirst({ where: { id: budgetId, userId } });
  if (!budget) throw new AppError('Budget not found', 404);

  await prisma.budget.delete({ where: { id: budgetId } });
};

export const getBudgets = async (userId: string) => {
  const budgets = await prisma.budget.findMany({ where: { userId } });
  
  // Calculate spent amount for each budget
  const budgetsWithSpending = await Promise.all(
    budgets.map(async (budget) => {
      const result = await prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          category: budget.category,
          type: 'EXPENSE',
          date: {
            gte: budget.startDate,
            lte: budget.endDate,
          },
        },
      });

      const spent = result._sum.amount ? (typeof result._sum.amount === 'object' ? (result._sum.amount as any).toNumber() : Number(result._sum.amount)) : 0;
      const limit = typeof budget.limit === 'object' ? (budget.limit as any).toNumber() : Number(budget.limit);
      const remaining = limit - spent;

      return {
        ...budget,
        spent,
        limit,
        remaining,
        usagePercentage: limit > 0 ? (spent / limit) * 100 : 0,
      };
    })
  );

  return budgetsWithSpending;
};