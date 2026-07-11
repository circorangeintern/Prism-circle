import type { FastifyPluginAsync } from 'fastify';
import { locationController } from '../controllers/location.controller.js';

export const locationRoutes: FastifyPluginAsync = async (app) => {
  app.post('/reverse-geocode', {
    schema: {
      description: 'Resolve GPS coordinates to the nearest country, state, LGA, city, town, and neighborhood. Uses the nigeria-lga-data package with built-in proximity search.',
      tags: ['Locations'],
      summary: 'Reverse geocode coordinates',
      body: {
        type: 'object',
        required: ['latitude', 'longitude'],
        properties: {
          latitude: { type: 'number', description: 'GPS latitude', example: 6.524379 },
          longitude: { type: 'number', description: 'GPS longitude', example: 3.379206 },
        },
      },
      response: {
        200: {
          description: 'Location resolved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Location resolved successfully.' },
            data: {
              type: 'object',
              properties: {
                countryId: { type: 'integer', example: 1 },
                country: { type: 'string', example: 'Nigeria' },
                stateId: { type: 'integer', example: 25 },
                state: { type: 'string', example: 'Ondo' },
                lgaId: { type: 'integer', example: 210 },
                lga: { type: 'string', example: 'Okitipupa' },
                cityId: { type: 'integer', example: 815 },
                city: { type: 'string', example: 'Okitipupa' },
                townId: { type: 'integer', example: 4200 },
                town: { type: 'string', example: 'Ipogun' },
                neighborhoodId: { type: 'integer', example: 9012 },
                neighborhood: { type: 'string', example: 'Central' },
                distanceKm: { type: 'number', example: 0 },
              },
            },
          },
        },
        400: {
          description: 'Invalid coordinates',
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
        404: {
          description: 'No location found for coordinates',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'No location found for the given coordinates.' },
          },
        },
      },
    },
  }, locationController.reverseGeocode);
};
