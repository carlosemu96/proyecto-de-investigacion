package com.grupone.maintenance.repository;

import com.grupone.maintenance.model.Vehicle;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {
    Optional<Vehicle> findByPlate(String plate);
}
