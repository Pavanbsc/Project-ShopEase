package com.shopease.cart.repository;

import com.shopease.cart.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    Optional<CartEntity> findByUserId(Long userId);
    Optional<CartEntity> findByUserIdAndActiveTrue(Long userId);
}
