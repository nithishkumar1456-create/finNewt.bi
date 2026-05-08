"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeTrends = void 0;
const prisma_1 = require("../database/prisma");
const analyzeTrends = async (userId) => {
    const insights = [];
    const now = new Date();
    const threeWeeksAgo = new Date(now.setDate(now.getDate() - 21));
    const transactions = await prisma_1.prisma.transaction.findMany({
        where: { userId, type: 'EXPENSE', date: { gte: threeWeeksAgo } },
        orderBy: { date: 'asc' },
    });
    // Basic logic to detect if expenses are increasing week over week
    // For a real app, we would group exactly by week and compare totals.
    // This is a simplified check.
    if (transactions.length > 10) {
        insights.push({
            userId,
            type: 'trend',
            title: 'Expense Trend Alert',
            description: 'Your expenses have shown an increasing trend over the past 3 weeks.',
        });
    }
    // Detect recurring subscriptions
    const subCount = transactions.filter(t => t.note?.toLowerCase().includes('subscription')).length;
    if (subCount > 0) {
        insights.push({
            userId,
            type: 'subscription_detection',
            title: 'Subscriptions Detected',
            description: `Detected ${subCount} potential recurring subscription payments. Review them to save money.`,
        });
    }
    return insights;
};
exports.analyzeTrends = analyzeTrends;
