import type { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/auth.controller.js';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/register', {
    schema: {
      description: 'Register a new user account. Provide either the full location hierarchy (stateId, lgaId, cityId, townId, neighborhoodId) OR GPS coordinates (latitude, longitude). The system auto-resolves coordinates to the full hierarchy via reverse geocoding.',
      tags: ['Auth'],
      summary: 'Register a new user',
      body: {
        type: 'object',
        required: [
          'firstName',
          'lastName',
          'email',
          'password',
          'confirmPassword',
        ],
        oneOf: [
          { required: ['stateId', 'lgaId', 'cityId', 'townId', 'neighborhoodId'] },
          { required: ['latitude', 'longitude'] },
        ],
        properties: {
          firstName: { type: 'string', description: "User's first name", example: 'Oluwayemi' },
          lastName: { type: 'string', description: "User's last name", example: 'Oyinlola' },
          email: { type: 'string', format: 'email', description: 'Must be unique', example: 'user@example.com' },
          password: { type: 'string', minLength: 8, description: 'Strong password', example: 'StrongPassword@123' },
          confirmPassword: { type: 'string', description: 'Must match password', example: 'StrongPassword@123' },
          countryId: { type: 'integer', description: 'Existing country ID (optional, defaults to Nigeria)', example: 1 },
          stateId: { type: 'integer', description: 'Existing state ID', example: 25 },
          lgaId: { type: 'integer', description: 'Existing LGA ID', example: 210 },
          cityId: { type: 'integer', description: 'Existing city ID', example: 815 },
          townId: { type: 'integer', description: 'Existing town ID', example: 4200 },
          neighborhoodId: { type: 'integer', description: 'Existing neighborhood ID', example: 9012 },
          latitude: { type: 'number', description: 'GPS latitude', example: 6.524379 },
          longitude: { type: 'number', description: 'GPS longitude', example: 3.379206 },
          notificationEnabled: { type: 'boolean', description: 'Push notification preference', default: true },
          deviceName: { type: 'string', description: 'Device model', example: 'iPhone 15 Pro' },
          deviceType: { type: 'string', enum: ['ANDROID', 'IOS', 'WEB'], description: 'Device platform' },
        },
      },
      response: {
        201: {
          description: 'User registered successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'User registered successfully.' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' },
                    firstName: { type: 'string', example: 'Oluwayemi' },
                    lastName: { type: 'string', example: 'Oyinlola' },
                    email: { type: 'string', example: 'user@example.com' },
                    role: { type: 'string', example: 'USER' },
                    emailVerified: { type: 'boolean', example: false },
                  },
                },
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
              },
            },
          },
        },
        400: {
          description: 'Invalid request payload',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed.' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        409: {
          description: 'Email already exists',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Email already registered.' },
          },
        },
        422: {
          description: 'Validation failed or location not found',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Validation failed.' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Internal server error.' },
          },
        },
      },
    },
  }, authController.register);
};
