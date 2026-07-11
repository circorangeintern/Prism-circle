export const MESSAGES = {
  // Auth
  REGISTER_SUCCESS: 'User registered successfully.',
  EMAIL_EXISTS: 'Email already registered.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  TOKEN_REFRESHED: 'Token refreshed successfully.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'Unauthorized access.',
  FORBIDDEN: 'Forbidden access.',

  // Validation
  VALIDATION_FAILED: 'Validation failed.',
  INVALID_REQUEST: 'Invalid request.',

  // Location
  COUNTRY_NOT_FOUND: 'Country not found.',
  STATE_NOT_FOUND: 'State not found.',
  LGA_NOT_FOUND: 'LGA not found for the given state.',
  CITY_NOT_FOUND: 'City not found for the given LGA.',
  TOWN_NOT_FOUND: 'Town not found for the given city.',
  NEIGHBORHOOD_NOT_FOUND: 'Neighborhood not found for the given town.',
  INVALID_LOCATION_HIERARCHY: 'Invalid location hierarchy.',

  // General
  INTERNAL_ERROR: 'Internal server error.',
  NOT_FOUND: 'Resource not found.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
} as const;
