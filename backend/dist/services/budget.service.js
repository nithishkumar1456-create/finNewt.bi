"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudgets = exports.deleteBudget = exports.updateBudget = exports.createBudget = void 0;
const prisma_1 = require("../database/prisma");
const AppError_1 = require("../utils/AppError");
const createBudget = async (userId, data) => {
    const { category, period = 'monthly', startDate, endDate } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const existingBudget = await prisma_1.prisma.budget.findFirst({
        where: { userId, category, period, startDate: start, endDate: end },
    });
    if (existingBudget) {
        throw new AppError_1.AppError('Budget for this category and period already exists', 400);
    }
    return await prisma_1.prisma.budget.create({
        data: {
            ...data,
            userId,
            startDate: start,
            endDate: end
        },
    });
};
exports.createBudget = createBudget;
const updateBudget = async (userId, budgetId, data) => {
    const budget = await prisma_1.prisma.budget.findFirst({ where: { id: budgetId, userId } });
    if (!budget)
        throw new AppError_1.AppError('Budget not found', 404);
    const { limit, endDate } = data;
    const updateData = {};
    if (limit !== undefined)
        updateData.limit = limit;
    if (endDate !== undefined)
        updateData.endDate = new Date(endDate);
    return await prisma_1.prisma.budget.update({
        where: { id: budgetId },
        data: updateData,
    });
};
exports.updateBudget = updateBudget;
const deleteBudget = async (userId, budgetId) => {
    const budget = await prisma_1.prisma.budget.findFirst({ where: { id: budgetId, userId } });
    if (!budget)
        throw new AppError_1.AppError('Budget not found', 404);
    await prisma_1.prisma.budget.delete({ where: { id: budgetId } });
};
exports.deleteBudget = deleteBudget;
const getBudgets = async (userId) => {
    const budgets = await prisma_1.prisma.budget.findMany({ where: { userId } });
    // Calculate spent amount for each budget
    const budgetsWithSpending = await Promise.all(budgets.map(async (budget) => {
        const result = await prisma_1.prisma.transaction.aggregate({
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
        const spent = result._sum.amount ? (typeof result._sum.amount === 'object' ? result._sum.amount.toNumber() : Number(result._sum.amount)) : 0;
        const limit = typeof budget.limit === 'object' ? budget.limit.toNumber() : Number(budget.limit);
        const remaining = limit - spent;
        return {
            ...budget,
            spent,
            limit,
            remaining,
            usagePercentage: limit > 0 ? (spent / limit) * 100 : 0,
        };
    }));
    return budgetsWithSpending;
};
exports.getBudgets = getBudgets;
