package com.shopease.authservice.dto;

public record PaymentFailureResponse(
        boolean success,
        String message,
        Long paymentTransactionId,
        String status
) {
}