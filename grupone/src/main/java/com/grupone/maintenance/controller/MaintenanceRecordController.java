package com.grupone.maintenance.controller;

import com.grupone.maintenance.model.MaintenanceRecord;
import com.grupone.maintenance.service.MaintenanceRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/maintenance-records")
public class MaintenanceRecordController {

    private final MaintenanceRecordService maintenanceRecordService;

    public MaintenanceRecordController(MaintenanceRecordService maintenanceRecordService) {
        this.maintenanceRecordService = maintenanceRecordService;
    }

    @GetMapping
    public List<MaintenanceRecord> getAll(@RequestParam(required = false) String vehicleId,
                                          @RequestParam(required = false, defaultValue = "false") boolean overdue) {
        if (overdue) {
            return maintenanceRecordService.findOverdue();
        }
        if (vehicleId != null && !vehicleId.isBlank()) {
            return maintenanceRecordService.findByVehicleId(vehicleId);
        }
        return maintenanceRecordService.findAll();
    }

    @GetMapping("/{id}")
    public MaintenanceRecord getById(@PathVariable String id) {
        return maintenanceRecordService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceRecord create(@Valid @RequestBody MaintenanceRecord record) {
        return maintenanceRecordService.create(record);
    }

    @PutMapping("/{id}")
    public MaintenanceRecord update(@PathVariable String id, @Valid @RequestBody MaintenanceRecord record) {
        return maintenanceRecordService.update(id, record);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        maintenanceRecordService.delete(id);
    }
}
