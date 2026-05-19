package com.shopease.product.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "products")
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long categoryId;
    private String categorySlug;

    @Column(nullable = false)
    private String name;

    private String brand;
    private String category;
    private String subcategory;

    @Lob
    private String description;

    private Double originalPrice;
    private Double discountPercent;
    private Double price;
    private String currency;
    private Integer stockQuantity;
    private String stockStatus;
    private String sku;

    private String sellerType;
    private String sellerLocation;

    @Lob
    private String imagesJson;

    @Lob
    private String specificationsJson;

    @Lob
    private String variantsJson;

    private Long sellerId;
    private String sellerName;

    @Lob
    private String deliveryInfoJson;

    private String warranty;
    private String returnPolicy;

    @Lob
    private String tagsJson;

    private Boolean active = true;

    private OffsetDateTime createdAt = OffsetDateTime.now();

    private OffsetDateTime updatedAt = OffsetDateTime.now();

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(Double originalPrice) { this.originalPrice = originalPrice; }
    public Double getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Double discountPercent) { this.discountPercent = discountPercent; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }
    public String getStockStatus() { return stockStatus; }
    public void setStockStatus(String stockStatus) { this.stockStatus = stockStatus; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getSellerType() { return sellerType; }
    public void setSellerType(String sellerType) { this.sellerType = sellerType; }
    public String getSellerLocation() { return sellerLocation; }
    public void setSellerLocation(String sellerLocation) { this.sellerLocation = sellerLocation; }
    public String getImagesJson() { return imagesJson; }
    public void setImagesJson(String imagesJson) { this.imagesJson = imagesJson; }
    public String getSpecificationsJson() { return specificationsJson; }
    public void setSpecificationsJson(String specificationsJson) { this.specificationsJson = specificationsJson; }
    public String getVariantsJson() { return variantsJson; }
    public void setVariantsJson(String variantsJson) { this.variantsJson = variantsJson; }
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public String getDeliveryInfoJson() { return deliveryInfoJson; }
    public void setDeliveryInfoJson(String deliveryInfoJson) { this.deliveryInfoJson = deliveryInfoJson; }
    public String getWarranty() { return warranty; }
    public void setWarranty(String warranty) { this.warranty = warranty; }
    public String getReturnPolicy() { return returnPolicy; }
    public void setReturnPolicy(String returnPolicy) { this.returnPolicy = returnPolicy; }
    public String getTagsJson() { return tagsJson; }
    public void setTagsJson(String tagsJson) { this.tagsJson = tagsJson; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
