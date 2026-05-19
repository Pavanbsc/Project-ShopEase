package com.shopease.product.controller;

import com.shopease.product.dto.ProductDto;
import com.shopease.product.entity.ProductEntity;
import com.shopease.product.service.ProductService;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductEntity> createProduct(@RequestBody ProductDto dto) {
        ProductEntity created = productService.createProduct(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> listProducts(@RequestParam(defaultValue = "false") boolean includeDisabled) {
        return ResponseEntity.ok(productService.listProducts(includeDisabled));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id, @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductDto> updateStock(@PathVariable Long id, @RequestBody Map<String, Integer> payload) {
        return ResponseEntity.ok(productService.updateStock(id, payload.get("stockQuantity")));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductDto> updateStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> payload) {
        return ResponseEntity.ok(productService.setProductActive(id, payload.get("active")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

}
