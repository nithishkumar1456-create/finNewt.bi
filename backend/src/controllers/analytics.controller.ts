import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as analyticsService from '../services/analytics.service';
import { generateSmartInsights, calculateHealthScore } from '../insights';

export const getSummary = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const summary = await analyticsService.getSummary((req as any).user!.id, startDate as string, endDate as string);
  res.status(200).json({ success: true, data: { summary } });
});

export const getTrends = catchAsync(async (req: Request, res: Response) => {
  const type = req.query.type as 'weekly' | 'monthly' || 'monthly';
  const trends = await analyticsService.getTrends((req as any).user!.id, type);
  res.status(200).json({ success: true, data: { trends } });
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const categories = await analyticsService.getCategories((req as any).user!.id, startDate as string, endDate as string);
  res.status(200).json({ success: true, data: { categories } });
});

export const getInsights = catchAsync(async (req: Request, res: Response) => {
  const insights = await generateSmartInsights((req as any).user!.id);
  res.status(200).json({ success: true, data: { insights } });
});

export const getHealthScore = catchAsync(async (req: Request, res: Response) => {
  const result = await calculateHealthScore((req as any).user!.id);
  res.status(200).json({ success: true, data: result });
});
