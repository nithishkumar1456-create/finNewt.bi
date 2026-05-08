"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
// Route imports
const routes_1 = __importDefault(require("./routes"));
// Middleware imports
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const prisma_1 = require("./database/prisma");
const redis_1 = __importDefault(require("./cache/redis"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: Array.from(new Set([env_1.env.CLIENT_URL, 'http://localhost:5173'])),
    credentials: true,
}));
// Logging
if (env_1.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Parsing Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Rate Limiting
app.use(rateLimiter_1.rateLimiter);
// Health Check
app.get('/api/health', async (req, res) => {
    try {
        await prisma_1.prisma.$queryRaw `SELECT 1`;
        await redis_1.default.ping();
        res.status(200).json({
            success: true,
            database: 'connected',
            redis: 'connected',
            server: 'running'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            database: 'error',
            redis: 'error',
            server: 'error'
        });
    }
});
// API Routes
app.use('/api', routes_1.default);
// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'API route not found',
    });
});
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
