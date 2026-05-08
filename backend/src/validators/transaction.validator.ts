import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive'),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
    category: z.string().min(1, 'Category is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    note: z.string().optional(),
    paymentMethod: z.string().optional(),
    recurring: z.boolean().optional(),
    recurringType: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
    category: z.string().min(1).optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }).optional(),
    note: z.string().optional(),
    paymentMethod: z.string().optional(),
    recurring: z.boolean().optional(),
    recurringType: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const queryTransactionSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']).optional(),
    category: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    range: z.string().optional(), // Adding range support
    search: z.string().optional(),
    sortBy: z.enum(['date', 'amount', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});