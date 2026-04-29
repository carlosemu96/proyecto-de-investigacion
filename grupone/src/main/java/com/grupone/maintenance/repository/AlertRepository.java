package com.grupone.maintenance.repository;

import com.grupone.maintenance.model.Alert;
import com.grupone.maintenance.model.AlertStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AlertRepository extends MongoRepository<Alert, String> {
    List<Alert> findByStatus(AlertStatus status);

    List<Alert> findByVehicleId(String vehicleId);
}
