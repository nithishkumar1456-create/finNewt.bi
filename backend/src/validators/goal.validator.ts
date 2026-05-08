import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    targetAmount: z.number().positive(),
    currentAmount: z.number().nonnegative().optional(),
    deadline: z.string().nullable().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    category: z.string().optional(),
    icon: z.string().optional(),
  }),
});

export const updateGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().nonnegative().optional(),
    deadline: z.string().nullable().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    category: z.string().optional(),
    icon: z.string().optional(),
    status: z.enum(['active', 'completed', 'cancelled']).optional(),
  }),
});

export const addFundsSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
  }),
});