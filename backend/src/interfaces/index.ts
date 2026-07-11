import type { RegisterInput } from '../validators/auth.validator.js';

export type RegisterDto = RegisterInput;

export interface RegisterResult {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  emailVerified: boolean;
  notificationEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReverseGeocodeResult {
  countryId: number;
  stateId: number;
  lgaId: number;
  cityId: number;
  townId: number;
  neighborhoodId: number;
  distanceKm: number;
}
