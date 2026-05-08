import { prisma } from '../database/prisma';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError';

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { settings: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // exclude password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateProfile = async (userId: string, data: any) => {
  const { fullName, theme, currency, notificationEmail, notificationPush } = data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(fullName && { fullName }),
      settings: {
        update: {
          ...(theme && { theme }),
          ...(currency && { currency }),
          ...(notificationEmail !== undefined && { notificationEmail }),
          ...(notificationPush !== undefined && { notificationPush }),
        },
      },
    },
    include: { settings: true },
  });

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const changePassword = async (userId: string, data: any) => {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('User not found', 404);

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect', 400);
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};