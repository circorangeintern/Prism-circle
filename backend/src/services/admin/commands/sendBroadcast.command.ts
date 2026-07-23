import { prisma } from '../../../configs/database.config.js';
import { SendFirebaseNotificationCommand } from '../../firebase/commands/sendNotification.command.js';
import { NotificationRepository } from '../../../repositories/notification.repository.js';

export class SendBroadcastCommand {
  constructor(
    private readonly firebaseSender: SendFirebaseNotificationCommand = new SendFirebaseNotificationCommand(),
    private readonly notificationRepository: NotificationRepository = new NotificationRepository(),
  ) {}

  async execute(params: { title: string; body: string; topic?: string }) {
    const topic = params.topic || 'all_users';

    const devices = await prisma.device.findMany({
      where: { fcmToken: { not: null } },
      select: { userId: true, fcmToken: true },
    });

    const tokens = devices
      .map((d) => d.fcmToken)
      .filter((t): t is string => t !== null);

    let firebaseResult = { successCount: 0, failureCount: 0 };

    if (tokens.length > 0) {
      firebaseResult = await this.firebaseSender.sendMulticast({
        tokens,
        title: params.title,
        body: params.body,
        data: { broadcast: 'true' },
      });
    }

    const uniqueUserIds = [...new Set(devices.map((d) => d.userId))];
    const notificationLogs = uniqueUserIds.map((userId) => ({
      userId,
      title: params.title,
      body: params.body,
      sent: true,
      delivered: false,
      opened: false,
      clicked: false,
      sentAt: new Date(),
    }));

    for (const log of notificationLogs) {
      await this.notificationRepository.create(log);
    }

    return {
      totalUsers: uniqueUserIds.length,
      devicesFound: tokens.length,
      pushSuccess: firebaseResult.successCount,
      pushFailed: firebaseResult.failureCount,
      topic,
    };
  }
}
