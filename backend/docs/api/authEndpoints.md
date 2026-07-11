# Authentication Endpoints

---

## Register

Creates a new user account. Provide either the full location hierarchy (stateId, lgaId, cityId, townId, neighborhoodId) or GPS coordinates (latitude, longitude). The system auto-resolves coordinates via reverse geocoding.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/register`

**Authentication:** Not required (Public endpoint)

---

### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |
| Accept | application/json | Yes |

---

### Parameters

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| firstName | String | Yes | User's first name (1-50 characters) |
| lastName | String | Yes | User's last name (1-50 characters) |
| email | String | Yes | Must be a valid email and unique in the system |
| password | String | Yes | Strong password (min 8 chars, uppercase, lowercase, number, special char) |
| confirmPassword | String | Yes | Must match password |
| countryId | Integer | No | Existing country ID (optional, defaults to Nigeria) |
| stateId | Integer | Yes* | Existing state ID (must exist in database) |
| lgaId | Integer | Yes* | Existing LGA ID (must belong to the given state) |
| cityId | Integer | Yes* | Existing city ID (must belong to the given LGA) |
| townId | Integer | Yes* | Existing town ID (must belong to the given city) |
| neighborhoodId | Integer | Yes* | Existing neighborhood ID (must belong to the given town) |
| latitude | Number | Yes* | GPS latitude (-90 to 90) |
| longitude | Number | Yes* | GPS longitude (-180 to 180) |
| notificationEnabled | Boolean | No | Push notification preference (defaults to true) |
| deviceName | String | No | Device model name (max 100 characters) |
| deviceType | Enum | No | Device platform: `ANDROID`, `IOS`, or `WEB` |

> *Required if providing location hierarchy OR coordinates. Provide either the full hierarchy (stateId through neighborhoodId) or GPS coordinates (latitude, longitude), not both.

---

### Request Examples

**Option 1: Full location hierarchy**
```json
{
  "firstName": "Oluwayemi",
  "lastName": "Oyinlola",
  "email": "user@example.com",
  "password": "StrongPassword@123",
  "confirmPassword": "StrongPassword@123",
  "countryId": 1,
  "stateId": 25,
  "lgaId": 210,
  "cityId": 815,
  "townId": 4200,
  "neighborhoodId": 9012,
  "notificationEnabled": true,
  "deviceName": "iPhone 15 Pro",
  "deviceType": "IOS"
}
```

**Option 2: GPS coordinates (auto-resolved)**
```json
{
  "firstName": "Oluwayemi",
  "lastName": "Oyinlola",
  "email": "user@example.com",
  "password": "StrongPassword@123",
  "confirmPassword": "StrongPassword@123",
  "latitude": 6.524379,
  "longitude": 3.379206,
  "notificationEnabled": true,
  "deviceName": "iPhone 15 Pro",
  "deviceType": "IOS"
}
```

---

### Success Response

**Status Code:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Oluwayemi",
      "lastName": "Oyinlola",
      "email": "user@example.com",
      "role": "USER",
      "emailVerified": false
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Validation Rules

| Field | Rules |
|-------|-------|
| firstName | Required, 1-50 characters, trimmed |
| lastName | Required, 1-50 characters, trimmed |
| email | Required, valid email format, max 255 chars, normalized to lowercase |
| password | Required, 8-128 chars, must contain uppercase, lowercase, number, and special character |
| confirmPassword | Required, must match password |
| countryId | Optional, must be a positive integer referencing an existing country (defaults to Nigeria) |
| stateId | Required* if providing hierarchy, must be a positive integer referencing an existing state |
| lgaId | Required* if providing hierarchy, must be a positive integer referencing an LGA under the given state |
| cityId | Required* if providing hierarchy, must be a positive integer referencing a city under the given LGA |
| townId | Required* if providing hierarchy, must be a positive integer referencing a town under the given city |
| neighborhoodId | Required* if providing hierarchy, must be a positive integer referencing a neighborhood under the given town |
| latitude | Required* if providing coordinates, must be between -90 and 90 |
| longitude | Required* if providing coordinates, must be between -180 and 180 |
| deviceName | Optional, max 100 characters |
| deviceType | Optional, must be one of: ANDROID, IOS, WEB |

> *Must provide exactly one group: hierarchy (stateId through neighborhoodId) or coordinates (latitude, longitude).

---

### Possible Errors

| Status Code | Description | Example Response |
|-------------|-------------|-----------------|
| 400 | Validation failed, invalid request payload, or missing location/coordinates | `{ "success": false, "message": "Validation failed.", "errors": [{ "field": "stateId", "message": "Provide either the full location hierarchy (stateId, lgaId, cityId, townId, neighborhoodId) or GPS coordinates (latitude, longitude)." }] }` |
| 409 | Email already registered | `{ "success": false, "message": "Email already registered." }` |
| 422 | Location hierarchy validation failed | `{ "success": false, "message": "State not found.", "errors": [{ "field": "stateId", "message": "State with ID 999 not found." }] }` |
| 429 | Rate limit exceeded | `{ "success": false, "message": "Too many requests. Please try again later." }` |
| 500 | Internal server error | `{ "success": false, "message": "Internal server error." }` |

---

### Security Measures

| Requirement | Value |
|-------------|-------|
| Authentication | No |
| JWT Required | No |
| Role Required | None |
| Rate Limited | Yes (5 requests per minute per IP) |
| HTTPS Required | Yes (Production) |
| Password Hashing | bcrypt (12 salt rounds) |
| Email Normalization | Trimmed and lowercased before uniqueness check |
| Location Mode | Either full hierarchy (stateId, lgaId, cityId, townId, neighborhoodId) or GPS coordinates. Coordinates auto-resolved via reverse geocoding. |
| Location Hierarchy | Validated: Country -> State -> LGA -> City -> Town -> Neighborhood |
| GPS Validation | Latitude: -90 to 90, Longitude: -180 to 180 |
| Transactional | User, refresh token, and device created in a single database transaction |

---

### Notes

- The `role` field from client requests is ignored; all new users are assigned the `USER` role.
- User IDs are generated as UUIDs (v4).
- Password hashes are never exposed in API responses.
- The access token expires in 15 minutes.
- The refresh token expires in 30 days.
- Device information is stored when `deviceName` or `deviceType` is provided.

---

## Login (Coming Soon)

**Method:** `POST` **Endpoint:** `/api/v1/auth/login`

## Logout (Coming Soon)

**Method:** `POST` **Endpoint:** `/api/v1/auth/logout`

## Refresh Token (Coming Soon)

**Method:** `POST` **Endpoint:** `/api/v1/auth/refresh`

## Forgot Password (Coming Soon)

**Method:** `POST` **Endpoint:** `/api/v1/auth/forgot-password`

## Reset Password (Coming Soon)

**Method:** `POST` **Endpoint:** `/api/v1/auth/reset-password`

## Verify Email (Coming Soon)

**Method:** `POST` **Endpoint:** `/api/v1/auth/verify-email`

## Change Password (Coming Soon)

**Method:** `PUT` **Endpoint:** `/api/v1/auth/change-password`
