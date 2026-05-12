package com.shopease.authservice.repository;

import com.shopease.authservice.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<AdminEntity, Long> {
    Optional<AdminEntity> findByEmailIgnoreCase(String email);
    Optional<AdminEntity> findByUsername(String username);
}
