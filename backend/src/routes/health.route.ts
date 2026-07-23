import type { FastifyPluginAsync } from 'fastify';
import { healthController } from '../controllers/health.controller.js';

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', {
    schema: {
      description: 'Full health check (server, database, Firebase).',
      tags: ['Health'],
      summary: 'Health check',
      response: {
        200: {
          description: 'All systems healthy',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                server: { type: 'object' },
                database: { type: 'object' },
                firebase: { type: 'object' },
              },
            },
          },
        },
      },
    },
  }, healthController.healthCheck);

  app.get('/database', {
    schema: {
      description: 'Database health check (connection latency).',
      tags: ['Health'],
      summary: 'Database health',
      response: {
        200: {
          description: 'Database health status',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, healthController.databaseHealth);

  app.get('/firebase', {
    schema: {
      description: 'Firebase health check (initialization status).',
      tags: ['Health'],
      summary: 'Firebase health',
      response: {
        200: {
          description: 'Database health status',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, healthController.firebaseHealth);
};
