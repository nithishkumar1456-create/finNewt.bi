"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('5000'),
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: zod_1.z.string().url(),
    REDIS_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(10),
    JWT_REFRESH_SECRET: zod_1.z.string().min(10),
    SMTP_HOST: zod_1.z.string(),
    SMTP_PORT: zod_1.z.string().transform(Number),
    SMTP_USER: zod_1.z.string(),
    SMTP_PASS: zod_1.z.string(),
    CLIENT_URL: zod_1.z.string().url(),
});
const parseResult = envSchema.safeParse(process.env);
if (!parseResult.success) {
    console.error('Invalid environment variables:', parseResult.error.format());
    process.exit(1);
}
exports.env = parseResult.data;
