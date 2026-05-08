"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFundsSchema = exports.updateGoalSchema = exports.createGoalSchema = void 0;
const zod_1 = require("zod");
exports.createGoalSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1),
        targetAmount: zod_1.z.number().positive(),
        currentAmount: zod_1.z.number().nonnegative().optional(),
        deadline: zod_1.z.string().nullable().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
        category: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
    }),
});
exports.updateGoalSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1).optional(),
        targetAmount: zod_1.z.number().positive().optional(),
        currentAmount: zod_1.z.number().nonnegative().optional(),
        deadline: zod_1.z.string().nullable().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
        category: zod_1.z.string().optional(),
        icon: zod_1.z.string().optional(),
        status: zod_1.z.enum(['active', 'completed', 'cancelled']).optional(),
    }),
});
exports.addFundsSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive(),
    }),
});
