package com.shopease.authservice.dto;

public record AdminLoginRequest(
        String email,
        String password
) {
}
