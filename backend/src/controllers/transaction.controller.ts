import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as transactionService from '../services/transaction.service';

export const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const transaction = await transactionService.createTransaction((req as any).user!.id, req.body);
  res.status(201).json({ success: true, data: { transaction } });
});

export const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const transaction = await transactionService.updateTransaction((req as any).user!.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: { transaction } });
});

export const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  await transactionService.deleteTransaction((req as any).user!.id, req.params.id);
  res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
});

export const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await transactionService.getTransactions((req as any).user!.id, req.query);
  res.status(200).json({ success: true, data: result });
});