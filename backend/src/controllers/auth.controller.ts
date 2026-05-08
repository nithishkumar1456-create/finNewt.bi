import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import * as authService from '../services/auth.service';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  console.log('[AUTH CONTROLLER] Setting auth cookies', {
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    hasAccessToken: Boolean(accessToken),
    hasRefreshToken: Boolean(refreshToken),
  });
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax', // Relaxed in development for local testing
    maxAge: 15 * 60 * 1000, // 15 mins
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearCookies = (res: Response) => {
  const isProd = process.env.NODE_ENV === 'production';
  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' as const : 'lax' as const,
  };

  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, message: result.message });
});

export const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  console.log('[AUTH CONTROLLER] Verify OTP request received', { email, otpLength: otp?.length });
  const { user, accessToken, refreshToken } = await authService.verifyOtp(email, otp);
  
  setCookies(res, accessToken, refreshToken);
  console.log('[AUTH CONTROLLER] Verify OTP response ready', { userId: user.id, hasAccessToken: Boolean(accessToken) });
  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
    accessToken,
    user,
    data: { user },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  console.log('[AUTH CONTROLLER] Login request received', {
    email: req.body.email,
    hasPassword: Boolean(req.body.password),
    passwordLength: req.body.password?.length,
  });
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  
  console.log('[AUTH CONTROLLER] Login successful. Setting cookies and returning token contract', {
    userId: user.id,
    hasAccessToken: Boolean(accessToken),
  });
  setCookies(res, accessToken, refreshToken);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    accessToken,
    user,
    data: { user },
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  const user = (req as any).user;
  console.log('[AUTH CONTROLLER] Logout request received', {
    userId: user?.id,
    hasRefreshToken: Boolean(refreshToken),
  });
  if (user && refreshToken) {
    await authService.logout(user.id, refreshToken);
  }
  
  clearCookies(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  console.log('[AUTH CONTROLLER] Refresh request received', { hasRefreshToken: Boolean(refreshToken) });
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token found' });
  }

  const { user, accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
  setCookies(res, accessToken, newRefreshToken);
  
  console.log('[AUTH CONTROLLER] Refresh response ready', { userId: user.id, hasAccessToken: Boolean(accessToken) });
  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    accessToken,
    user,
    data: { user },
  });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body.email);
  res.status(200).json({ success: true, message: 'Reset link sent to your email' });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  await authService.resetPassword(token, newPassword);
  res.status(200).json({ success: true, message: 'Password reset successful' });
});
