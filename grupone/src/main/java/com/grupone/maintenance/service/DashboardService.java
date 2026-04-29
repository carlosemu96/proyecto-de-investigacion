package com.grupone.maintenance.service;

import com.grupone.maintenance.dto.DashboardSummaryResponse;
import com.grupone.maintenance.repository.AlertRepository;
import com.grupone.maintenance.repository.MaintenanceRecordRepository;
import com.grupone.maintenance.repository.SparePartRepository;
import com.grupone.maintenance.repository.VehicleRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final SparePartRepository sparePartRepository;
    private final AlertRepository alertRepository;

    public DashboardService(VehicleRepository vehicleRepository,
                            MaintenanceRecordRepository maintenanceRecordRepository,
                            SparePartRepository sparePartRepository,
                            AlertRepository alertRepository) {
        this.vehicleRepository = vehicleRepository;
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.sparePartRepository = sparePartRepository;
        this.alertRepository = alertRepository;
    }

    public DashboardSummaryResponse summary() {
        long totalVehicles = vehicleRepository.count();
        long totalMaintenanceRecords = maintenanceRecordRepository.count();
        long plannedMaintenances = maintenanceRecordRepository.findByStatus("PLANNED").size();
        long inProgressMaintenances = maintenanceRecordRepository.findByStatus("IN_PROGRESS").size();
        long completedMaintenances = maintenanceRecordRepository.findByStatus("COMPLETED").size();
        long lowStockParts = sparePartRepository.findAll().stream()
                .filter(part -> part.getStock() <= part.getMinStock())
                .count();
        long totalAlerts = alertRepository.count();

        return new DashboardSummaryResponse(
                totalVehicles,
                totalMaintenanceRecords,
                plannedMaintenances,
                inProgressMaintenances,
                completedMaintenances,
                lowStockParts,
                totalAlerts
        );
    }
}
