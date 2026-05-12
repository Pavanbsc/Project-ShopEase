package com.shopease.product.service;

import com.shopease.product.entity.CategoryEntity;
import com.shopease.product.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<CategoryEntity> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public CategoryEntity addCategory(String name) {
        Optional<CategoryEntity> existing = categoryRepository.findByName(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        CategoryEntity category = new CategoryEntity();
        category.setName(name);
        return categoryRepository.save(category);
    }
}