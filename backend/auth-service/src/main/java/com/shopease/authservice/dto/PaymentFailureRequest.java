package com.shopease.authservice.dto;

import jakarta.validation.constraints.NotNull;

public record PaymentFailureRequest(
        @NotNull(message = "Payment transaction id is required")
        Long paymentTransactionId,

        String razorpayOrderId,
        String errorCode,
        String errorReason,
        String errorSource,
        String errorStep
) {
}