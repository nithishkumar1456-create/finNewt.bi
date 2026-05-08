"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const redis_1 = __importDefault(require("../cache/redis"));
const AppError_1 = require("../utils/AppError");
const rateLimiterInstance = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redis_1.default,
    keyPrefix: 'middleware',
    points: 100, // 100 requests
    duration: 60, // per 60 seconds by IP
});
const rateLimiter = (req, res, next) => {
    rateLimiterInstance
        .consume(req.ip || 'unknown')
        .then(() => {
        next();
    })
        .catch(() => {
        next(new AppError_1.AppError('Too many requests from this IP, please try again in a minute', 429));
    });
};
exports.rateLimiter = rateLimiter;
