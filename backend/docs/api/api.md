# PowerWatch API Documentation

## Endpoints Overview

| Module | Endpoint | Method | Auth | Details |
|--------|----------|--------|------|---------|
| Auth | `/api/v1/auth/register` | POST | No | [View](authEndpoints.md#register) |
| Locations | `/api/v1/locations/reverse-geocode` | POST | No | [View](locationsEndpoints.md#reverse-geocode) |
| Health | `/health` | GET | No | Returns server uptime and timestamp |

---

## Where to Find Details

| File | Contents |
|------|----------|
| [authEndpoints.md](authEndpoints.md) | All auth endpoints (register, login, logout, refresh token, etc.) |
| locationsEndpoints.md | All location endpoints |

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
