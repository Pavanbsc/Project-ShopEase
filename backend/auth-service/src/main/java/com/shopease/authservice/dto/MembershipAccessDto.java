package com.shopease.authservice.dto;

public record MembershipAccessDto(
        String feature,
        boolean allowed,
        String plan,
        String status,
        String message
) {
}
