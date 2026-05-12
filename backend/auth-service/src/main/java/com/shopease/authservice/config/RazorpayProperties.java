package com.shopease.authservice.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.razorpay")
public class RazorpayProperties {

    private String keyId;
    private String keySecret;
    private String currency = "INR";
    private boolean paymentCapture = true;
    private boolean trustAllSsl = false;

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getKeySecret() {
        return keySecret;
    }

    public void setKeySecret(String keySecret) {
        this.keySecret = keySecret;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        if (currency != null && !currency.isBlank()) {
            this.currency = currency.trim().toUpperCase();
        }
    }

    public boolean isPaymentCapture() {
        return paymentCapture;
    }

    public void setPaymentCapture(boolean paymentCapture) {
        this.paymentCapture = paymentCapture;
    }

    public boolean isTrustAllSsl() {
        return trustAllSsl;
    }

    public void setTrustAllSsl(boolean trustAllSsl) {
        this.trustAllSsl = trustAllSsl;
    }
}