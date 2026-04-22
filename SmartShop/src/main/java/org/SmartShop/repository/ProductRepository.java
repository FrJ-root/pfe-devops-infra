package org.SmartShop.repository;

import org.SmartShop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCaseAndDeletedFalseAndStockAvailableGreaterThan(String name, int stock,
            Pageable pageable);

    Page<Product> findByDeletedFalseAndStockAvailableGreaterThan(int stock, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseAndDeletedFalse(String name, Pageable pageable);

    Page<Product> findByDeletedFalse(Pageable pageable);
}