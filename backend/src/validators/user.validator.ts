import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    theme: z.string().optional(),
    currency: z.string().optional(),
    notificationEmail: z.boolean().optional(),
    notificationPush: z.boolean().optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});