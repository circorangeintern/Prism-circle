import type { FastifyPluginAsync } from 'fastify';
import { analyticsController } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const analyticsRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authMiddleware);

  app.get('/power', {
    schema: {
      description: 'Get power statistics (ON/OFF report counts, top neighborhoods).',
      tags: ['Analytics'],
      summary: 'Power statistics',
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
    },
  }, analyticsController.getPowerStatistics);

  app.get('/outages', {
    schema: {
      description: 'Get outage statistics (counts, average duration, top neighborhoods).',
      tags: ['Analytics'],
      summary: 'Outage statistics',
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
    },
  }, analyticsController.getOutageStatistics);

  app.get('/users', {
    schema: {
      description: 'Get user statistics (totals, verification rate, top reporters).',
      tags: ['Analytics'],
      summary: 'User statistics',
    },
  }, analyticsController.getUserStatistics);

  app.get('/locations', {
    schema: {
      description: 'Get location statistics (report/outage/user counts per neighborhood).',
      tags: ['Analytics'],
      summary: 'Location statistics',
    },
  }, analyticsController.getLocationStatistics);
};
