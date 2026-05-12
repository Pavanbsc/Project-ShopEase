package com.shopease.authservice.dto;

import java.time.LocalDateTime;

public record PaymentOrderResponse(
        Long paymentTransactionId,
        String purpose,
        String referenceType,
        String referenceId,
        String plan,
        String billingCycle,
        boolean autoRenew,
        Integer amountPaise,
        String currency,
        String receipt,
        String razorpayOrderId,
        String keyId,
        String customerName,
        String customerEmail,
        String description,
        LocalDateTime createdAt
) {
}