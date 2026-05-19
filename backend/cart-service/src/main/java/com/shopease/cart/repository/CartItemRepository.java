package com.shopease.cart.repository;

import com.shopease.cart.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    List<CartItemEntity> findByCartId(Long cartId);
    void deleteByCartIdAndProductId(Long cartId, Long productId);
    Optional<CartItemEntity> findByCartIdAndProductId(Long cartId, Long productId);
}
