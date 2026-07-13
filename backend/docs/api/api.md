# PowerWatch API Documentation

## Endpoints Overview

| Module | Endpoint | Method | Auth | Details |
|--------|----------|--------|------|---------|
| Auth | `/api/v1/auth/register` | POST | No | [View](authEndpoints.md#register) |
| Auth | `/api/v1/auth/login` | POST | No | [View](authEndpoints.md#login) |
| Auth | `/api/v1/auth/logout` | POST | No | [View](authEndpoints.md#logout) |
| Auth | `/api/v1/auth/refresh-token` | POST | No | [View](authEndpoints.md#refresh-token) |
| Auth | `/api/v1/auth/send-otp` | POST | No | [View](authEndpoints.md#send-otp) |
| Auth | `/api/v1/auth/resend-otp` | POST | No | [View](authEndpoints.md#resend-otp) |
| Auth | `/api/v1/auth/verify-otp` | POST | No | [View](authEndpoints.md#verify-otp) |
| Auth | `/api/v1/auth/forgot-password` | POST | No | [View](authEndpoints.md#forgot-password) |
| Auth | `/api/v1/auth/reset-password` | POST | No | [View](authEndpoints.md#reset-password) |
| Locations | `/api/v1/locations/reverse-geocode` | POST | No | [View](locationsEndpoints.md#reverse-geocode) |
| Locations | `/api/v1/locations/search` | GET | No | [View](locationsEndpoints.md#search) |
| Health | `/health` | GET | No | Returns server uptime and timestamp || Configuration | `N/A` | N/A | N/A | [View](configuration.md) |
---

## Where to Find Details

| File | Contents |
|------|----------|
| [authEndpoints.md](authEndpoints.md) | All auth endpoints (register, login, logout, refresh token, OTP flows, password reset) |
| [locationsEndpoints.md](locationsEndpoints.md) | Reverse geocode and location search endpoints |

---

## Health Check

**Method:** `GET`

**Endpoint:** `/health`

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy.",
  "data": {
    "uptime": 123.45,
    "timestamp": "2026-07-11T12:00:00.000Z"
  }
}
```
