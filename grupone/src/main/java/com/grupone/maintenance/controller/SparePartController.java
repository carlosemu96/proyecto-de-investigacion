package com.grupone.maintenance.controller;

import com.grupone.maintenance.model.SparePart;
import com.grupone.maintenance.service.SparePartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spare-parts")
public class SparePartController {

    private final SparePartService sparePartService;

    public SparePartController(SparePartService sparePartService) {
        this.sparePartService = sparePartService;
    }

    @GetMapping
    public List<SparePart> getAll(@RequestParam(required = false) List<String> categories) {
        return sparePartService.findAll(categories);
    }

    @GetMapping("/low-stock")
    public List<SparePart> getLowStock() {
        return sparePartService.findLowStock();
    }

    @GetMapping("/categories")
    public List<String> getCategories() {
        return sparePartService.findCategories();
    }

    @GetMapping("/{id}")
    public SparePart getById(@PathVariable String id) {
        return sparePartService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SparePart create(@Valid @RequestBody SparePart sparePart) {
        return sparePartService.create(sparePart);
    }

    @PutMapping("/{id}")
    public SparePart update(@PathVariable String id, @Valid @RequestBody SparePart sparePart) {
        return sparePartService.update(id, sparePart);
    }

    @PatchMapping("/{id}/stock")
    public SparePart adjustStock(@PathVariable String id, @RequestParam Integer delta) {
        return sparePartService.adjustStock(id, delta);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        sparePartService.delete(id);
    }
}
