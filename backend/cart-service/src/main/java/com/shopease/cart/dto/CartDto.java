package com.shopease.cart.dto;

import java.util.List;

public class CartDto {
    public Long id;
    public Long userId;
    public List<CartItemDto> items;
    public Boolean active;
    public String createdAt;
    public String updatedAt;

    public CartDto() {}

    public CartDto(Long id, Long userId, List<CartItemDto> items, Boolean active, String createdAt, String updatedAt) {
        this.id = id;
        this.userId = userId;
        this.items = items;
        this.active = active;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
