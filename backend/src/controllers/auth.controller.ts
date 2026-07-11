import type { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterCommand } from '../services/auth/commands/register.command.js';
import { registerSchema } from '../validators/auth.validator.js';
import { successResponse } from '../utils/response.js';
import { MESSAGES } from '../constants/message.constant.js';

const registerCommand = new RegisterCommand();

export const authController = {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const dto = registerSchema.parse(request.body);
    const result = await registerCommand.execute(dto);
    return reply.status(201).send(successResponse(result, MESSAGES.REGISTER_SUCCESS));
  },
};
