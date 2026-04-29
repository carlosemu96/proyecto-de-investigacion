package com.grupone.maintenance.service;

import com.grupone.maintenance.exception.ResourceNotFoundException;
import com.grupone.maintenance.model.Alert;
import com.grupone.maintenance.model.AlertStatus;
import com.grupone.maintenance.repository.AlertRepository;
import com.grupone.maintenance.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final VehicleRepository vehicleRepository;

    public AlertService(AlertRepository alertRepository, VehicleRepository vehicleRepository) {
        this.alertRepository = alertRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<Alert> findAll() {
        return alertRepository.findAll();
    }

    public List<Alert> findOpen() {
        return alertRepository.findByStatus(AlertStatus.OPEN);
    }

    public Alert findById(String id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
    }

    public Alert create(Alert alert) {
        vehicleRepository.findById(alert.getVehicleId())
                .orElseThrow(() -> new IllegalArgumentException("Vehicle does not exist: " + alert.getVehicleId()));
        if (alert.getStatus() == null) {
            alert.setStatus(AlertStatus.OPEN);
        }
        alert.setCreatedAt(Instant.now());
        return alertRepository.save(alert);
    }

    public Alert updateStatus(String id, AlertStatus status) {
        Alert alert = findById(id);
        alert.setStatus(status);
        if (status == AlertStatus.RESOLVED) {
            alert.setResolvedAt(Instant.now());
        }
        return alertRepository.save(alert);
    }

    public void delete(String id) {
        Alert existing = findById(id);
        alertRepository.delete(existing);
    }
}
