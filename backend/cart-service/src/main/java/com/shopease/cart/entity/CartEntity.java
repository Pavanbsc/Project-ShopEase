package com.shopease.cart.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
public class CartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY, targetEntity = CartItemEntity.class)
    @JoinColumn(name = "cart_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<CartItemEntity> items = new ArrayList<>();

    private Boolean active = true;

    private OffsetDateTime createdAt = OffsetDateTime.now();

    private OffsetDateTime updatedAt = OffsetDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<CartItemEntity> getItems() { return items; }
    public void setItems(List<CartItemEntity> items) { this.items = items; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
