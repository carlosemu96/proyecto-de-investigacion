package com.grupone.maintenance.service;

import com.grupone.maintenance.exception.ResourceNotFoundException;
import com.grupone.maintenance.model.MaintenanceRecord;
import com.grupone.maintenance.repository.MaintenanceRecordRepository;
import com.grupone.maintenance.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Service
public class MaintenanceRecordService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceRecordService(MaintenanceRecordRepository maintenanceRecordRepository,
                                    VehicleRepository vehicleRepository) {
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<MaintenanceRecord> findAll() {
        return maintenanceRecordRepository.findAll();
    }

    public List<MaintenanceRecord> findByVehicleId(String vehicleId) {
        return maintenanceRecordRepository.findByVehicleId(vehicleId);
    }

    public List<MaintenanceRecord> findOverdue() {
        return maintenanceRecordRepository.findByPlannedDateBeforeAndStatus(LocalDate.now(), "PLANNED");
    }

    public MaintenanceRecord findById(String id) {
        return maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found: " + id));
    }

    public MaintenanceRecord create(MaintenanceRecord record) {
        vehicleRepository.findById(record.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle does not exist: " + record.getVehicleId()));
        record.setCreatedAt(Instant.now());
        return maintenanceRecordRepository.save(record);
    }

    public MaintenanceRecord update(String id, MaintenanceRecord updated) {
        MaintenanceRecord existing = findById(id);
        vehicleRepository.findById(updated.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle does not exist: " + updated.getVehicleId()));

        existing.setVehicleId(updated.getVehicleId());
        existing.setType(updated.getType());
        existing.setPlannedDate(updated.getPlannedDate());
        existing.setCompletedDate(updated.getCompletedDate());
        existing.setMileageAtService(updated.getMileageAtService());
        existing.setTotalCost(updated.getTotalCost());
        existing.setSparePartIds(updated.getSparePartIds());
        existing.setStatus(updated.getStatus());
        existing.setNotes(updated.getNotes());

        return maintenanceRecordRepository.save(existing);
    }

    public void delete(String id) {
        MaintenanceRecord existing = findById(id);
        maintenanceRecordRepository.delete(existing);
    }
}
