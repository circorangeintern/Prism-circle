import { AuthRepository } from '../../../repositories/auth.repository.js';
import { AuditRepository } from '../../../repositories/audit.repository.js';

export class LogoutCommand {
  constructor(
    private readonly authRepository: AuthRepository = new AuthRepository(),
    private readonly auditRepository: AuditRepository = new AuditRepository(),
  ) {}

  async execute(
    refreshToken: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    const stored = await this.authRepository.findRefreshToken(refreshToken);
    if (stored) {
      await this.authRepository.deleteRefreshToken(refreshToken);
    }

    if (userId) {
      await this.auditRepository.create({
        userId,
        action: 'LOGOUT',
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
      });
    }
  }
}
