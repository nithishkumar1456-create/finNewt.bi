import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';

const updateGoalStatus = (current: number, target: number, deadline?: Date | null, currentStatus: string = 'active') => {
  if (currentStatus === 'cancelled') return 'cancelled';
  if (current >= target) return 'completed';
  if (deadline && new Date() > new Date(deadline)) return 'overdue';
  return 'active';
};

export const createGoal = async (userId: string, data: any) => {
  return await prisma.goal.create({
    data: { ...data, userId },
  });
};

export const updateGoal = async (userId: string, goalId: string, data: any) => {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new AppError('Goal not found', 404);

  // Sanitize data
  const { title, targetAmount, currentAmount, deadline, category, icon, status: manualStatus } = data;
  
  const updateData: any = {};
  if (title !== undefined) updateData.title = title;
  if (targetAmount !== undefined) updateData.targetAmount = targetAmount;
  if (currentAmount !== undefined) updateData.currentAmount = currentAmount;
  if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
  if (category !== undefined) updateData.category = category;
  if (icon !== undefined) updateData.icon = icon;

  const finalTargetAmount = targetAmount !== undefined ? targetAmount : Number(goal.targetAmount);
  const finalCurrentAmount = currentAmount !== undefined ? currentAmount : Number(goal.currentAmount);
  const finalDeadline = deadline !== undefined ? (deadline ? new Date(deadline) : null) : goal.deadline;
  
  const status = manualStatus || updateGoalStatus(finalCurrentAmount, finalTargetAmount, finalDeadline, goal.status);
  updateData.status = status;

  return await prisma.goal.update({
    where: { id: goalId },
    data: updateData,
  });
};

export const addFunds = async (userId: string, goalId: string, amount: number) => {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new AppError('Goal not found', 404);

  const currentAmountNum = typeof goal.currentAmount === 'object' ? (goal.currentAmount as any).toNumber() : Number(goal.currentAmount);
  const targetAmountNum = typeof goal.targetAmount === 'object' ? (goal.targetAmount as any).toNumber() : Number(goal.targetAmount);

  const newCurrent = currentAmountNum + amount;
  
  const status = updateGoalStatus(newCurrent, targetAmountNum, goal.deadline, goal.status);

  return await prisma.goal.update({
    where: { id: goalId },
    data: { 
      currentAmount: newCurrent,
      status 
    },
  });
};

export const deleteGoal = async (userId: string, goalId: string) => {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, userId } });
  if (!goal) throw new AppError('Goal not found', 404);

  await prisma.goal.delete({ where: { id: goalId } });
};

export const getGoals = async (userId: string) => {
  const goals = await prisma.goal.findMany({ where: { userId } });
  
  return goals.map(goal => {
    const current = typeof goal.currentAmount === 'object' ? (goal.currentAmount as any).toNumber() : Number(goal.currentAmount);
    const target = typeof goal.targetAmount === 'object' ? (goal.targetAmount as any).toNumber() : Number(goal.targetAmount);
    
    return {
      ...goal,
      currentAmount: current,
      targetAmount: target,
      progressPercentage: target > 0 ? Math.min((current / target) * 100, 100) : 0,
    };
  });
};