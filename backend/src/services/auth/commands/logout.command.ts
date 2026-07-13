import { AuthRepository } from '../../../repositories/auth.repository.js';

export class LogoutCommand {
  constructor(
    private readonly authRepository: AuthRepository = new AuthRepository(),
  ) {}

  async execute(refreshToken: string): Promise<void> {
    try {
      await this.authRepository.deleteRefreshToken(refreshToken);
    } catch {
      // Token already deleted or not found — still a successful logout
    }
  }
}
