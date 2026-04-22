package org.SmartShop.repository;

import org.SmartShop.entity.Client;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Client> findByLinkedAccountId(Long userId);
}