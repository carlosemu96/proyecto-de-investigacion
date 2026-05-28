/** Maintenance record linking a vehicle to a service event */
export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  /** PREVENTIVE = scheduled, CORRECTIVE = unplanned repair */
  type: 'PREVENTIVE' | 'CORRECTIVE';
  /** Scheduled service date (ISO YYYY-MM-DD) */
  plannedDate: string;
  /** Actual completion date (ISO YYYY-MM-DD) */
  completedDate: string;
  /** Odometer reading at the time of service */
  mileageAtService: number;
  totalCost: number;
  /** IDs of spare parts consumed during service */
  sparePartIds: string[];
  /** Lifecycle status: PLANNED | IN_PROGRESS | COMPLETED | OVERDUE */
  status: string;
  notes: string;
  /** ISO DateTime of record creation */
  createdAt: string;
}

/** Mock maintenance records for UI development */
export const MOCK_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: '1',
    vehicleId: '1',
    type: 'PREVENTIVE',
    plannedDate: '2026-06-01',
    completedDate: '',
    mileageAtService: 45000,
    totalCost: 120.00,
    sparePartIds: ['1', '3'],
    status: 'PLANNED',
    notes: 'Routine oil change and spark plug replacement',
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: '2',
    vehicleId: '2',
    type: 'CORRECTIVE',
    plannedDate: '2026-05-15',
    completedDate: '2026-05-16',
    mileageAtService: 62000,
    totalCost: 340.00,
    sparePartIds: ['2'],
    status: 'COMPLETED',
    notes: 'Brake pad replacement due to wear',
    createdAt: '2026-05-14T09:00:00Z'
  },
  {
    id: '3',
    vehicleId: '3',
    type: 'PREVENTIVE',
    plannedDate: '2026-05-10',
    completedDate: '',
    mileageAtService: 31000,
    totalCost: 0,
    sparePartIds: [],
    status: 'OVERDUE',
    notes: 'Full service inspection',
    createdAt: '2026-05-01T08:00:00Z'
  }
];
