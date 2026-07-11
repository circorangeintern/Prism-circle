import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/index.js';
import { errorResponse } from '../utils/response.js';
import { MESSAGES } from '../constants/message.constant.js';

export function errorHandler(
  error: FastifyError | AppError | ZodError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    const errors = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return reply.status(400).send(errorResponse(MESSAGES.VALIDATION_FAILED, errors));
  }

  if (error instanceof AppError) {
    return reply
      .status(error.statusCode)
      .send(errorResponse(error.message, error.errors));
  }

  if ('statusCode' in error && typeof error.statusCode === 'number') {
    const fastifyError = error as FastifyError;
    return reply
      .status(fastifyError.statusCode ?? 500)
      .send(errorResponse(fastifyError.message));
  }

  console.error('Unhandled error:', error);
  return reply.status(500).send(errorResponse(MESSAGES.INTERNAL_ERROR));
}
