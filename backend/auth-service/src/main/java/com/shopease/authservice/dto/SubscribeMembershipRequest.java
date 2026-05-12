package com.shopease.authservice.dto;

import jakarta.validation.constraints.NotBlank;

public record SubscribeMembershipRequest(
        @NotBlank(message = "Plan is required")
        String plan,

        @NotBlank(message = "Billing cycle is required")
        String billingCycle,

        Boolean autoRenew
) {
}
