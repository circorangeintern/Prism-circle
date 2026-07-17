import type { FastifyPluginAsync } from 'fastify';
import { historyController } from '../controllers/history.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const historyRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authMiddleware);

  app.get('/weekly', {
    schema: {
      description: 'Get weekly power report history for a month.',
      tags: ['History'],
      summary: 'Weekly history',
      querystring: {
        type: 'object',
        properties: {
          neighborhoodId: { type: 'integer' },
          year: { type: 'integer' },
          month: { type: 'integer' },
        },
      },
    },
  }, historyController.getWeeklyHistory);

  app.get('/monthly', {
    schema: {
      description: 'Get monthly power report history for a year.',
      tags: ['History'],
      summary: 'Monthly history',
      querystring: {
        type: 'object',
        properties: {
          neighborhoodId: { type: 'integer' },
          year: { type: 'integer' },
        },
      },
    },
  }, historyController.getMonthlyHistory);

  app.get('/outage-hours', {
    schema: {
      description: 'Get total outage hours breakdown by neighborhood.',
      tags: ['History'],
      summary: 'Outage hours',
      querystring: {
        type: 'object',
        properties: {
          neighborhoodId: { type: 'integer' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
    },
  }, historyController.getOutageHours);

  app.get('/power-timeline', {
    schema: {
      description: 'Get power timeline (ON/OFF counts by hour or day) for a date range.',
      tags: ['History'],
      summary: 'Power timeline',
      querystring: {
        type: 'object',
        required: ['neighborhoodId', 'startDate', 'endDate'],
        properties: {
          neighborhoodId: { type: 'integer' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          interval: { type: 'string', enum: ['hour', 'day'], default: 'day' },
        },
      },
    },
  }, historyController.getPowerTimeline);
};
