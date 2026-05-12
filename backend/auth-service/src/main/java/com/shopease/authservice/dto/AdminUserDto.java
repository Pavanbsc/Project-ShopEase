package com.shopease.authservice.dto;

public record AdminUserDto(
        Long id,
        String name,
        String email,
        String role,
        String createdAt,
        String updatedAt
) {
}