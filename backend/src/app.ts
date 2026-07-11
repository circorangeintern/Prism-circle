import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { env } from './configs/env.config.js';
import { swaggerOptions, swaggerUiOptions } from './configs/swagger.config.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { authRoutes } from './routes/auth.route.js';
import { locationRoutes } from './routes/location.route.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.nodeEnv === 'production' ? 'info' : 'debug',
      ...(env.nodeEnv !== 'production' && {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'HH:MM:ss Z' },
        },
      }),
    },
    ajv: {
      customOptions: {
        strict: false,
      },
    },
  });

  if (env.nodeEnv !== 'development') {
    await app.register(cors, {
      origin: env.cors.origin,
      credentials: true,
    });
  }

  await app.register(rateLimit, {
    max: env.rateLimit.max,
    timeWindow: env.rateLimit.windowMs,
    allowList: (request) => {
      if (request.url.startsWith('/docs')) return true;
      return false;
    },
    errorResponseBuilder: () => ({
      success: false,
      message: 'Too many requests. Please try again later.',
    }),
  });

  if (env.nodeEnv !== 'production') {
    await app.register(swagger, swaggerOptions);
    await app.register(swaggerUi, swaggerUiOptions);
  }

  app.setErrorHandler(errorHandler);

  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(locationRoutes, { prefix: '/api/v1/locations' });

  app.get('/health', async () => ({
    success: true,
    message: 'Server is healthy.',
    data: { uptime: process.uptime(), timestamp: new Date().toISOString() },
  }));

  return app;
}
