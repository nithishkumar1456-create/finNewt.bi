import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as goalService from '../services/goal.service';

export const createGoal = catchAsync(async (req: Request, res: Response) => {
  const goal = await goalService.createGoal((req as any).user!.id, req.body);
  res.status(201).json({ success: true, data: { goal } });
});

export const updateGoal = catchAsync(async (req: Request, res: Response) => {
  const goal = await goalService.updateGoal((req as any).user!.id, req.params.id, req.body);
  res.status(200).json({ success: true, data: { goal } });
});

export const addFunds = catchAsync(async (req: Request, res: Response) => {
  const goal = await goalService.addFunds((req as any).user!.id, req.params.id, req.body.amount);
  res.status(200).json({ success: true, data: { goal } });
});

export const deleteGoal = catchAsync(async (req: Request, res: Response) => {
  await goalService.deleteGoal((req as any).user!.id, req.params.id);
  res.status(200).json({ success: true, message: 'Goal deleted successfully' });
});

export const getGoals = catchAsync(async (req: Request, res: Response) => {
  const goals = await goalService.getGoals((req as any).user!.id);
  res.status(200).json({ success: true, data: { goals } });
});