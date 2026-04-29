package com.grupone.maintenance.repository;

import com.grupone.maintenance.model.SparePart;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SparePartRepository extends MongoRepository<SparePart, String> {
    Optional<SparePart> findBySku(String sku);

    List<SparePart> findByStockLessThanEqual(Integer stock);
}
