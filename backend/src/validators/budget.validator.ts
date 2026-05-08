import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    category: z.string().min(1),
    limit: z.number().positive(),
    period: z.enum(['monthly', 'weekly', 'yearly']).optional(),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  }),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    limit: z.number().positive().optional(),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }).optional(),
  }),
});