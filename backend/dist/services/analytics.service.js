"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.getTrends = exports.getSummary = void 0;
const prisma_1 = require("../database/prisma");
const getSummary = async (userId, startDate, endDate) => {
    const dateFilter = {};
    if (startDate)
        dateFilter.gte = new Date(startDate);
    if (endDate)
        dateFilter.lte = new Date(endDate);
    const transactions = await prisma_1.prisma.transaction.findMany({
        where: {
            userId,
            ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
        }
    });
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
        const amount = typeof t.amount === 'object' ? t.amount.toNumber() : Number(t.amount);
        if (t.type === 'INCOME')
            totalIncome += amount;
        if (t.type === 'EXPENSE')
            totalExpense += amount;
    });
    const savings = totalIncome - totalExpense;
    const spendingRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
    return {
        totalIncome,
        totalExpense,
        savings,
        spendingRatio,
    };
};
exports.getSummary = getSummary;
const getTrends = async (userId, type) => {
    const transactions = await prisma_1.prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'asc' },
    });
    const groupedData = {};
    transactions.forEach(t => {
        const d = new Date(t.date);
        if (isNaN(d.getTime()))
            return;
        const key = type === 'monthly'
            ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            : `${d.getFullYear()}-W${String(getWeekNumber(d)).padStart(2, '0')}`;
        if (!groupedData[key]) {
            groupedData[key] = { income: 0, expense: 0 };
        }
        const amount = typeof t.amount === 'object' ? t.amount.toNumber() : Number(t.amount);
        if (t.type === 'INCOME')
            groupedData[key].income += amount;
        if (t.type === 'EXPENSE')
            groupedData[key].expense += amount;
    });
    // Sort by key to ensure chronological order in charts
    const sortedData = {};
    Object.keys(groupedData).sort().forEach(key => {
        sortedData[key] = groupedData[key];
    });
    return sortedData;
};
exports.getTrends = getTrends;
const getCategories = async (userId, startDate, endDate) => {
    const dateFilter = {};
    if (startDate) {
        const start = new Date(startDate);
        if (!Number.isNaN(start.getTime()))
            dateFilter.gte = start;
    }
    if (endDate) {
        const end = new Date(endDate);
        if (!Number.isNaN(end.getTime()))
            dateFilter.lte = end;
    }
    const transactions = await prisma_1.prisma.transaction.findMany({
        where: {
            userId,
            type: 'EXPENSE',
            ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
    });
    const groupedData = {};
    transactions.forEach((transaction) => {
        const category = transaction.category || 'Uncategorized';
        const amount = typeof transaction.amount === 'object'
            ? transaction.amount.toNumber()
            : Number(transaction.amount);
        groupedData[category] = (groupedData[category] || 0) + (Number.isFinite(amount) ? amount : 0);
    });
    return Object.entries(groupedData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
};
exports.getCategories = getCategories;
// Helper for week number
function getWeekNumber(d) {
    const dCopy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = dCopy.getUTCDay() || 7;
    dCopy.setUTCDate(dCopy.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(dCopy.getUTCFullYear(), 0, 1));
    return Math.ceil((((dCopy.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
