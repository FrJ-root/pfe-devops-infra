package org.SmartShop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.SmartShop.entity.PromoCode;
import java.util.Optional;

public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {
    Optional<PromoCode> findByCode(String code);
}