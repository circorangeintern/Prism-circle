import type { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/auth.controller.js';

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/register', {
    schema: {
      description:
        'Register a new user account. Provide either the full location hierarchy (stateId, lgaId, cityId, townId, neighborhoodId) OR GPS coordinates (latitude, longitude). The system auto-resolves coordinates to the full hierarchy via reverse geocoding.',
      tags: ['Auth'],
      summary: 'Register a new user',
      body: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
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
      },
    },
  }, authController.register);

  app.post('/login', {
    schema: {
      description: 'Authenticate a user with email and password.',
      tags: ['Auth'],
      summary: 'Login',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          password: { type: 'string', example: 'StrongPassword@123' },
        },
      },
      response: {
        200: {
          description: 'Login successful',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Login successful.' },
            data: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
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
      },
    },
  }, authController.login);

  app.post('/logout', {
    schema: {
      description: 'Logout a user by revoking the refresh token.',
      tags: ['Auth'],
      summary: 'Logout',
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        },
      },
      response: {
        200: {
          description: 'Logout successful',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Logout successful.' },
            data: { type: 'object', example: {} },
          },
        },
      },
    },
  }, authController.logout);

  app.post('/refresh-token', {
    schema: {
      description: 'Refresh access and refresh tokens using a valid refresh token.',
      tags: ['Auth'],
      summary: 'Refresh tokens',
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        },
      },
      response: {
        200: {
          description: 'Token refreshed successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Token refreshed successfully.' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
                refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
              },
            },
          },
        },
      },
    },
  }, authController.refreshToken);

  app.post('/send-otp', {
    schema: {
      description: 'Send a one-time verification code for email verification or password reset.',
      tags: ['Auth'],
      summary: 'Send OTP',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          type: { type: 'string', enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET'], example: 'EMAIL_VERIFICATION' },
        },
      },
      response: {
        200: {
          description: 'OTP sent successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'OTP sent successfully.' },
            data: { type: 'object', example: {} },
          },
        },
      },
    },
  }, authController.sendOtp);

  app.post('/resend-otp', {
    schema: {
      description: 'Resend a previously requested OTP code.',
      tags: ['Auth'],
      summary: 'Resend OTP',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          type: { type: 'string', enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET'], example: 'EMAIL_VERIFICATION' },
        },
      },
      response: {
        200: {
          description: 'OTP resent successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'OTP resent successfully.' },
            data: { type: 'object', example: {} },
          },
        },
      },
    },
  }, authController.resendOtp);

  app.post('/verify-otp', {
    schema: {
      description: 'Verify a one-time code for email verification or password reset.',
      tags: ['Auth'],
      summary: 'Verify OTP',
      body: {
        type: 'object',
        required: ['email', 'code'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          code: { type: 'string', example: '123456' },
          type: { type: 'string', enum: ['EMAIL_VERIFICATION', 'PASSWORD_RESET'], example: 'EMAIL_VERIFICATION' },
        },
      },
      response: {
        200: {
          description: 'OTP verified successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'OTP verified successfully.' },
            data: {
              type: 'object',
              properties: {
                verified: { type: 'boolean', example: true },
                type: { type: 'string', example: 'EMAIL_VERIFICATION' },
              },
            },
          },
        },
      },
    },
  }, authController.verifyOtp);

  app.post('/forgot-password', {
    schema: {
      description: 'Request a password reset OTP for an existing account.',
      tags: ['Auth'],
      summary: 'Forgot password',
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
        },
      },
      response: {
        200: {
          description: 'Password reset OTP sent',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Password reset OTP sent.' },
            data: { type: 'object', example: {} },
          },
        },
      },
    },
  }, authController.forgotPassword);

  app.post('/reset-password', {
    schema: {
      description: 'Reset a password using an OTP code.',
      tags: ['Auth'],
      summary: 'Reset password',
      body: {
        type: 'object',
        required: ['email', 'code', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'user@example.com' },
          code: { type: 'string', example: '123456' },
          password: { type: 'string', minLength: 8, example: 'NewStrongPassword@123' },
          confirmPassword: { type: 'string', example: 'NewStrongPassword@123' },
        },
      },
      response: {
        200: {
          description: 'Password reset successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Password reset successfully.' },
            data: { type: 'object', example: {} },
          },
        },
      },
    },
  }, authController.resetPassword);
};
