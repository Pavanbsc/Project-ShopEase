package com.shopease.product.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

public class ProductDto {
    public Long id;
    public Long categoryId;
    public String categorySlug;
    public String name;
    public String brand;
    public String category;
    public String subcategory;
    public String description;
    public Double originalPrice;
    public Double discountPercent;
    public Double price; // final selling price
    public String currency;
    public Integer stockQuantity;
    public String stockStatus;
    public String sku;
    public String sellerType;
    public String sellerLocation;
    public List<String> images; // data URLs or image paths
    public Map<String, Object> specifications; // dynamic specs
    public List<Map<String, Object>> variants; // flexible variant objects
    public Long sellerId;
    public String sellerName;
    public Map<String, Object> deliveryInfo;
    public String warranty;
    public String returnPolicy;
    public List<String> tags;
    public Boolean active;
    public OffsetDateTime createdAt;
    public OffsetDateTime updatedAt;

    // getters/setters omitted for brevity — use public fields for simple mapping
}
