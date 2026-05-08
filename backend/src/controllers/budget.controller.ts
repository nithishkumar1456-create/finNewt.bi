import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as budgetService from '../services/budget.service';

export const createBudget = catchAsync(async (req: Request, res: Response) => {
  const budget = await budgetService.createBudget((req as any).user!.id, req.body);
  res.status(201).json({ success: true, data: { budget } });
});

export const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const budget = await budgetService.updateBudget((req as any).user!.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: { budget } });
});

export const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  await budgetService.deleteBudget((req as any).user!.id, req.params.id);
  res.status(200).json({ success: true, message: 'Budget deleted successfully' });
});

export const getBudgets = catchAsync(async (req: Request, res: Response) => {
  const budgets = await budgetService.getBudgets((req as any).user!.id);
  res.status(200).json({ success: true, data: { budgets } });
});