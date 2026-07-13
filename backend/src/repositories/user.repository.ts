import { prisma } from '../configs/database.config.js';
import type { Prisma } from '@prisma/client';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        passwordHash: true,
        role: true,
        emailVerified: true,
        notificationEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        emailVerified: true,
        notificationEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  }

  async updatePassword(email: string, passwordHash: string) {
    return prisma.user.update({
      where: { email },
      data: { passwordHash },
    });
  }

  async markEmailVerified(email: string) {
    return prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }
}
