package com.grupone.maintenance.repository;

import com.grupone.maintenance.model.MaintenanceRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface MaintenanceRecordRepository extends MongoRepository<MaintenanceRecord, String> {
    List<MaintenanceRecord> findByVehicleId(String vehicleId);

    List<MaintenanceRecord> findByStatus(String status);

    List<MaintenanceRecord> findByPlannedDateBeforeAndStatus(LocalDate cutoffDate, String status);
}
