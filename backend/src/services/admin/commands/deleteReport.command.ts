import { prisma } from '../../../configs/database.config.js';
import { AppError } from '../../../errors/index.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export class DeleteReportCommand {
  async execute(reportId: string) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) {
      throw new AppError(404, MESSAGES.NOT_FOUND);
    }

    await prisma.$transaction(async (tx) => {
      await tx.outageReport.deleteMany({ where: { reportId } });
      await tx.report.delete({ where: { id: reportId } });
    });
  }
}
