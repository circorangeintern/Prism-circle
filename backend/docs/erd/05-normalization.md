# Normalization Notes

## 1NF Compliance
- All columns are atomic (no arrays or nested objects — JSON only in `audit_logs.metadata` and `rate_limits` where intentional)
- Every table has a single-column primary key (UUID)

## 2NF Compliance
- No partial dependencies: all non-key columns depend on the full primary key
- Location hierarchy is fully normalized across 6 tables (no redundant location data)

## 3NF Compliance
- User location stored as FK references, not denormalized strings
- Report references `neighborhood_id`, not the full hierarchy (derivable via joins)
- No transitive dependencies exist

## Deliberate Denormalization

| Location | Why |
|----------|-----|
| `outages.report_count` | Avoids COUNT query on every dashboard load; updated atomically during outage creation |
| `users.latitude/longitude` | Convenience fields; the canonical hierarchy is the FK chain. Duplication is acceptable because GPS is the source of truth for geo-queries. Coordinates allow spatial queries without joining through 5 tables. |
| `daily_report_summaries` | Materialized from reports. Avoids millions of row scans for "reports per day" dashboards. |
| `weekly_outage_summaries` | Materialized from outages. Avoids aggregation over large outage tables for weekly trends. |
| `monthly_statistics` | Rolled up from daily + weekly summaries. Dashboard-ready at month granularity. |

## Why JSON on AuditLog

`AuditLog.metadata` stores variable-shaped context:
- Email change: `{ "oldEmail": "...", "newEmail": "..." }`
- Admin action: `{ "reason": "spam", "previousRole": "USER" }`
- Report deletion: `{ "reportType": "OFF", "neighborhoodId": 123 }`

Normalizing this would require an Entity-Attribute-Value (EAV) pattern, which MySQL handles poorly at scale. JSON is the pragmatic choice here.
