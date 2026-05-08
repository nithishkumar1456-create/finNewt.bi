"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = void 0;
const prisma_1 = require("../database/prisma");
const AppError_1 = require("../utils/AppError");
const createTransaction = async (userId, data) => {
    return await prisma_1.prisma.transaction.create({
        data: {
            ...data,
            userId,
        },
    });
};
exports.createTransaction = createTransaction;
const updateTransaction = async (userId, transactionId, data) => {
    const transaction = await prisma_1.prisma.transaction.findFirst({
        where: { id: transactionId, userId },
    });
    if (!transaction) {
        throw new AppError_1.AppError('Transaction not found', 404);
    }
    // Sanitize data
    const { amount, type, category, date, note, paymentMethod, recurring, recurringType, tags } = data;
    const updateData = {};
    if (amount !== undefined)
        updateData.amount = amount;
    if (type !== undefined)
        updateData.type = type;
    if (category !== undefined)
        updateData.category = category;
    if (date !== undefined)
        updateData.date = new Date(date);
    if (note !== undefined)
        updateData.note = note;
    if (paymentMethod !== undefined)
        updateData.paymentMethod = paymentMethod;
    if (recurring !== undefined)
        updateData.recurring = recurring;
    if (recurringType !== undefined)
        updateData.recurringType = recurringType;
    if (tags !== undefined)
        updateData.tags = tags;
    return await prisma_1.prisma.transaction.update({
        where: { id: transactionId },
        data: updateData,
    });
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (userId, transactionId) => {
    const transaction = await prisma_1.prisma.transaction.findFirst({
        where: { id: transactionId, userId },
    });
    if (!transaction) {
        throw new AppError_1.AppError('Transaction not found', 404);
    }
    await prisma_1.prisma.transaction.delete({
        where: { id: transactionId },
    });
};
exports.deleteTransaction = deleteTransaction;
const getTransactions = async (userId, query) => {
    const { page = '1', limit = '10', type, category, startDate, endDate, range, search, sortBy = 'date', sortOrder = 'desc' } = query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    let calculatedStartDate = startDate ? new Date(startDate) : undefined;
    let calculatedEndDate = endDate ? new Date(endDate) : undefined;
    if (range) {
        const now = new Date();
        calculatedEndDate = new Date();
        if (range === '7d') {
            calculatedStartDate = new Date(now.setDate(now.getDate() - 7));
        }
        else if (range === '30d') {
            calculatedStartDate = new Date(now.setDate(now.getDate() - 30));
        }
        else if (range === '90d') {
            calculatedStartDate = new Date(now.setDate(now.getDate() - 90));
        }
    }
    const where = {
        userId,
        ...(type && { type }),
        ...(category && { category }),
        ...((calculatedStartDate || calculatedEndDate) && {
            date: {
                ...(calculatedStartDate && { gte: calculatedStartDate }),
                ...(calculatedEndDate && { lte: calculatedEndDate }),
            },
        }),
        ...(search && {
            OR: [
                { note: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
                { paymentMethod: { contains: search, mode: 'insensitive' } },
            ],
        }),
    };
    const [transactions, total] = await Promise.all([
        prisma_1.prisma.transaction.findMany({
            where,
            skip,
            take: limitNumber,
            orderBy: { [sortBy]: sortOrder },
        }),
        prisma_1.prisma.transaction.count({ where }),
    ]);
    return {
        transactions,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};
exports.getTransactions = getTransactions;
