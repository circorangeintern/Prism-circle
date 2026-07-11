import type { FastifyRequest, FastifyReply } from 'fastify';
import { reverseGeocodeSchema } from '../validators/location.validator.js';
import { ReverseGeocodeQuery } from '../services/locations/queries/reverseGeocode.query.js';
import { successResponse } from '../utils/response.js';

const reverseGeocodeQuery = new ReverseGeocodeQuery();

export const locationController = {
  async reverseGeocode(request: FastifyRequest, reply: FastifyReply) {
    const { latitude, longitude } = reverseGeocodeSchema.parse(request.body);
    const result = await reverseGeocodeQuery.execute(latitude, longitude);
    return reply.status(200).send(successResponse(result, 'Location resolved successfully.'));
  },
};
