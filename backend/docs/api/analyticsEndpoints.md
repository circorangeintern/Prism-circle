# Analytics Endpoints

---

## Power Statistics

Get ON/OFF report counts, percentages, and top reported neighborhoods.

**Method:** `GET`

**Endpoint:** `/api/v1/analytics/power`

**Authentication:** Bearer Token

---

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | String | No | ISO 8601 start date |
| endDate | String | No | ISO 8601 end date |

---

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Power statistics fetched.",
  "data": {
    "totalReports": 1200,
    "onReports": 800,
    "offReports": 400,
    "onPercentage": "66.7",
    "offPercentage": "33.3",
    "topNeighborhoods": [
      {
        "neighborhoodId": 9012,
        "neighborhoodName": "Central",
        "reportCount": 150
      }
    ]
  }
}
```

---

## Outage Statistics

Get outage counts, average duration, and top outage-prone neighborhoods.

**Method:** `GET`

**Endpoint:** `/api/v1/analytics/outages`

**Authentication:** Bearer Token

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
  "totalOutages": 340,
  "activeOutages": 12,
  "completedOutages": 328,
  "averageDurationMinutes": 45,
  "topNeighborhoods": [
    {
      "neighborhoodId": 9012,
      "neighborhoodName": "Central",
      "outageCount": 25,
      "averageDurationMinutes": 60
    }
  ]
}
```

---

## User Statistics

Get user counts, verification rates, distribution by state, and top reporters.

**Method:** `GET`

**Endpoint:** `/api/v1/analytics/users`

**Authentication:** Bearer Token

---

### Success Response

```json
{
  "totalUsers": 150,
  "verifiedUsers": 120,
  "unverifiedUsers": 30,
  "adminUsers": 2,
  "verificationRate": "80.0",
  "usersByState": [
    {
      "stateId": 25,
      "stateName": "Lagos",
      "userCount": 50
    }
  ],
  "topReporters": [
    {
      "userId": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "reportCount": 200
    }
  ]
}
```

---

## Location Statistics

Get per-neighborhood breakdown with report counts, outage counts, and user counts.

**Method:** `GET`

**Endpoint:** `/api/v1/analytics/locations`

**Authentication:** Bearer Token

---

### Success Response

```json
{
  "totalNeighborhoods": 4000,
  "neighborhoods": [
    {
      "id": 9012,
      "name": "Central",
      "town": "Main Town",
      "city": "Main City",
      "lga": "Main LGA",
      "state": "Lagos",
      "reportCount": 150,
      "outageCount": 25,
      "userCount": 30
    }
  ]
}
```
