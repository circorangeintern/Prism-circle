import { NotificationRepository } from '../../../repositories/notification.repository.js';
import { AppError } from '../../../errors/index.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export class MarkAsReadCommand {
  constructor(
    private readonly notificationRepository: NotificationRepository = new NotificationRepository(),
  ) {}

  async execute(id: string, updates: { opened?: boolean; clicked?: boolean }) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new AppError(404, MESSAGES.NOT_FOUND);
    }

    const data: Record<string, unknown> = {};
    if (updates.opened) {
      data.opened = true;
      data.openedAt = new Date();
    }
    if (updates.clicked) {
      data.clicked = true;
      data.clickedAt = new Date();
    }

    return this.notificationRepository.update(id, data);
  }
}
