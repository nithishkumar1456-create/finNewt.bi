"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBudgetSchema = exports.createBudgetSchema = void 0;
const zod_1 = require("zod");
exports.createBudgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        category: zod_1.z.string().min(1),
        limit: zod_1.z.number().positive(),
        period: zod_1.z.enum(['monthly', 'weekly', 'yearly']).optional(),
        startDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
        endDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
    }),
});
exports.updateBudgetSchema = zod_1.z.object({
    body: zod_1.z.object({
        limit: zod_1.z.number().positive().optional(),
        endDate: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }).optional(),
    }),
});
