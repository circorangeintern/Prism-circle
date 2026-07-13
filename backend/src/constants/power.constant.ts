export const REPORT_TYPES = {
  ON: 'ON' as const,
  OFF: 'OFF' as const,
} as const;

export const POWER_MESSAGES = {
  REPORT_CREATED: 'Power report submitted successfully.',
  REPORT_DELETED: 'Power report deleted successfully.',
  REPORT_NOT_FOUND: 'Power report not found.',
  REPORTS_FETCHED: 'Reports fetched successfully.',
  REPORT_FETCHED: 'Report fetched successfully.',
  LIVE_STATUS_FETCHED: 'Live status fetched successfully.',
  OUTAGE_STARTED: 'Power outage started.',
  OUTAGE_ENDED: 'Power outage ended.',
  OUTAGE_NOT_FOUND: 'Outage not found.',
  OUTAGES_FETCHED: 'Outages fetched successfully.',
} as const;
