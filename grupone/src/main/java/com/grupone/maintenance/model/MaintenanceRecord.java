package com.grupone.maintenance.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Document(collection = "maintenance_records")
public class MaintenanceRecord {

    @Id
    private String id;

    @NotBlank
    @Indexed
    private String vehicleId;

    @NotNull
    private MaintenanceType type;

    @NotNull
    private LocalDate plannedDate;

    private LocalDate completedDate;

    @PositiveOrZero
    private Long mileageAtService;

    @PositiveOrZero
    private Double totalCost;

    private List<String> sparePartIds;

    @NotBlank
    private String status;

    private String notes;

    private Instant createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public MaintenanceType getType() {
        return type;
    }

    public void setType(MaintenanceType type) {
        this.type = type;
    }

    public LocalDate getPlannedDate() {
        return plannedDate;
    }

    public void setPlannedDate(LocalDate plannedDate) {
        this.plannedDate = plannedDate;
    }

    public LocalDate getCompletedDate() {
        return completedDate;
    }

    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }

    public Long getMileageAtService() {
        return mileageAtService;
    }

    public void setMileageAtService(Long mileageAtService) {
        this.mileageAtService = mileageAtService;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public List<String> getSparePartIds() {
        return sparePartIds;
    }

    public void setSparePartIds(List<String> sparePartIds) {
        this.sparePartIds = sparePartIds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
