import crypto from 'node:crypto';
import { AppError } from '../../../errors/index.js';
import { AuthRepository } from '../../../repositories/auth.repository.js';
import { UserRepository } from '../../../repositories/user.repository.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken, getRefreshTokenExpiryDate } from '../../../configs/jwt.config.js';
import { env } from '../../../configs/env.config.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export class RefreshTokenCommand {
  constructor(
    private readonly authRepository: AuthRepository = new AuthRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async execute(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const storedToken = await this.authRepository.findRefreshTokenById(payload.tokenId);
    if (!storedToken || storedToken.userId !== payload.userId || storedToken.expiresAt <= new Date()) {
      throw new AppError(401, MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError(401, MESSAGES.INVALID_REFRESH_TOKEN);
    }

    await this.authRepository.deleteRefreshTokenById(storedToken.id);

    const newTokenId = crypto.randomUUID();
    const refreshTokenRaw = crypto.randomUUID();
    const refreshTokenExpiresAt = getRefreshTokenExpiryDate();

    await this.authRepository.createRefreshToken({
      id: newTokenId,
      token: refreshTokenRaw,
      userId: user.id,
      expiresAt: refreshTokenExpiresAt,
    });

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshTokenJwt = signRefreshToken({ userId: user.id, tokenId: newTokenId });

    return {
      accessToken,
      refreshToken: refreshTokenJwt,
    };
  }
}
