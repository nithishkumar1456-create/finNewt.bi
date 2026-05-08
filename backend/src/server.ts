import app from './app';
import { env } from './config/env';
import { prisma } from './database/prisma';
import redis from './cache/redis';
import { initCronJobs } from './jobs';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    // Check Database connection
    await prisma.$connect();
    console.log('Connected to Database successfully');

    // Check Redis connection
    await redis.ping();

    // Initialize Cron Jobs
    initCronJobs();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: any) => {
      console.log(`Error: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();