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
  country: string;
  stateId: number;
  state: string;
  lgaId: number;
  lga: string;
  cityId: number;
  city: string;
  townId: number;
  town: string;
  neighborhoodId: number;
  neighborhood: string;
  distanceKm: number;
  suburb: string | null;
  village: string | null;
  road: string | null;
}
