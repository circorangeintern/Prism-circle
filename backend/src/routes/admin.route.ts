import type { FastifyPluginAsync } from 'fastify';
import { adminController } from '../controllers/admin.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

export const adminRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authMiddleware);

  app.get('/dashboard', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Get dashboard summary (users, reports, outages counts).',
      tags: ['Admin'],
      summary: 'Dashboard',
      response: {
        200: {
          description: 'Dashboard data',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                totalUsers: { type: 'integer' },
                newUsersToday: { type: 'integer' },
                totalReports: { type: 'integer' },
                reportsToday: { type: 'integer' },
                reportsThisWeek: { type: 'integer' },
                activeOutages: { type: 'integer' },
                totalOutages: { type: 'integer' },
                totalNeighborhoods: { type: 'integer' },
              },
            },
          },
        },
      },
    },
  }, adminController.getDashboard);

  app.get('/analytics', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Get analytics with optional date range.',
      tags: ['Admin'],
      summary: 'Analytics',
      querystring: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
        },
      },
    },
  }, adminController.getAnalytics);

  app.get('/users', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] List users with search and pagination.',
      tags: ['Admin'],
      summary: 'List users',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
          search: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] },
        },
      },
    },
  }, adminController.getUsers);

  app.get('/locations', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Get all location hierarchy data.',
      tags: ['Admin'],
      summary: 'List locations',
    },
  }, adminController.getLocations);

  app.patch('/locations', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Update a location name.',
      tags: ['Admin'],
      summary: 'Update location',
      body: {
        type: 'object',
        required: ['type', 'id', 'name'],
        properties: {
          type: { type: 'string', enum: ['state', 'lga', 'city', 'town', 'neighborhood'] },
          id: { type: 'integer' },
          name: { type: 'string' },
        },
      },
    },
  }, adminController.updateLocation);

  app.post('/broadcast', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Send a push notification broadcast to all users.',
      tags: ['Admin'],
      summary: 'Send broadcast',
      body: {
        type: 'object',
        required: ['title', 'body'],
        properties: {
          title: { type: 'string', maxLength: 200 },
          body: { type: 'string', maxLength: 1000 },
          topic: { type: 'string' },
        },
      },
    },
  }, adminController.sendBroadcast);

  app.post('/users/:userId/suspend', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Suspend a user (revoke tokens, disable notifications).',
      tags: ['Admin'],
      summary: 'Suspend user',
      params: {
        type: 'object', required: ['userId'],
        properties: { userId: { type: 'string', format: 'uuid' } },
      },
    },
  }, adminController.suspendUser);

  app.delete('/users/:userId', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Permanently delete a user.',
      tags: ['Admin'],
      summary: 'Delete user',
      params: {
        type: 'object', required: ['userId'],
        properties: { userId: { type: 'string', format: 'uuid' } },
      },
    },
  }, adminController.deleteUser);

  app.delete('/reports/:id', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Delete any report by ID.',
      tags: ['Admin'],
      summary: 'Delete report',
      params: {
        type: 'object', required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
    },
  }, adminController.deleteReport);

  // --- Materialization endpoints ---
  app.post('/materialize/daily', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Materialize daily report summaries for a given date (defaults to today).',
      tags: ['Admin'],
      summary: 'Materialize daily',
      querystring: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date', description: 'Date (YYYY-MM-DD). Defaults to today.' },
        },
      },
    },
  }, adminController.materializeDaily);

  app.post('/materialize/weekly', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Materialize weekly outage summaries for a given week (defaults to current week).',
      tags: ['Admin'],
      summary: 'Materialize weekly',
      querystring: {
        type: 'object',
        properties: {
          weekStart: { type: 'string', format: 'date', description: 'Monday of the week (YYYY-MM-DD).' },
        },
      },
    },
  }, adminController.materializeWeekly);

  app.post('/materialize/monthly', {
    preHandler: [adminMiddleware],
    schema: {
      description: '[ADMIN] Materialize monthly statistics for a given month (defaults to current month).',
      tags: ['Admin'],
      summary: 'Materialize monthly',
      querystring: {
        type: 'object',
        properties: {
          monthStart: { type: 'string', format: 'date', description: 'First of the month (YYYY-MM-DD).' },
        },
      },
    },
  }, adminController.materializeMonthly);
};
