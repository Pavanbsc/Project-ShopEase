package com.shopease.authservice.dto;

public record AddressDto(
        Long id,
        String street,
        String city,
        String state,
        String pincode,
        String phone
) {
}
