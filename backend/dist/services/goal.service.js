"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoals = exports.deleteGoal = exports.addFunds = exports.updateGoal = exports.createGoal = void 0;
const prisma_1 = require("../database/prisma");
const AppError_1 = require("../utils/AppError");
const updateGoalStatus = (current, target, deadline, currentStatus = 'active') => {
    if (currentStatus === 'cancelled')
        return 'cancelled';
    if (current >= target)
        return 'completed';
    if (deadline && new Date() > new Date(deadline))
        return 'overdue';
    return 'active';
};
const createGoal = async (userId, data) => {
    return await prisma_1.prisma.goal.create({
        data: { ...data, userId },
    });
};
exports.createGoal = createGoal;
const updateGoal = async (userId, goalId, data) => {
    const goal = await prisma_1.prisma.goal.findFirst({ where: { id: goalId, userId } });
    if (!goal)
        throw new AppError_1.AppError('Goal not found', 404);
    // Sanitize data
    const { title, targetAmount, currentAmount, deadline, category, icon, status: manualStatus } = data;
    const updateData = {};
    if (title !== undefined)
        updateData.title = title;
    if (targetAmount !== undefined)
        updateData.targetAmount = targetAmount;
    if (currentAmount !== undefined)
        updateData.currentAmount = currentAmount;
    if (deadline !== undefined)
        updateData.deadline = deadline ? new Date(deadline) : null;
    if (category !== undefined)
        updateData.category = category;
    if (icon !== undefined)
        updateData.icon = icon;
    const finalTargetAmount = targetAmount !== undefined ? targetAmount : Number(goal.targetAmount);
    const finalCurrentAmount = currentAmount !== undefined ? currentAmount : Number(goal.currentAmount);
    const finalDeadline = deadline !== undefined ? (deadline ? new Date(deadline) : null) : goal.deadline;
    const status = manualStatus || updateGoalStatus(finalCurrentAmount, finalTargetAmount, finalDeadline, goal.status);
    updateData.status = status;
    return await prisma_1.prisma.goal.update({
        where: { id: goalId },
        data: updateData,
    });
};
exports.updateGoal = updateGoal;
const addFunds = async (userId, goalId, amount) => {
    const goal = await prisma_1.prisma.goal.findFirst({ where: { id: goalId, userId } });
    if (!goal)
        throw new AppError_1.AppError('Goal not found', 404);
    const currentAmountNum = typeof goal.currentAmount === 'object' ? goal.currentAmount.toNumber() : Number(goal.currentAmount);
    const targetAmountNum = typeof goal.targetAmount === 'object' ? goal.targetAmount.toNumber() : Number(goal.targetAmount);
    const newCurrent = currentAmountNum + amount;
    const status = updateGoalStatus(newCurrent, targetAmountNum, goal.deadline, goal.status);
    return await prisma_1.prisma.goal.update({
        where: { id: goalId },
        data: {
            currentAmount: newCurrent,
            status
        },
    });
};
exports.addFunds = addFunds;
const deleteGoal = async (userId, goalId) => {
    const goal = await prisma_1.prisma.goal.findFirst({ where: { id: goalId, userId } });
    if (!goal)
        throw new AppError_1.AppError('Goal not found', 404);
    await prisma_1.prisma.goal.delete({ where: { id: goalId } });
};
exports.deleteGoal = deleteGoal;
const getGoals = async (userId) => {
    const goals = await prisma_1.prisma.goal.findMany({ where: { userId } });
    return goals.map(goal => {
        const current = typeof goal.currentAmount === 'object' ? goal.currentAmount.toNumber() : Number(goal.currentAmount);
        const target = typeof goal.targetAmount === 'object' ? goal.targetAmount.toNumber() : Number(goal.targetAmount);
        return {
            ...goal,
            currentAmount: current,
            targetAmount: target,
            progressPercentage: target > 0 ? Math.min((current / target) * 100, 100) : 0,
        };
    });
};
exports.getGoals = getGoals;
