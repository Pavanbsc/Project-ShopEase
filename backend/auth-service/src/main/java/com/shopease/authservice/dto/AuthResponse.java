package com.shopease.authservice.dto;

public record AuthResponse(
        String message,
        String token,
        UserDto user,
        String role
) {
}