package com.shopease.product.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopease.product.dto.ProductDto;
import com.shopease.product.entity.ProductEntity;
import com.shopease.product.repository.ProductRepository;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    public ProductService(ProductRepository productRepository, ObjectMapper objectMapper) {
        this.productRepository = productRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ProductEntity createProduct(ProductDto dto) {
        ProductEntity entity = new ProductEntity();
        applyProductFields(entity, dto);
        return productRepository.save(entity);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> listProducts(boolean includeDisabled) {
        List<ProductEntity> entities = includeDisabled
                ? productRepository.findAll()
                : productRepository.findByActiveTrue();
        return entities.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDto getProduct(Long id) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return toDto(entity);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        applyProductFields(entity, dto);
        ProductEntity updated = productRepository.save(entity);
        return toDto(updated);
    }

    @Transactional
    public ProductDto updateStock(Long id, Integer stockQuantity) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        int qty = stockQuantity == null ? 0 : Math.max(stockQuantity, 0);
        entity.setStockQuantity(qty);
        entity.setStockStatus(stockStatus(qty));
        entity.setUpdatedAt(OffsetDateTime.now());
        ProductEntity updated = productRepository.save(entity);
        return toDto(updated);
    }

    @Transactional
    public ProductDto setProductActive(Long id, Boolean active) {
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        entity.setActive(active == null || active);
        entity.setUpdatedAt(OffsetDateTime.now());
        ProductEntity updated = productRepository.save(entity);
        return toDto(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private void applyProductFields(ProductEntity entity, ProductDto dto) {
        entity.setCategoryId(dto.categoryId);
        entity.setCategorySlug(dto.categorySlug);
        entity.setName(dto.name);
        entity.setBrand(dto.brand);
        entity.setCategory(dto.category);
        entity.setSubcategory(dto.subcategory);
        entity.setDescription(dto.description);
        entity.setOriginalPrice(dto.originalPrice);
        entity.setDiscountPercent(dto.discountPercent);
        entity.setPrice(dto.price);
        entity.setCurrency(dto.currency == null ? "INR" : dto.currency);
        entity.setStockQuantity(dto.stockQuantity == null ? 0 : dto.stockQuantity);
        entity.setStockStatus(dto.stockStatus == null ? stockStatus(dto.stockQuantity == null ? 0 : dto.stockQuantity) : dto.stockStatus);
        entity.setSku(dto.sku);
        entity.setSellerType(dto.sellerType);
        entity.setSellerLocation(dto.sellerLocation);
        try {
            entity.setImagesJson(dto.images == null ? null : objectMapper.writeValueAsString(dto.images));
            entity.setSpecificationsJson(dto.specifications == null ? null : objectMapper.writeValueAsString(dto.specifications));
            entity.setVariantsJson(dto.variants == null ? null : objectMapper.writeValueAsString(dto.variants));
            entity.setDeliveryInfoJson(dto.deliveryInfo == null ? null : objectMapper.writeValueAsString(dto.deliveryInfo));
            entity.setTagsJson(dto.tags == null ? null : objectMapper.writeValueAsString(dto.tags));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Invalid product payload", e);
        }
        entity.setSellerId(dto.sellerId);
        entity.setSellerName(dto.sellerName);
        entity.setWarranty(dto.warranty);
        entity.setReturnPolicy(dto.returnPolicy);
        entity.setActive(dto.active == null || dto.active);
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(OffsetDateTime.now());
        }
        entity.setUpdatedAt(OffsetDateTime.now());
    }

    private ProductDto toDto(ProductEntity entity) {
        ProductDto dto = new ProductDto();
        dto.id = entity.getId();
        dto.categoryId = entity.getCategoryId();
        dto.categorySlug = entity.getCategorySlug();
        dto.name = entity.getName();
        dto.brand = entity.getBrand();
        dto.category = entity.getCategory();
        dto.subcategory = entity.getSubcategory();
        dto.description = entity.getDescription();
        dto.originalPrice = entity.getOriginalPrice();
        dto.discountPercent = entity.getDiscountPercent();
        dto.price = entity.getPrice();
        dto.currency = entity.getCurrency();
        dto.stockQuantity = entity.getStockQuantity();
        dto.stockStatus = entity.getStockStatus();
        dto.sku = entity.getSku();
        dto.sellerType = entity.getSellerType();
        dto.sellerLocation = entity.getSellerLocation();
        dto.sellerId = entity.getSellerId();
        dto.sellerName = entity.getSellerName();
        dto.warranty = entity.getWarranty();
        dto.returnPolicy = entity.getReturnPolicy();
        dto.deliveryInfo = parseMap(entity.getDeliveryInfoJson());
        dto.images = parseList(entity.getImagesJson());
        dto.tags = parseList(entity.getTagsJson());
        dto.specifications = parseMap(entity.getSpecificationsJson());
        dto.variants = parseListOfMaps(entity.getVariantsJson());
        dto.active = entity.getActive() == null || entity.getActive();
        dto.createdAt = entity.getCreatedAt();
        dto.updatedAt = entity.getUpdatedAt();
        return dto;
    }

    private String stockStatus(int stock) {
        if (stock <= 0) return "Out of stock";
        if (stock <= 5) return "Low stock";
        return "In stock";
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parseMap(String json) {
        if (json == null || json.isBlank()) return new HashMap<>();
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    private List<String> parseList(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseListOfMaps(String json) {
        if (json == null || json.isBlank()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }
}
