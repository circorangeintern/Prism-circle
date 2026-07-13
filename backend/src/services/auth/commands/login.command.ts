import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { UserRepository } from '../../../repositories/user.repository.js';
import { AuthRepository } from '../../../repositories/auth.repository.js';
import { AppError } from '../../../errors/index.js';
import { MESSAGES } from '../../../constants/message.constant.js';
import { signAccessToken, signRefreshToken, getRefreshTokenExpiryDate } from '../../../configs/jwt.config.js';

interface LoginDto {
  email: string;
  password: string;
}

interface LoginResult {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export class LoginCommand {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly authRepository: AuthRepository = new AuthRepository(),
  ) {}

  async execute(dto: LoginDto): Promise<LoginResult> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new AppError(401, MESSAGES.INVALID_CREDENTIALS);
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, MESSAGES.INVALID_CREDENTIALS);
    }

    const tokenId = crypto.randomUUID();
    const refreshTokenRaw = crypto.randomUUID();

    await this.authRepository.createRefreshToken({
      id: tokenId,
      token: refreshTokenRaw,
      userId: user.id,
      expiresAt: getRefreshTokenExpiryDate(),
    });

    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshTokenJwt = signRefreshToken({ userId: user.id, tokenId });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken: refreshTokenJwt,
    };
  }
}
