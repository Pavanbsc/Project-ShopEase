package com.shopease.authservice.dto;

public record PaymentVerificationResponse(
        boolean success,
        String message,
        Long paymentTransactionId,
        String razorpayPaymentId,
        UserMembershipDto membership
) {
}