/** Maintenance alert entity */
export interface Alert {
  id: string;
  title: string;
  message: string;
  vehicleId: string;
  maintenanceRecordId: string;
  /** Severity level: LOW | MEDIUM | HIGH | CRITICAL */
  severity: string;
  /** OPEN = unresolved, RESOLVED = acknowledged */
  status: 'OPEN' | 'RESOLVED' | string;
  /** ISO DateTime when alert was created */
  createdAt: string;
  /** ISO DateTime when alert was resolved (empty if still open) */
  resolvedAt: string;
}

/** Mock alerts for UI development */
export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    title: 'Overdue Maintenance',
    message: 'Vehicle Ford Transit (DEF-9101) has an overdue service scheduled for 2026-05-10.',
    vehicleId: '3',
    maintenanceRecordId: '3',
    severity: 'HIGH',
    status: 'OPEN',
    createdAt: '2026-05-11T07:00:00Z',
    resolvedAt: ''
  },
  {
    id: '2',
    title: 'Low Stock Warning',
    message: 'Brake Pad Set (BRK-001) stock is below minimum threshold.',
    vehicleId: '',
    maintenanceRecordId: '',
    severity: 'MEDIUM',
    status: 'OPEN',
    createdAt: '2026-05-20T08:30:00Z',
    resolvedAt: ''
  },
  {
    id: '3',
    title: 'Maintenance Completed',
    message: 'Vehicle Honda Civic (XYZ-5678) corrective maintenance was completed.',
    vehicleId: '2',
    maintenanceRecordId: '2',
    severity: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-05-14T09:00:00Z',
    resolvedAt: '2026-05-16T15:00:00Z'
  }
];
