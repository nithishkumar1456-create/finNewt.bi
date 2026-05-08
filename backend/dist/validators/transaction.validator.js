"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryTransactionSchema = exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive('Amount must be positive'),
        type: zod_1.z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
        category: zod_1.z.string().min(1, 'Category is required'),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }),
        note: zod_1.z.string().optional(),
        paymentMethod: zod_1.z.string().optional(),
        recurring: zod_1.z.boolean().optional(),
        recurringType: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.updateTransactionSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive().optional(),
        type: zod_1.z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
        category: zod_1.z.string().min(1).optional(),
        date: zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format",
        }).optional(),
        note: zod_1.z.string().optional(),
        paymentMethod: zod_1.z.string().optional(),
        recurring: zod_1.z.boolean().optional(),
        recurringType: zod_1.z.string().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.queryTransactionSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional(),
        limit: zod_1.z.string().optional(),
        type: zod_1.z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
        category: zod_1.z.string().optional(),
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        range: zod_1.z.string().optional(), // Adding range support
        search: zod_1.z.string().optional(),
        sortBy: zod_1.z.enum(['date', 'amount', 'createdAt']).optional(),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    }),
});
