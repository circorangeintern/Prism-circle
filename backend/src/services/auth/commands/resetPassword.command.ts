import bcrypt from 'bcryptjs';
import { AppError } from '../../../errors/index.js';
import { UserRepository } from '../../../repositories/user.repository.js';
import { OtpRepository } from '../../../repositories/otp.repository.js';
import { env } from '../../../configs/env.config.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export class ResetPasswordCommand {
  constructor(
    private readonly userRepository: UserRepository = new UserRepository(),
    private readonly otpRepository: OtpRepository = new OtpRepository(),
  ) {}

  async execute(email: string, code: string, password: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const otp = await this.otpRepository.findValidOtp(normalizedEmail, code, 'PASSWORD_RESET');
    if (!otp) {
      throw new AppError(400, MESSAGES.INVALID_OTP);
    }

    const passwordHash = await bcrypt.hash(password, env.bcrypt.saltRounds);
    await this.userRepository.updatePassword(normalizedEmail, passwordHash);
    await this.otpRepository.markUsed(otp.id);
  }
}
