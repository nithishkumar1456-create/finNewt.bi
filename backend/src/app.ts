import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';

// Route imports
import routes from './routes';

// Middleware imports
import { errorHandler } from './middlewares/errorHandler';
import { rateLimiter } from './middlewares/rateLimiter';
import { prisma } from './database/prisma';
import redis from './cache/redis';

const app: Express = express();
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'https://nithishkumar1456-create.github.io',
  'https://nithishkumar1456-create.github.io/finnewt-bi',
];

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: Array.from(new Set(allowedOrigins)),
    credentials: true,
  })
);

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting
app.use(rateLimiter);

// Health Check
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    res.status(200).json({
      success: true,
      database: 'connected',
      redis: 'connected',
      server: 'running'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      database: 'error',
      redis: 'error',
      server: 'error'
    });
  }
});

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
