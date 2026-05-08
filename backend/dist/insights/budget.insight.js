"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeBudget = void 0;
const prisma_1 = require("../database/prisma");
const analyzeBudget = async (userId) => {
    const budgets = await prisma_1.prisma.budget.findMany({ where: { userId } });
    const insights = [];
    for (const budget of budgets) {
        const result = await prisma_1.prisma.transaction.aggregate({
            _sum: { amount: true },
            where: {
                userId,
                category: budget.category,
                type: 'EXPENSE',
                date: { gte: budget.startDate, lte: budget.endDate },
            },
        });
        const spent = Number(result._sum.amount || 0);
        const limit = Number(budget.limit);
        if (spent > limit) {
            const percentage = Math.round(((spent - limit) / limit) * 100);
            insights.push({
                userId,
                type: 'overspending',
                title: 'Budget Exceeded',
                description: `You exceeded your ${budget.category} budget by ${percentage}%.`,
            });
        }
        else if (spent > limit * 0.9) {
            insights.push({
                userId,
                type: 'budget_warning',
                title: 'Approaching Budget Limit',
                description: `You have used ${Math.round((spent / limit) * 100)}% of your ${budget.category} budget.`,
            });
        }
    }
    return insights;
};
exports.analyzeBudget = analyzeBudget;
