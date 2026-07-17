import { prisma } from '../configs/database.config.js';
import type { Prisma } from '@prisma/client';

export class NotificationRepository {
  async create(data: Prisma.NotificationLogUncheckedCreateInput) {
    return prisma.notificationLog.create({ data });
  }

  async findById(id: string) {
    return prisma.notificationLog.findUnique({ where: { id } });
  }

  async findMany(params: {
    where?: Prisma.NotificationLogWhereInput;
    orderBy?: Prisma.NotificationLogOrderByWithRelationInput;
    skip?: number;
    take?: number;
  }) {
    const { orderBy, skip, take } = params;
    return prisma.notificationLog.findMany({
      ...(params.where ? { where: params.where } : {}),
      orderBy: orderBy ?? { createdAt: 'desc' },
      ...(skip ? { skip } : {}),
      ...(take ? { take } : {}),
    });
  }

  async count(where?: Prisma.NotificationLogWhereInput) {
    return prisma.notificationLog.count({
      ...(where ? { where } : {}),
    });
  }

  async update(id: string, data: Prisma.NotificationLogUncheckedUpdateInput) {
    return prisma.notificationLog.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.notificationLog.delete({ where: { id } });
  }
}
