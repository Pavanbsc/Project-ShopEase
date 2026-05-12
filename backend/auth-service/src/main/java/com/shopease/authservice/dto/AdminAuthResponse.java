package com.shopease.authservice.dto;

public record AdminAuthResponse(
        String message,
        String token,
        AdminDto admin,
        String role
) {
}
