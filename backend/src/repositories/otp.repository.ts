import { prisma } from '../configs/database.config.js';

export class OtpRepository {
  async create(data: {
    email: string;
    code: string;
    type: string;
    expiresAt: Date;
  }) {
    return prisma.otp.create({ data });
  }

  async findValidOtp(email: string, code: string, type: string) {
    return prisma.otp.findFirst({
      where: {
        email,
        code,
        type,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async markUsed(id: string) {
    return prisma.otp.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async invalidatePreviousOtps(email: string, type: string) {
    return prisma.otp.updateMany({
      where: { email, type, usedAt: null },
      data: { usedAt: new Date() },
    });
  }
}
