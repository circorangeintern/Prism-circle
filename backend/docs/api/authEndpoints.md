# Authentication Endpoints

---

## Register

Creates a new user account. Provide either the full location hierarchy (`stateId`, `lgaId`, `cityId`, `townId`, `neighborhoodId`) or GPS coordinates (`latitude`, `longitude`). The system auto-resolves coordinates via reverse geocoding.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/register`

**Authentication:** No

---

### Headers

| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |
| Accept | application/json | Yes |

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| firstName | String | Yes | User's first name (1-50 chars) |
| lastName | String | Yes | User's last name (1-50 chars) |
| email | String | Yes | Unique, valid email |
| password | String | Yes | Strong password (min 8 chars, uppercase, lowercase, number, special char) |
| confirmPassword | String | No | Must match `password` if present |
| countryId | Integer | No | Existing country ID (optional, defaults to Nigeria) |
| stateId | Integer | Conditional | Required with hierarchy mode |
| lgaId | Integer | Conditional | Required with hierarchy mode |
| cityId | Integer | Conditional | Required with hierarchy mode |
| townId | Integer | Conditional | Required with hierarchy mode |
| neighborhoodId | Integer | Conditional | Required with hierarchy mode |
| latitude | Number | Conditional | Required with coordinate mode |
| longitude | Number | Conditional | Required with coordinate mode |
| notificationEnabled | Boolean | No | Push notification preference (defaults to true) |
| deviceName | String | No | Device model name (max 100 chars) |
| deviceType | Enum | No | Device platform: `ANDROID`, `IOS`, `WEB` |

> Provide either the full location hierarchy or GPS coordinates, not both.

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
| firstName | Required, 1-50 chars |
| lastName | Required, 1-50 chars |
| email | Required, valid email, lowercased |
| password | Required, 8-128 chars, uppercase, lowercase, number, special char |
| confirmPassword | Optional, must match `password` if present |
| countryId | Optional, positive integer |
| stateId | Required with hierarchy mode |
| lgaId | Required with hierarchy mode |
| cityId | Required with hierarchy mode |
| townId | Required with hierarchy mode |
| neighborhoodId | Required with hierarchy mode |
| latitude | Required with coordinate mode |
| longitude | Required with coordinate mode |
| deviceName | Optional, max 100 chars |
| deviceType | Optional, one of `ANDROID`, `IOS`, `WEB` |

---

### Possible Errors

| Status Code | Description |
|-------------|-------------|
| 400 | Validation failed or invalid request payload |
| 409 | Email already registered |
| 422 | Invalid location hierarchy or missing coordinates |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## Login

Authenticate a user and return access and refresh tokens.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/login`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User email |
| password | String | Yes | User password |

---

### Request Example

```json
{
  "email": "user@example.com",
  "password": "StrongPassword@123"
}
```

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful.",
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

## Logout

Invalidate a refresh token.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/logout`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| refreshToken | String | Yes | Refresh token to revoke |

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Logout successful.",
  "data": {}
}
```

---

## Refresh Token

Refresh access and refresh tokens using a valid refresh token.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/refresh-token`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| refreshToken | String | Yes | Valid refresh token |

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Token refreshed successfully.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## Send OTP

Send a one-time code for email verification or password reset.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/send-otp`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User email |
| type | Enum | No | `EMAIL_VERIFICATION` or `PASSWORD_RESET` |

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "OTP sent successfully.",
  "data": {}
}
```

---

## Resend OTP

Resend a previously requested OTP code.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/resend-otp`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User email |
| type | Enum | No | `EMAIL_VERIFICATION` or `PASSWORD_RESET` |

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "OTP resent successfully.",
  "data": {}
}
```

---

## Verify OTP

Verify a one-time code for email verification or password reset.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/verify-otp`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User email |
| code | String | Yes | 6-digit OTP code |
| type | Enum | No | `EMAIL_VERIFICATION` or `PASSWORD_RESET` |

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "OTP verified successfully.",
  "data": {
    "verified": true,
    "type": "EMAIL_VERIFICATION"
  }
}
```

---

## Forgot Password

Request a password reset OTP.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/forgot-password`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User email |

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset OTP sent.",
  "data": {}
}
```

---

## Reset Password

Reset a user password using a password reset OTP.

**Method:** `POST`

**Endpoint:** `/api/v1/auth/reset-password`

**Authentication:** No

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| email | String | Yes | User email |
| code | String | Yes | 6-digit password reset OTP code |
| password | String | Yes | New password |
| confirmPassword | String | No | Must match `password` if present |

---

### How it works

1. Request a password reset OTP using `/api/v1/auth/forgot-password`.
2. The system generates a 6-digit OTP, stores it, and sends it by email if SMTP is configured.
3. Use `/api/v1/auth/reset-password` with the email, OTP code, and new password.
4. If the OTP is valid and not expired, the password is updated and the OTP is invalidated.

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset successfully.",
  "data": {}
}
```

---

## OTP Delivery and Validation

PowerWatch supports OTPs for two use cases:

- `EMAIL_VERIFICATION`: Verify a newly registered user email.
- `PASSWORD_RESET`: Verify ownership of an email address before password reset.

### OTP Behavior

- OTPs are 6-digit numeric strings.
- OTPs expire after `OTP_EXPIRY_MINUTES` (default 10 minutes).
- Previous unused OTPs of the same type are invalidated when a new OTP is generated.
- Once a code is used, it is marked as used and cannot be reused.

### Email Delivery

- If SMTP is configured, OTP codes are sent via email using the `MailService`.
- If SMTP is not configured, OTP codes are logged to the console in non-production environments.
- Configure SMTP in `.env` using `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`, and `SMTP_FROM_NAME`.

### Common OTP Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Invalid or expired OTP |
| 404 | User not found | 
| 500 | Internal server error |
