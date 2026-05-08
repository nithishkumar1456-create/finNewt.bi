import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redactedBody = {
        ...req.body,
        ...(req.body?.password && { password: '[redacted]' }),
        ...(req.body?.newPassword && { newPassword: '[redacted]' }),
      };

      console.log(`[VALIDATE] Request ${req.method} ${req.originalUrl}`);
      console.log(`[VALIDATE] Body:`, JSON.stringify(redactedBody, null, 2));
      console.log(`[VALIDATE] Params:`, JSON.stringify(req.params, null, 2));
      console.log(`[VALIDATE] Query:`, JSON.stringify(req.query, null, 2));

      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      console.log(`[VALIDATE] Validation passed for ${req.method} ${req.originalUrl}`);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error(`[VALIDATE ERROR] ${req.method} ${req.originalUrl}:`, error.errors);
        const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        return next(new AppError(message, 400));
      }
      return next(error);
    }
  };
};
