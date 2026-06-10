package com.grupone.maintenance.service;

import com.grupone.maintenance.exception.ResourceNotFoundException;
import com.grupone.maintenance.model.SparePart;
import com.grupone.maintenance.repository.SparePartRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
public class SparePartService {

    private final SparePartRepository sparePartRepository;

    public SparePartService(SparePartRepository sparePartRepository) {
        this.sparePartRepository = sparePartRepository;
    }

    public List<SparePart> findAll() {
        return sparePartRepository.findAll();
    }

    public List<SparePart> findAll(List<String> categories) {
        List<String> normalizedCategories = normalizeCategories(categories);
        if (normalizedCategories.isEmpty()) {
            return findAll();
        }
        return sparePartRepository.findByCategoryIn(normalizedCategories);
    }

    public List<String> findCategories() {
        return sparePartRepository.findAll().stream()
                .map(SparePart::getCategory)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(category -> !category.isBlank())
                .distinct()
                .sorted(Comparator.naturalOrder())
                .toList();
    }

    public List<SparePart> findLowStock() {
        return sparePartRepository.findAll().stream()
                .filter(part -> part.getStock() <= part.getMinStock())
                .toList();
    }

    public SparePart findById(String id) {
        return sparePartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spare part not found: " + id));
    }

    public SparePart create(SparePart sparePart) {
        sparePartRepository.findBySku(sparePart.getSku()).ifPresent(existing -> {
            throw new IllegalArgumentException("SKU already exists: " + sparePart.getSku());
        });
        return sparePartRepository.save(sparePart);
    }

    public SparePart update(String id, SparePart updated) {
        SparePart existing = findById(id);
        if (!existing.getSku().equals(updated.getSku())) {
            sparePartRepository.findBySku(updated.getSku()).ifPresent(conflict -> {
                throw new IllegalArgumentException("SKU already exists: " + updated.getSku());
            });
        }

        existing.setSku(updated.getSku());
        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setStock(updated.getStock());
        existing.setMinStock(updated.getMinStock());
        existing.setUnitCost(updated.getUnitCost());
        return sparePartRepository.save(existing);
    }

    public SparePart adjustStock(String id, Integer delta) {
        SparePart part = findById(id);
        int newStock = part.getStock() + delta;
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        part.setStock(newStock);
        return sparePartRepository.save(part);
    }

    public void delete(String id) {
        SparePart existing = findById(id);
        sparePartRepository.delete(existing);
    }

    private List<String> normalizeCategories(List<String> categories) {
        if (categories == null) {
            return List.of();
        }
        return categories.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(category -> !category.isBlank())
                .distinct()
                .toList();
    }
}
