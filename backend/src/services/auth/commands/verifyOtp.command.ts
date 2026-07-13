import { AppError } from '../../../errors/index.js';
import { OtpRepository } from '../../../repositories/otp.repository.js';
import { UserRepository } from '../../../repositories/user.repository.js';
import { MESSAGES } from '../../../constants/message.constant.js';

export type OtpType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';

export class VerifyOtpCommand {
  constructor(
    private readonly otpRepository: OtpRepository = new OtpRepository(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  async execute(email: string, code: string, type: OtpType = 'EMAIL_VERIFICATION') {
    const normalizedEmail = email.toLowerCase().trim();
    const otp = await this.otpRepository.findValidOtp(normalizedEmail, code, type);
    if (!otp) {
      throw new AppError(400, MESSAGES.INVALID_OTP);
    }

    await this.otpRepository.markUsed(otp.id);

    if (type === 'EMAIL_VERIFICATION') {
      await this.userRepository.markEmailVerified(normalizedEmail);
    }

    return {
      verified: true,
      type,
    };
  }
}
