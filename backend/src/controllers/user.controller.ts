import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as userService from '../services/user.service';

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getProfile((req as any).user!.id);
  res.status(200).json({ success: true, data: { user } });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateProfile((req as any).user!.id, req.body);
  res.status(200).json({ success: true, message: 'Profile updated successfully', data: { user } });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  await userService.changePassword((req as any).user!.id, req.body);
  res.status(200).json({ success: true, message: 'Password changed successfully' });
});