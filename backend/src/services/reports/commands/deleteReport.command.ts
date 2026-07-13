import { prisma } from '../../../configs/database.config.js';
import { ReportRepository } from '../../../repositories/report.repository.js';
import { AppError } from '../../../errors/index.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export class DeleteReportCommand {
  constructor(
    private readonly reportRepository: ReportRepository = new ReportRepository(),
  ) {}

  async execute(id: string): Promise<void> {
    const report = await this.reportRepository.findById(id);
    if (!report) {
      throw new AppError(404, MESSAGES.NOT_FOUND);
    }

    await prisma.$transaction(async (tx) => {
      await tx.outageReport.deleteMany({ where: { reportId: id } });
      await tx.report.delete({ where: { id } });
    });
  }
}
