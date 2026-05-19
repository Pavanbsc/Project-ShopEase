package com.shopease.authservice.controller;

import com.shopease.authservice.dto.PaymentFailureRequest;
import com.shopease.authservice.dto.PaymentFailureResponse;
import com.shopease.authservice.dto.PaymentOrderRequest;
import com.shopease.authservice.dto.PaymentOrderResponse;
import com.shopease.authservice.dto.PaymentVerificationRequest;
import com.shopease.authservice.dto.PaymentVerificationResponse;
import com.shopease.authservice.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/payments")
@Tag(name = "Payments", description = "Order creation, verification, and failure reporting")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/orders")
    @Operation(summary = "Create payment order", description = "Creates local payment transaction and Razorpay order")
    public ResponseEntity<PaymentOrderResponse> createOrder(@RequestBody @Valid PaymentOrderRequest request) {
        return ResponseEntity.ok(paymentService.createOrder(request));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify payment", description = "Verifies Razorpay payment signature and marks payment as paid")
    public ResponseEntity<PaymentVerificationResponse> verify(@RequestBody @Valid PaymentVerificationRequest request) {
        return ResponseEntity.ok(paymentService.verifyPayment(request));
    }

    @PostMapping("/failure")
    @Operation(summary = "Report payment failure", description = "Marks a payment transaction as failed")
    public ResponseEntity<PaymentFailureResponse> failure(@RequestBody @Valid PaymentFailureRequest request) {
        return ResponseEntity.ok(paymentService.markFailed(request));
    }
}