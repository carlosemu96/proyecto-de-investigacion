/** Aggregated KPI summary returned by the dashboard endpoint */
export interface DashboardSummary {
  totalVehicles: number;
  totalMaintenanceRecords: number;
  plannedMaintenances: number;
  inProgressMaintenances: number;
  completedMaintenances: number;
  /** Count of spare parts below their minStock threshold */
  lowStockParts: number;
  totalAlerts: number;
}

/** Mock summary for UI development */
export const MOCK_DASHBOARD_SUMMARY: DashboardSummary = {
  totalVehicles: 4,
  totalMaintenanceRecords: 3,
  plannedMaintenances: 1,
  inProgressMaintenances: 0,
  completedMaintenances: 1,
  lowStockParts: 2,
  totalAlerts: 3
};
