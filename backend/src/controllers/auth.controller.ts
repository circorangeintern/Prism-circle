import type { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterCommand } from '../services/auth/commands/register.command.js';
import { LoginCommand } from '../services/auth/commands/login.command.js';
import { LogoutCommand } from '../services/auth/commands/logout.command.js';
import { RefreshTokenCommand } from '../services/auth/commands/refreshToken.command.js';
import { SendOtpCommand } from '../services/auth/commands/sendOtp.command.js';
import { VerifyOtpCommand } from '../services/auth/commands/verifyOtp.command.js';
import { ForgotPasswordCommand } from '../services/auth/commands/forgotPassword.command.js';
import { ResetPasswordCommand } from '../services/auth/commands/resetPassword.command.js';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  sendOtpSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';
import { successResponse } from '../utils/response.js';
import { MESSAGES } from '../constants/message.constant.js';

const registerCommand = new RegisterCommand();
const loginCommand = new LoginCommand();
const logoutCommand = new LogoutCommand();
const refreshTokenCommand = new RefreshTokenCommand();
const sendOtpCommand = new SendOtpCommand();
const verifyOtpCommand = new VerifyOtpCommand();
const forgotPasswordCommand = new ForgotPasswordCommand();
const resetPasswordCommand = new ResetPasswordCommand();

export const authController = {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const dto = registerSchema.parse(request.body);
    const result = await registerCommand.execute(dto);
    return reply.status(201).send(successResponse(result, MESSAGES.REGISTER_SUCCESS));
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    const dto = loginSchema.parse(request.body);
    const result = await loginCommand.execute(dto);
    return reply.status(200).send(successResponse(result, MESSAGES.LOGIN_SUCCESS));
  },

  async logout(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = refreshTokenSchema.parse(request.body);
    await logoutCommand.execute(refreshToken);
    return reply.status(200).send(successResponse({}, MESSAGES.LOGOUT_SUCCESS));
  },

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const { refreshToken } = refreshTokenSchema.parse(request.body);
    const result = await refreshTokenCommand.execute(refreshToken);
    return reply.status(200).send(successResponse(result, MESSAGES.TOKEN_REFRESHED));
  },

  async sendOtp(request: FastifyRequest, reply: FastifyReply) {
    const { email, type } = sendOtpSchema.parse(request.body);
    await sendOtpCommand.execute(email, type || 'EMAIL_VERIFICATION');
    return reply.status(200).send(successResponse({}, 'OTP sent successfully.'));
  },

  async resendOtp(request: FastifyRequest, reply: FastifyReply) {
    const { email, type } = sendOtpSchema.parse(request.body);
    await sendOtpCommand.execute(email, type || 'EMAIL_VERIFICATION');
    return reply.status(200).send(successResponse({}, 'OTP resent successfully.'));
  },

  async verifyOtp(request: FastifyRequest, reply: FastifyReply) {
    const { email, code, type } = verifyOtpSchema.parse(request.body);
    const result = await verifyOtpCommand.execute(email, code, type || 'EMAIL_VERIFICATION');
    return reply.status(200).send(successResponse(result, 'OTP verified successfully.'));
  },

  async forgotPassword(request: FastifyRequest, reply: FastifyReply) {
    const { email } = forgotPasswordSchema.parse(request.body);
    await forgotPasswordCommand.execute(email);
    return reply.status(200).send(successResponse({}, 'Password reset OTP sent.'));
  },

  async resetPassword(request: FastifyRequest, reply: FastifyReply) {
    const { email, code, password } = resetPasswordSchema.parse(request.body);
    await resetPasswordCommand.execute(email, code, password);
    return reply.status(200).send(successResponse({}, 'Password reset successfully.'));
  },
};
