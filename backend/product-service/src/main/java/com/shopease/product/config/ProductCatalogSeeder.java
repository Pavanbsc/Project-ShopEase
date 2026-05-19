package com.shopease.product.config;

import com.shopease.product.dto.ProductDto;
import com.shopease.product.repository.ProductRepository;
import com.shopease.product.service.ProductCatalogData;
import com.shopease.product.service.ProductService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Component
public class ProductCatalogSeeder implements ApplicationRunner {

    private final ProductRepository productRepository;
    private final ProductService productService;

    public ProductCatalogSeeder(ProductRepository productRepository, ProductService productService) {
        this.productRepository = productRepository;
        this.productService = productService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (productRepository.count() == 0) {
            for (ProductDto dto : ProductCatalogData.products()) {
                productService.createProduct(dto);
            }
        }

        enforcePinnedCategoryImages();
    }

    private void enforcePinnedCategoryImages() {
        Map<String, List<String>> pinnedImagesBySku = Map.of(
                "SHOP-LAPTOPS-1501", List.of("/products/laptops/asus1.jpg", "/products/laptops/asus2.jpg", "/products/laptops/asus3.jpg"),
                "SHOP-LAPTOPS-1502", List.of("/products/laptops/dell1.jpg", "/products/laptops/dell2.jpg", "/products/laptops/dell3.jpg"),
                "SHOP-LAPTOPS-1503", List.of("/products/laptops/hp1.jpg", "/products/laptops/hp2.jpg", "/products/laptops/hp3.jpg"),
                "SHOP-LAPTOPS-1504", List.of("/products/laptops/lenovo1.jpg", "/products/laptops/lenovo2.jpg", "/products/laptops/lenovo3.jpg"),
                "SHOP-LAPTOPS-1505", List.of("/products/laptops/acer1.jpg", "/products/laptops/acer2.jpg", "/products/laptops/acer3.jpg"),
                "SHOP-MOBILES-1401", List.of("/products/mobiles/iphone1.jpg", "/products/mobiles/iphone2.jpg", "/products/mobiles/iphone3.jpg"),
                "SHOP-MOBILES-1402", List.of("/products/mobiles/sam1.jpg", "/products/mobiles/sam2.jpg", "/products/mobiles/sam3.jpg"),
                "SHOP-MOBILES-1403", List.of("/products/mobiles/oneplus1.jpg", "/products/mobiles/oneplus2.jpg", "/products/mobiles/oneplus3.jpg"),
                "SHOP-MOBILES-1404", List.of("/products/mobiles/redmi1.jpg", "/products/mobiles/redmi2.jpg", "/products/mobiles/redmi3.jpg"),
                "SHOP-MOBILES-1405", List.of("/products/mobiles/vivo1.jpg", "/products/mobiles/vivo2.jpg", "/products/mobiles/vivo3.jpg")
        );

        for (ProductDto product : productService.listProducts(true)) {
            List<String> pinnedImages = pinnedImagesBySku.get(product.sku);
            if (pinnedImages == null) {
                continue;
            }

            if (pinnedImages.equals(product.images)) {
                continue;
            }

            product.images = pinnedImages;
            productService.updateProduct(product.id, product);
        }
    }
}
