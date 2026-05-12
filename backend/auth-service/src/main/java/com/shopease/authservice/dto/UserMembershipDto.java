package com.shopease.authservice.dto;

import java.time.LocalDateTime;
import java.util.List;

public record UserMembershipDto(
        Long userId,
        String plan,
        String billingCycle,
        String status,
        boolean active,
        boolean autoRenew,
        LocalDateTime startsAt,
        LocalDateTime endsAt,
        List<String> features
) {
}
