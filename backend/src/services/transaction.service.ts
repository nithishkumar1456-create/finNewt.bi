import { prisma } from '../database/prisma';
import { AppError } from '../utils/AppError';
import { Prisma } from '@prisma/client';

export const createTransaction = async (userId: string, data: any) => {
  return await prisma.transaction.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateTransaction = async (userId: string, transactionId: string, data: any) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  // Sanitize data
  const { amount, type, category, date, note, paymentMethod, recurring, recurringType, tags } = data;
  const updateData: any = {};
  if (amount !== undefined) updateData.amount = amount;
  if (type !== undefined) updateData.type = type;
  if (category !== undefined) updateData.category = category;
  if (date !== undefined) updateData.date = new Date(date);
  if (note !== undefined) updateData.note = note;
  if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
  if (recurring !== undefined) updateData.recurring = recurring;
  if (recurringType !== undefined) updateData.recurringType = recurringType;
  if (tags !== undefined) updateData.tags = tags;

  return await prisma.transaction.update({
    where: { id: transactionId },
    data: updateData,
  });
};

export const deleteTransaction = async (userId: string, transactionId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!transaction) {
    throw new AppError('Transaction not found', 404);
  }

  await prisma.transaction.delete({
    where: { id: transactionId },
  });
};

export const getTransactions = async (userId: string, query: any) => {
  const { 
    page = '1', 
    limit = '10', 
    type, 
    category, 
    startDate, 
    endDate, 
    range,
    search, 
    sortBy = 'date', 
    sortOrder = 'desc' 
  } = query;

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
    } else if (range === '30d') {
      calculatedStartDate = new Date(now.setDate(now.getDate() - 30));
    } else if (range === '90d') {
      calculatedStartDate = new Date(now.setDate(now.getDate() - 90));
    }
  }

  const where: Prisma.TransactionWhereInput = {
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
    prisma.transaction.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.transaction.count({ where }),
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