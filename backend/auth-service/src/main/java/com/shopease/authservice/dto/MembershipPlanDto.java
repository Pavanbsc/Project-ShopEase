package com.shopease.authservice.dto;

import java.util.List;

public record MembershipPlanDto(
        String id,
        String displayName,
        String description,
        Integer monthlyPrice,
        Integer yearlyPrice,
        List<String> features
) {
}
