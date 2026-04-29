package com.grupone.maintenance.dto;

public record DashboardSummaryResponse(
        long totalVehicles,
        long totalMaintenanceRecords,
        long plannedMaintenances,
        long inProgressMaintenances,
        long completedMaintenances,
        long lowStockParts,
        long totalAlerts
) {
}
