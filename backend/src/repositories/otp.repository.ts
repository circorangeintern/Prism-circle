import { prisma } from '../configs/database.config.js';

export class OtpRepository {
  async create(data: {
    email: string;
    code: string;
    type: string;
    expiresAt: Date;
  }) {
    return prisma.otp.create({
      data: {
        email: data.email,
        code: data.code,
        type: data.type as 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
        expiresAt: data.expiresAt,
      },
    });
  }

  async findValidOtp(email: string, code: string, type: string) {
    return prisma.otp.findFirst({
      where: {
        email,
        code,
        type: type as 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
        usedAt: null,
        expiresAt: { gt: new Date() },
        attempts: { lt: 5 },
      },
    });
  }

  async markUsed(id: string) {
    return prisma.otp.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }

  async incrementAttempts(id: string) {
    return prisma.otp.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
  }

  async invalidatePreviousOtps(email: string, type: string) {
    return prisma.otp.updateMany({
      where: {
        email,
        type: type as 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
        usedAt: null,
      },
      data: { usedAt: new Date() },
    });
  }
}
