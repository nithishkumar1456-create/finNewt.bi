"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHealthScore = void 0;
const prisma_1 = require("../database/prisma");
const calculateHealthScore = async (userId) => {
    let score = 100;
    // Penalty for exceeding budgets
    const budgets = await prisma_1.prisma.budget.findMany({ where: { userId } });
    for (const budget of budgets) {
        const spentData = await prisma_1.prisma.transaction.aggregate({
            _sum: { amount: true },
            where: { userId, category: budget.category, type: 'EXPENSE' },
        });
        if (Number(spentData._sum.amount || 0) > Number(budget.limit)) {
            score -= 10;
        }
    }
    // Bonus for goals progress
    const goals = await prisma_1.prisma.goal.findMany({ where: { userId } });
    if (goals.length > 0) {
        const avgProgress = goals.reduce((acc, goal) => acc + (Number(goal.currentAmount) / Number(goal.targetAmount)), 0) / goals.length;
        score += (avgProgress * 10);
    }
    // Savings ratio penalty/bonus
    const transactions = await prisma_1.prisma.transaction.findMany({ where: { userId } });
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
        if (t.type === 'INCOME')
            income += Number(t.amount);
        if (t.type === 'EXPENSE')
            expense += Number(t.amount);
    });
    if (income > 0) {
        const savingsRatio = (income - expense) / income;
        if (savingsRatio < 0.1)
            score -= 15; // Saving less than 10%
        else if (savingsRatio > 0.3)
            score += 10; // Saving more than 30%
    }
    else if (expense > 0) {
        score -= 20; // No income but expenses
    }
    // Bound score between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));
    let category = 'Poor';
    if (score >= 80)
        category = 'Excellent';
    else if (score >= 60)
        category = 'Healthy';
    else if (score >= 40)
        category = 'Moderate';
    return { score, category };
};
exports.calculateHealthScore = calculateHealthScore;
