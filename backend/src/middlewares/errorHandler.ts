import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';
import { ZodError } from 'zod';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  console.error(`[ERROR HANDLER] ${req.method} ${req.originalUrl}`);
  console.error(err);

  // Zod Validation Error
  if (err instanceof ZodError) {
    console.error(`[ZOD ERROR]`, JSON.stringify(err.errors, null, 2));
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    error = new AppError(message, 400);
  }

  // Prisma Errors
  if (err.code === 'P2002') {
    error = new AppError('Duplicate field value entered', 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again!', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired! Please log in again.', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { error: err.stack }),
  });
};