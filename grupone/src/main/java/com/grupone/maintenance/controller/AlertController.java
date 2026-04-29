package com.grupone.maintenance.controller;

import com.grupone.maintenance.model.Alert;
import com.grupone.maintenance.model.AlertStatus;
import com.grupone.maintenance.service.AlertService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<Alert> getAll(@RequestParam(required = false, defaultValue = "false") boolean openOnly) {
        return openOnly ? alertService.findOpen() : alertService.findAll();
    }

    @GetMapping("/{id}")
    public Alert getById(@PathVariable String id) {
        return alertService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Alert create(@Valid @RequestBody Alert alert) {
        return alertService.create(alert);
    }

    @PatchMapping("/{id}/status")
    public Alert updateStatus(@PathVariable String id, @RequestParam AlertStatus status) {
        return alertService.updateStatus(id, status);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        alertService.delete(id);
    }
}
