package com.shopease.cart.dto;

public class CartItemDto {
    public Long id;
    public Long cartId;
    public Long productId;
    public String productName;
    public String brand;
    public Double price;
    public Double originalPrice;
    public String imageUrl;
    public Integer quantity;
    public String sellerName;
    public String category;
    public Integer stockQuantity;

    public CartItemDto() {}

    public CartItemDto(Long id, Long cartId, Long productId, String productName, String brand, 
                       Double price, Double originalPrice, String imageUrl, Integer quantity,
                       String sellerName, String category, Integer stockQuantity) {
        this.id = id;
        this.cartId = cartId;
        this.productId = productId;
        this.productName = productName;
        this.brand = brand;
        this.price = price;
        this.originalPrice = originalPrice;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.sellerName = sellerName;
        this.category = category;
        this.stockQuantity = stockQuantity;
    }
}
