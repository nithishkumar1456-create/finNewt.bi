import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { verifyToken } from '../utils/jwt';
import { env } from '../config/env';
import { prisma } from '../database/prisma';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  console.log('[AUTH MIDDLEWARE] Protect invoked', {
    method: req.method,
    path: req.originalUrl,
    hasBearerToken: Boolean(req.headers.authorization?.startsWith('Bearer')),
    hasCookieToken: Boolean(req.cookies?.accessToken),
  });

  if (!token) {
    console.error('[AUTH MIDDLEWARE] No access token found');
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = verifyToken(token, env.JWT_SECRET);
  console.log('[AUTH MIDDLEWARE] JWT verified', { userId: decoded.id, jti: decoded.jti });

  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  console.log('[AUTH MIDDLEWARE] Prisma user lookup result', {
    found: Boolean(currentUser),
    userId: currentUser?.id,
  });

  if (!currentUser) {
    console.error('[AUTH MIDDLEWARE] Token user no longer exists', { userId: decoded.id });
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // Add user to request
  (req as any).user = currentUser;
  next();
});
