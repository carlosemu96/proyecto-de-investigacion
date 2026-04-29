package com.grupone.maintenance.service;

import com.grupone.maintenance.exception.ResourceNotFoundException;
import com.grupone.maintenance.model.Vehicle;
import com.grupone.maintenance.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    public Vehicle findById(String id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + id));
    }

    public Vehicle create(Vehicle vehicle) {
        vehicleRepository.findByPlate(vehicle.getPlate()).ifPresent(existing -> {
            throw new IllegalArgumentException("Plate already exists: " + vehicle.getPlate());
        });
        return vehicleRepository.save(vehicle);
    }

    public Vehicle update(String id, Vehicle updated) {
        Vehicle existing = findById(id);
        if (!existing.getPlate().equals(updated.getPlate())) {
            vehicleRepository.findByPlate(updated.getPlate()).ifPresent(conflict -> {
                throw new IllegalArgumentException("Plate already exists: " + updated.getPlate());
            });
        }

        existing.setPlate(updated.getPlate());
        existing.setBrand(updated.getBrand());
        existing.setModel(updated.getModel());
        existing.setYear(updated.getYear());
        existing.setCurrentMileage(updated.getCurrentMileage());
        existing.setStatus(updated.getStatus());
        return vehicleRepository.save(existing);
    }

    public void delete(String id) {
        Vehicle existing = findById(id);
        vehicleRepository.delete(existing);
    }
}
