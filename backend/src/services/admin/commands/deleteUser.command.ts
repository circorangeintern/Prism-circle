import { prisma } from '../../../configs/database.config.js';
import { AppError } from '../../../errors/index.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export class DeleteUserCommand {
  async execute(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new AppError(404, MESSAGES.NOT_FOUND);
    }

    await prisma.user.delete({ where: { id: userId } });
  }
}
