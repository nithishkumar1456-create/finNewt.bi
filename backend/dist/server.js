"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const prisma_1 = require("./database/prisma");
const redis_1 = __importDefault(require("./cache/redis"));
const jobs_1 = require("./jobs");
const PORT = env_1.env.PORT || 5000;
const startServer = async () => {
    try {
        // Check Database connection
        await prisma_1.prisma.$connect();
        console.log('Connected to Database successfully');
        // Check Redis connection
        await redis_1.default.ping();
        // Initialize Cron Jobs
        (0, jobs_1.initCronJobs)();
        const server = app_1.default.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} in ${env_1.env.NODE_ENV} mode`);
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (err) => {
            console.log(`Error: ${err.message}`);
            // Close server & exit process
            server.close(() => process.exit(1));
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
