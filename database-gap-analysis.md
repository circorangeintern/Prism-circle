# Database Schema & API Gap Analysis

> **Date:** 2026-07-13 (Updated)
> **Project:** Power Watch
> **Schema:** `backend/prisma/schema.prisma`

---

## Data Analyst Requirements — Implementation Status

### Legend
- ✅ **Stored in DB** — Model exists with all required fields
- ✅ **API Exposed** — CRUD/query endpoints available
- ❌ **Missing** — Not implemented

---

### One Tap Reporting — ✅ 7/7 Implemented

| Required Field | DB Column | Table | API Endpoint |
|---|---|---|---|
| Report ID | `id` | `reports` | All report endpoints |
| User ID | `user_id` (FK → `users.id`) | `reports` | Auto-set from auth token |
| Neighborhood ID | `neighborhood_id` (FK → `neighborhoods.id`) | `reports` | `POST /api/v1/reports` |
| Report type (ON/OFF) | `report_type` (enum `ON`, `OFF`) | `reports` | `POST /api/v1/reports` |
| Timestamp | `timestamp` (datetime) | `reports` | `POST /api/v1/reports` |
| GPS (optional) | `latitude`, `longitude` (float, nullable) | `reports` | `POST /api/v1/reports` |
| Device type | `device_type` (enum `ANDROID`, `IOS`, `WEB`, nullable) | `reports` | `POST /api/v1/reports` |

---

### Live Status — ✅ 4/4 Implemented

| Required Field | Computation | API Endpoint |
|---|---|---|
| Latest report | `findFirst` ordered by timestamp desc, filtered by neighborhood | `GET /api/v1/reports/status?neighborhoodId=` |
| Number of reports | `count` filtered by neighborhood | Same endpoint |
| Confidence score | `% of reports in last 1hr / total reports * 100` | Same endpoint |
| Last updated time | `latestReport.timestamp` | Same endpoint |

---

### Outage History — ✅ 4/4 Implemented

| Required Field | DB Column | Table | API Endpoint |
|---|---|---|---|
| Start time | `start_time` (datetime) | `outages` | `GET /api/v1/reports/outages` |
| End time | `end_time` (datetime, nullable) | `outages` | `GET /api/v1/reports/outages` |
| Duration | `duration` (int, minutes, nullable) | `outages` | `GET /api/v1/reports/outages` |
| Number of reports | `report_count` (int) | `outages` | `GET /api/v1/reports/outages` |

---

### Notifications — ✅ 4/4 Implemented

| Required Field | DB Column | Table | API Endpoint |
|---|---|---|---|
| Notification sent | `sent` (boolean) + `sent_at` (datetime) | `notification_logs` | `POST /api/v1/notifications` |
| Delivered | `delivered` (boolean) + `delivered_at` (datetime, nullable) | `notification_logs` | `PATCH /api/v1/notifications/:id/read` |
| Opened | `opened` (boolean) + `opened_at` (datetime, nullable) | `notification_logs` | `PATCH /api/v1/notifications/:id/read` |
| Clicked | `clicked` (boolean) + `clicked_at` (datetime, nullable) | `notification_logs` | `PATCH /api/v1/notifications/:id/read` |

---

## Summary

| Category | Required | Implemented | Completion |
|---|---|---|---|
| One Tap Reporting | 7 fields | 7 | **100%** |
| Live Status | 4 fields | 4 | **100%** |
| Outage History | 4 fields | 4 | **100%** |
| Notifications | 4 fields | 4 | **100%** |
| **Total** | **19 fields** | **19** | **100%** ✅ |

---

## Data Tables in the Database

| Table | Rows Estimate | Purpose |
|---|---|---|
| `users` | N users | Accounts, auth, profile, location |
| `countries` | 1 | Nigeria |
| `states` | 37 | Nigerian states |
| `lgas` | 774 | Local Government Areas |
| `cities` | ~774 | Cities (one per LGA) |
| `towns` | ~1000+ | Towns |
| `neighborhoods` | ~4000+ | 4 per town (Central, East, West, South) |
| `reports` | N reports | Power ON/OFF reports + GPS + device type |
| `outages` | N outages | Auto-detected outage windows |
| `outage_reports` | N junctions | Links reports to outages |
| `notification_logs` | N logs | Track send/deliver/open/click |
| `devices` | N devices | FCM tokens for push |
| `refresh_tokens` | N tokens | JWT session management |
| `otps` | N codes | Email verification & password reset |

---

## Full API Endpoint Reference

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login |
| POST | `/logout` | No | Logout |
| POST | `/refresh-token` | No | Refresh JWT tokens |
| POST | `/send-otp` | No | Send verification OTP |
| POST | `/resend-otp` | No | Resend OTP |
| POST | `/verify-otp` | No | Verify OTP code |
| POST | `/forgot-password` | No | Request password reset |
| POST | `/reset-password` | No | Reset password with OTP |

### Locations (`/api/v1/locations`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/reverse-geocode` | No | Resolve GPS → location hierarchy |
| GET | `/search` | No | Search locations by name |

### Reports (`/api/v1/reports`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Yes | Submit power report (ON/OFF) |
| POST | `/power-off` | Yes | Convenience: report OFF |
| POST | `/power-on` | Yes | Convenience: report ON |
| GET | `/` | Yes | List reports (filterable) |
| GET | `/my` | Yes | Current user's reports |
| GET | `/location` | Yes | Reports by neighborhood |
| GET | `/status` | Yes | **Live status** (latest, count, confidence) |
| GET | `/outages` | Yes | List outages |
| GET | `/outages/:id` | Yes | Single outage with reports |
| GET | `/:id` | Yes | Single report |
| DELETE | `/:id` | Yes | Delete report |

### Notifications (`/api/v1/notifications`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Yes | Send in-app notification |
| GET | `/` | Yes | List notifications |
| GET | `/unread-count` | Yes | Unread count |
| GET | `/:id` | Yes | Single notification |
| PATCH | `/:id/read` | Yes | Mark opened/clicked |
| DELETE | `/:id` | Yes | Delete notification |

### Admin (`/api/v1/admin`) — ADMIN only
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dashboard` | Admin | Summary counts |
| GET | `/analytics` | Admin | ON/OFF ratio, totals |
| GET | `/users` | Admin | List all users with search |
| GET | `/locations` | Admin | Full location hierarchy |
| PATCH | `/locations` | Admin | Update location name |
| POST | `/broadcast` | Admin | Push notification to all users |
| POST | `/users/:userId/suspend` | Admin | Suspend user |
| DELETE | `/users/:userId` | Admin | Delete user |
| DELETE | `/reports/:id` | Admin | Delete any report |

### Analytics (`/api/v1/analytics`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/power` | Yes | ON/OFF stats, top neighborhoods |
| GET | `/outages` | Yes | Outage stats, avg duration |
| GET | `/users` | Yes | User stats, top reporters |
| GET | `/locations` | Yes | Per-neighborhood breakdown |

### History (`/api/v1/history`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/weekly` | Yes | Weekly breakdown by month |
| GET | `/monthly` | Yes | Monthly breakdown by year |
| GET | `/outage-hours` | Yes | Total outage hours |
| GET | `/power-timeline` | Yes | Hourly/daily timeline |

### Health (`/api/v1/health`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | Full health check |
| GET | `/database` | No | DB connection latency |
| GET | `/firebase` | No | Firebase status |

### System
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Server uptime |
| GET | `/docs` | No | Swagger UI (dev only) |
