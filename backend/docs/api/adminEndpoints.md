# Admin Endpoints

> All admin endpoints require `Bearer Token` authentication with `ADMIN` role.

---

## Dashboard

Get summary counts for the admin dashboard.

**Method:** `GET`

**Endpoint:** `/api/v1/admin/dashboard`

**Authentication:** Bearer Token (Admin)

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Dashboard fetched.",
  "data": {
    "totalUsers": 150,
    "newUsersToday": 3,
    "totalReports": 1200,
    "reportsToday": 15,
    "reportsThisWeek": 80,
    "activeOutages": 12,
    "totalOutages": 340,
    "totalNeighborhoods": 4000
  }
}
```

---

## Analytics

Get ON/OFF report counts, totals, and ratio within an optional date range.

**Method:** `GET`

**Endpoint:** `/api/v1/admin/analytics`

**Authentication:** Bearer Token (Admin)

---

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | String | No | ISO 8601 start date |
| endDate | String | No | ISO 8601 end date |

---

### Success Response

```json
{
  "onReports": 800,
  "offReports": 400,
  "totalReports": 1200,
  "totalUsers": 150,
  "totalOutages": 340,
  "onOffRatio": "2.00"
}
```

---

## List Users

List all users with optional search and role filter.

**Method:** `GET`

**Endpoint:** `/api/v1/admin/users`

**Authentication:** Bearer Token (Admin)

---

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | Integer | No | Page number (default 1) |
| limit | Integer | No | Results per page (default 20) |
| search | String | No | Search by name or email |
| role | Enum | No | `USER` or `ADMIN` |

---

### Success Response

```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "USER",
      "emailVerified": true,
      "notificationEnabled": true,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-07-13T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

---

## List Locations

Get all location hierarchy data (countries, states, LGAs, cities, towns, neighborhoods).

**Method:** `GET`

**Endpoint:** `/api/v1/admin/locations`

**Authentication:** Bearer Token (Admin)

---

## Update Location

Update a location name.

**Method:** `PATCH`

**Endpoint:** `/api/v1/admin/locations`

**Authentication:** Bearer Token (Admin)

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | Enum | Yes | `state`, `lga`, `city`, `town`, or `neighborhood` |
| id | Integer | Yes | Location ID |
| name | String | Yes | New name |

---

### Request Example

```json
{
  "type": "town",
  "id": 4200,
  "name": "New Town Name"
}
```

---

## Send Broadcast

Send a push notification to all registered users.

**Method:** `POST`

**Endpoint:** `/api/v1/admin/broadcast`

**Authentication:** Bearer Token (Admin)

---

### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | String | Yes | Notification title (max 200 chars) |
| body | String | Yes | Notification body (max 1000 chars) |
| topic | String | No | Firebase topic (defaults to `all_users`) |

---

### Request Example

```json
{
  "title": "Scheduled Maintenance",
  "body": "Power will be interrupted from 2-4 AM tomorrow."
}
```

---

### Success Response

```json
{
  "success": true,
  "message": "Broadcast sent.",
  "data": {
    "totalUsers": 150,
    "devicesFound": 200,
    "pushSuccess": 198,
    "pushFailed": 2,
    "topic": "all_users"
  }
}
```

---

## Suspend User

Suspend a user: revokes all sessions, removes device tokens, disables notifications.

**Method:** `POST`

**Endpoint:** `/api/v1/admin/users/:userId/suspend`

**Authentication:** Bearer Token (Admin)

---

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | String (UUID) | Yes | User ID |

---

## Delete User

Permanently delete a user account.

**Method:** `DELETE`

**Endpoint:** `/api/v1/admin/users/:userId`

**Authentication:** Bearer Token (Admin)

---

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | String (UUID) | Yes | User ID |

---

## Delete Any Report

Permanently delete any report by ID (admin override).

**Method:** `DELETE`

**Endpoint:** `/api/v1/admin/reports/:id`

**Authentication:** Bearer Token (Admin)

---

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | String (UUID) | Yes | Report ID |

---

## Materialize Daily Summaries

```http
POST /api/v1/admin/materialize/daily
```

Compute and upsert daily report summaries for a given date. Populates `daily_report_summaries` table from transactional `reports` data.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| date | String (YYYY-MM-DD) | No | Today | Date to materialize |

### Response

```json
{
  "success": true,
  "message": "Daily summaries materialized.",
  "data": {
    "neighborhoodsProcessed": 4452
  }
}
```

---

## Materialize Weekly Summaries

```http
POST /api/v1/admin/materialize/weekly
```

Compute and upsert weekly outage summaries. Populates `weekly_outage_summaries` table.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| weekStart | String (YYYY-MM-DD) | No | Current week's Monday | Start of the week |

### Response

```json
{
  "success": true,
  "message": "Weekly summaries materialized.",
  "data": {
    "neighborhoodsProcessed": 3200
  }
}
```

---

## Materialize Monthly Statistics

```http
POST /api/v1/admin/materialize/monthly
```

Roll up daily and weekly summaries into monthly statistics. Populates `monthly_statistics` table.

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| monthStart | String (YYYY-MM-DD) | No | Current month | First day of the month |

### Response

```json
{
  "success": true,
  "message": "Monthly summaries materialized.",
  "data": {
    "neighborhoodsProcessed": 4452
  }
}
```
