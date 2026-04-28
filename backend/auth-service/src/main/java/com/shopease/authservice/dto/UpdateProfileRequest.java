package com.shopease.authservice.dto;

import jakarta.validation.constraints.Size;

import java.util.List;

public record UpdateProfileRequest(
        @Size(max = 255, message = "Name is too long")
        String name,

        @Size(max = 20, message = "Phone is too long")
        String phone,

        String dateOfBirth,

        @Size(max = 30, message = "Gender is too long")
        String gender,

        @Size(max = 1000, message = "Address is too long")
        String address,

        List<AddressDto> addresses
) {
}
