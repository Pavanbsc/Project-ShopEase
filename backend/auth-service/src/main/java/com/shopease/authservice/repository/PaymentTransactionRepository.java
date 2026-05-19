package com.shopease.authservice.repository;

import com.shopease.authservice.entity.PaymentTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransactionEntity, Long> {

    Optional<PaymentTransactionEntity> findByRazorpayOrderId(String razorpayOrderId);

    Optional<PaymentTransactionEntity> findByRazorpayPaymentId(String razorpayPaymentId);
}