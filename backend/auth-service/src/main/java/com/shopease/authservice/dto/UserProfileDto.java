package com.shopease.authservice.dto;

import java.util.List;

public record UserProfileDto(
        Long id,
        String name,
        String email,
        String role,
        String phone,
        String dateOfBirth,
        String gender,
        String address,
        List<AddressDto> addresses
) {
}
