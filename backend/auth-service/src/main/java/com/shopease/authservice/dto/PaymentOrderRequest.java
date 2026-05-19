package com.shopease.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record PaymentOrderRequest(
        @NotNull(message = "User id is required")
        Long userId,

        @NotBlank(message = "Purpose is required")
        String purpose,

        String referenceType,

        String referenceId,

        String plan,

        String billingCycle,

        Boolean autoRenew,

        Integer amountPaise,

        Map<String, String> metadata
) {
}