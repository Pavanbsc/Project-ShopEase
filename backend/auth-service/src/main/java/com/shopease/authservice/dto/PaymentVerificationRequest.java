package com.shopease.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentVerificationRequest(
        @NotNull(message = "Payment transaction id is required")
        Long paymentTransactionId,

        @NotBlank(message = "Razorpay order id is required")
        String razorpayOrderId,

        @NotBlank(message = "Razorpay payment id is required")
        String razorpayPaymentId,

        @NotBlank(message = "Razorpay signature is required")
        String razorpaySignature
) {
}