import type { FastifyPluginAsync } from 'fastify';
import { reportController } from '../controllers/report.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

export const reportRoutes: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', authMiddleware);

  app.post('/', {
    schema: {
      description: 'Submit a power report (ON or OFF) for a neighborhood.',
      tags: ['Reports'],
      summary: 'Create a power report',
      body: {
        type: 'object',
        required: ['neighborhoodId', 'reportType'],
        properties: {
          neighborhoodId: { type: 'integer', description: 'Neighborhood ID', example: 9012 },
          reportType: { type: 'string', enum: ['ON', 'OFF'], description: 'Power status' },
          latitude: { type: 'number', description: 'GPS latitude', example: 6.524379 },
          longitude: { type: 'number', description: 'GPS longitude', example: 3.379206 },
          deviceType: { type: 'string', enum: ['ANDROID', 'IOS', 'WEB'], description: 'Device platform' },
          timestamp: { type: 'string', format: 'date-time', description: 'ISO timestamp (defaults to now)' },
        },
      },
      response: {
        201: {
          description: 'Report created successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Power report submitted successfully.' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                userId: { type: 'string', format: 'uuid' },
                neighborhoodId: { type: 'integer' },
                reportType: { type: 'string', enum: ['ON', 'OFF'] },
                timestamp: { type: 'string', format: 'date-time' },
                latitude: { type: 'number', nullable: true },
                longitude: { type: 'number', nullable: true },
                deviceType: { type: 'string', nullable: true },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  }, reportController.createReport);

  app.post('/power-off', {
    schema: {
      description: 'Convenience endpoint to report a power outage (reportType=OFF).',
      tags: ['Reports'],
      summary: 'Report power off',
      body: {
        type: 'object',
        required: ['neighborhoodId'],
        properties: {
          neighborhoodId: { type: 'integer', example: 9012 },
          latitude: { type: 'number', example: 6.524379 },
          longitude: { type: 'number', example: 3.379206 },
          deviceType: { type: 'string', enum: ['ANDROID', 'IOS', 'WEB'] },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      response: {
        201: {
          description: 'Power off reported',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Power outage started.' },
          },
        },
      },
    },
  }, reportController.reportPowerOff);

  app.post('/power-on', {
    schema: {
      description: 'Convenience endpoint to report power restored (reportType=ON).',
      tags: ['Reports'],
      summary: 'Report power on',
      body: {
        type: 'object',
        required: ['neighborhoodId'],
        properties: {
          neighborhoodId: { type: 'integer', example: 9012 },
          latitude: { type: 'number', example: 6.524379 },
          longitude: { type: 'number', example: 3.379206 },
          deviceType: { type: 'string', enum: ['ANDROID', 'IOS', 'WEB'] },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      response: {
        201: {
          description: 'Power on reported',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Power outage ended.' },
          },
        },
      },
    },
  }, reportController.reportPowerOn);

  app.get('/', {
    schema: {
      description: 'List power reports with optional filters and pagination.',
      tags: ['Reports'],
      summary: 'List reports',
      querystring: {
        type: 'object',
        properties: {
          neighborhoodId: { type: 'integer', description: 'Filter by neighborhood' },
          userId: { type: 'string', format: 'uuid', description: 'Filter by user' },
          reportType: { type: 'string', enum: ['ON', 'OFF'] },
          startDate: { type: 'string', format: 'date-time', description: 'Filter from date' },
          endDate: { type: 'string', format: 'date-time', description: 'Filter to date' },
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
        },
      },
      response: {
        200: {
          description: 'Reports list with pagination',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                data: { type: 'array', items: { type: 'object' } },
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total: { type: 'integer' },
                    totalPages: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, reportController.getReports);

  app.get('/my', {
    schema: {
      description: 'Get the authenticated user\'s reports.',
      tags: ['Reports'],
      summary: 'My reports',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
        },
      },
      response: {
        200: {
          description: 'User reports list with pagination',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                data: { type: 'array', items: { type: 'object' } },
                pagination: { type: 'object' },
              },
            },
          },
        },
      },
    },
  }, reportController.getUserReports);

  app.get('/location', {
    schema: {
      description: 'Get reports by neighborhood ID.',
      tags: ['Reports'],
      summary: 'Reports by location',
      querystring: {
        type: 'object',
        required: ['neighborhoodId'],
        properties: {
          neighborhoodId: { type: 'integer' },
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
        },
      },
      response: {
        200: {
          description: 'User reports list with pagination',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                data: { type: 'array', items: { type: 'object' } },
                pagination: { type: 'object' },
              },
            },
          },
        },
      },
    },
  }, reportController.getReportsByLocation);

  app.get('/status', {
    schema: {
      description: 'Get live power status for a neighborhood (latest report, confidence score, report count).',
      tags: ['Reports'],
      summary: 'Live status',
      querystring: {
        type: 'object',
        required: ['neighborhoodId'],
        properties: {
          neighborhoodId: { type: 'integer', example: 9012 },
        },
      },
      response: {
        200: {
          description: 'Live power status',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, reportController.getLatestStatus);

  app.get('/outages', {
    schema: {
      description: 'List outages with optional filters.',
      tags: ['Reports'],
      summary: 'List outages',
      querystring: {
        type: 'object',
        properties: {
          neighborhoodId: { type: 'integer' },
          activeOnly: { type: 'boolean', default: false },
          page: { type: 'integer', default: 1 },
          limit: { type: 'integer', default: 20 },
        },
      },
      response: {
        200: {
          description: 'List with pagination',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                data: { type: 'array', items: { type: 'object' } },
                pagination: { type: 'object' },
              },
            },
          },
        },
      },
    },
  }, reportController.getOutages);

  app.get('/outages/:id', {
    schema: {
      description: 'Get a single outage by ID with associated reports.',
      tags: ['Reports'],
      summary: 'Get outage',
      params: {
        type: 'object', required: ['id'],
        properties: { id: { type: 'string', format: 'uuid' } },
      },
      response: {
        200: {
          description: 'Outage details',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, reportController.getOutage);

  app.get('/:id', {
    schema: {
      description: 'Get a single power report by ID.',
      tags: ['Reports'],
      summary: 'Get report by ID',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: {
          description: 'Outage details',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
  }, reportController.getReport);

  app.delete('/:id', {
    schema: {
      description: 'Delete a power report by ID.',
      tags: ['Reports'],
      summary: 'Delete report',
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
      },
      response: {
        200: {
          description: 'Report deleted',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Power report deleted successfully.' },
          },
        },
      },
    },
  }, reportController.deleteReport);
};
