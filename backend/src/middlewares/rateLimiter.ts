import { RateLimiterRedis } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import redisClient from '../cache/redis';
import { AppError } from '../utils/AppError';

const rateLimiterInstance = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware',
  points: 100, // 100 requests
  duration: 60, // per 60 seconds by IP
});

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  rateLimiterInstance
    .consume(req.ip || 'unknown')
    .then(() => {
      next();
    })
    .catch(() => {
      next(new AppError('Too many requests from this IP, please try again in a minute', 429));
    });
};