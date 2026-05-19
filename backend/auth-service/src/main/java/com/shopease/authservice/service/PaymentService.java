package com.shopease.authservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopease.authservice.config.RazorpayProperties;
import com.shopease.authservice.dto.PaymentFailureRequest;
import com.shopease.authservice.dto.PaymentFailureResponse;
import com.shopease.authservice.dto.PaymentOrderRequest;
import com.shopease.authservice.dto.PaymentOrderResponse;
import com.shopease.authservice.dto.PaymentVerificationRequest;
import com.shopease.authservice.dto.PaymentVerificationResponse;
import com.shopease.authservice.dto.SubscribeMembershipRequest;
import com.shopease.authservice.dto.UserMembershipDto;
import com.shopease.authservice.entity.PaymentPurpose;
import com.shopease.authservice.entity.PaymentStatus;
import com.shopease.authservice.entity.PaymentTransactionEntity;
import com.shopease.authservice.repository.PaymentTransactionRepository;
import com.shopease.authservice.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataAccessException;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final UserRepository userRepository;
    private final MembershipService membershipService;
    private final MembershipCatalogService membershipCatalogService;
    private final RazorpayProperties razorpayProperties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public PaymentService(
            PaymentTransactionRepository paymentTransactionRepository,
            UserRepository userRepository,
            MembershipService membershipService,
            MembershipCatalogService membershipCatalogService,
            RazorpayProperties razorpayProperties,
            ObjectMapper objectMapper
    ) {
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.userRepository = userRepository;
        this.membershipService = membershipService;
        this.membershipCatalogService = membershipCatalogService;
        this.razorpayProperties = razorpayProperties;
        this.objectMapper = objectMapper;
        this.httpClient = createHttpClient();
    }

    @Transactional
    public PaymentOrderResponse createOrder(PaymentOrderRequest request) {
        ensureUserExists(request.userId());

        PaymentPurpose purpose = parsePurpose(request.purpose());
        OrderQuote quote = buildQuote(request, purpose);

        PaymentTransactionEntity transaction = new PaymentTransactionEntity();
        transaction.setUserId(request.userId());
        transaction.setPurpose(purpose);
        transaction.setReferenceType(request.referenceType());
        transaction.setReferenceId(request.referenceId());
        transaction.setPlanId(request.plan());
        transaction.setBillingCycle(request.billingCycle());
        transaction.setAutoRenew(request.autoRenew());
        transaction.setAmountPaise(quote.amountPaise());
        transaction.setCurrency(quote.currency());
        transaction.setReceipt(quote.receipt());
        transaction.setStatus(PaymentStatus.CREATED);
        transaction.setNotesJson(writeNotes(request.metadata()));

        PaymentTransactionEntity saved;
        try {
            saved = paymentTransactionRepository.save(transaction);
        } catch (DataAccessException dae) {
            String txnDump = String.format("userId=%s,purpose=%s,amountPaise=%s,currency=%s,receipt=%s,planId=%s,billingCycle=%s,autoRenew=%s,notes=%s",
                    transaction.getUserId(), transaction.getPurpose(), transaction.getAmountPaise(), transaction.getCurrency(), transaction.getReceipt(), transaction.getPlanId(), transaction.getBillingCycle(), transaction.getAutoRenew(), transaction.getNotesJson());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "DB insert failed for payment transaction: " + dae.getMessage() + " | " + txnDump, dae);
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("amount", quote.amountPaise());
        payload.put("currency", quote.currency());
        payload.put("receipt", quote.receipt());
        payload.put("payment_capture", razorpayProperties.isPaymentCapture() ? 1 : 0);
        payload.put("notes", buildNotesMap(request, saved));

        Map<String, Object> gatewayOrder = createRazorpayOrder(payload);
        String gatewayOrderId = String.valueOf(gatewayOrder.get("id"));
        saved.setRazorpayOrderId(gatewayOrderId);
        saved.setStatus(PaymentStatus.PENDING);
        try {
            paymentTransactionRepository.save(saved);
        } catch (DataAccessException dae) {
            String txnDump = String.format("id=%s,userId=%s,razorpayOrderId=%s,status=%s", saved.getId(), saved.getUserId(), gatewayOrderId, saved.getStatus());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "DB update failed for payment transaction: " + dae.getMessage() + " | " + txnDump, dae);
        }

        return new PaymentOrderResponse(
                saved.getId(),
                purpose.name(),
                request.referenceType(),
                request.referenceId(),
                request.plan(),
                request.billingCycle(),
                request.autoRenew() == null || request.autoRenew(),
                quote.amountPaise(),
                quote.currency(),
                quote.receipt(),
                gatewayOrderId,
                razorpayProperties.getKeyId(),
                quote.customerName(),
                quote.customerEmail(),
                quote.description(),
                saved.getCreatedAt()
        );
    }

    @Transactional
    public PaymentVerificationResponse verifyPayment(PaymentVerificationRequest request) {
        PaymentTransactionEntity transaction = getTransaction(request.paymentTransactionId());

        if (transaction.getStatus() == PaymentStatus.PAID) {
            return new PaymentVerificationResponse(
                    true,
                    "Payment already verified",
                    transaction.getId(),
                    transaction.getRazorpayPaymentId(),
                    membershipService.getMembershipStatus(transaction.getUserId())
            );
        }

        if (!safeEquals(transaction.getRazorpayOrderId(), request.razorpayOrderId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order mismatch");
        }

        verifySignature(request.razorpayOrderId(), request.razorpayPaymentId(), request.razorpaySignature());

        transaction.setRazorpayPaymentId(request.razorpayPaymentId());
        transaction.setRazorpaySignature(request.razorpaySignature());
        transaction.setStatus(PaymentStatus.PAID);
        transaction.setPaidAt(LocalDateTime.now());
        paymentTransactionRepository.save(transaction);

        if (transaction.getPurpose() == PaymentPurpose.MEMBERSHIP) {
            SubscribeMembershipRequest membershipRequest = new SubscribeMembershipRequest(
                    transaction.getPlanId(),
                    transaction.getBillingCycle(),
                    transaction.getAutoRenew()
            );
            UserMembershipDto membership = membershipService.subscribe(transaction.getUserId(), membershipRequest);
            return new PaymentVerificationResponse(
                    true,
                    "Payment verified and membership activated",
                    transaction.getId(),
                    request.razorpayPaymentId(),
                    membership
            );
        }

        return new PaymentVerificationResponse(
                true,
                "Payment verified successfully",
                transaction.getId(),
                request.razorpayPaymentId(),
                null
        );
    }

    @Transactional
    public PaymentFailureResponse markFailed(PaymentFailureRequest request) {
        PaymentTransactionEntity transaction = getTransaction(request.paymentTransactionId());
        transaction.setStatus(PaymentStatus.FAILED);
        transaction.setRazorpayOrderId(request.razorpayOrderId() != null ? request.razorpayOrderId() : transaction.getRazorpayOrderId());
        transaction.setErrorCode(request.errorCode());
        transaction.setErrorReason(request.errorReason());
        transaction.setErrorSource(request.errorSource());
        transaction.setErrorStep(request.errorStep());
        paymentTransactionRepository.save(transaction);

        return new PaymentFailureResponse(false, "Payment failed. Membership was not updated.", transaction.getId(), transaction.getStatus().name());
    }

    private OrderQuote buildQuote(PaymentOrderRequest request, PaymentPurpose purpose) {
        if (purpose == PaymentPurpose.MEMBERSHIP) {
            if (request.plan() == null || request.plan().isBlank() || request.billingCycle() == null || request.billingCycle().isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Plan and billing cycle are required for membership payments");
            }

            int amountRupees = membershipCatalogService.resolvePrice(request.plan(), request.billingCycle());
            String displayName = membershipCatalogService.getDisplayName(request.plan());
            String description = displayName + " membership (" + request.billingCycle().trim().toUpperCase(Locale.ROOT) + ")";
            String currency = safeCurrency();
            String receipt = "mship_" + request.userId() + "_" + System.currentTimeMillis();

            return new OrderQuote(amountRupees * 100, currency, receipt, displayName, description, resolveCustomerEmail(request.userId()));
        }

        if (purpose == PaymentPurpose.CART || purpose == PaymentPurpose.BILLING) {
            if (request.amountPaise() == null || request.amountPaise() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount is required for cart payments");
            }

            String currency = safeCurrency();
            String receipt = (purpose == PaymentPurpose.CART ? "cart_" : "bill_") + request.userId() + "_" + System.currentTimeMillis();
            String customerName = resolveCustomerName(request.userId());
            String description = purpose == PaymentPurpose.CART
                    ? "ShopEase cart checkout"
                    : "ShopEase payment";

            return new OrderQuote(request.amountPaise(), currency, receipt, customerName, description, resolveCustomerEmail(request.userId()));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment purpose not supported yet");
    }

    private Map<String, Object> createRazorpayOrder(Map<String, Object> payload) {
        if (isBlank(razorpayProperties.getKeyId()) || isBlank(razorpayProperties.getKeySecret())) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Razorpay credentials are not configured");
        }

        try {
            String body = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .header("Authorization", basicAuthHeader())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                String responseBody = response.body();
                String message = "Unable to create Razorpay order";
                if (responseBody != null && !responseBody.isBlank()) {
                    message = message + ": " + responseBody;
                }
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, message);
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> parsed = objectMapper.readValue(response.body(), Map.class);
            return parsed;
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Unable to create Razorpay order", exception);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Unable to create Razorpay order: " + exception.getClass().getSimpleName() +
                            (exception.getMessage() != null && !exception.getMessage().isBlank()
                                    ? " - " + exception.getMessage()
                                    : ""),
                    exception
            );
        }
    }

    private void verifySignature(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec key = new javax.crypto.spec.SecretKeySpec(
                    razorpayProperties.getKeySecret().getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(key);
            byte[] expectedHash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expectedSignature = bytesToHex(expectedHash);
            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment signature verification failed");
            }
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payment signature verification failed");
        }
    }

    private PaymentTransactionEntity getTransaction(Long transactionId) {
        return paymentTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment transaction not found"));
    }

    private void ensureUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    private PaymentPurpose parsePurpose(String value) {
        try {
            return PaymentPurpose.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid payment purpose");
        }
    }

    private String resolveCustomerEmail(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getEmail())
                .orElse("customer@shopease.local");
    }

    private String resolveCustomerName(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getName())
                .orElse("ShopEase Customer");
    }

    private Map<String, Object> buildNotesMap(PaymentOrderRequest request, PaymentTransactionEntity transaction) {
        Map<String, Object> notes = new LinkedHashMap<>();
        notes.put("paymentTransactionId", transaction.getId());
        notes.put("userId", request.userId());
        notes.put("purpose", request.purpose());
        if (request.plan() != null) {
            notes.put("plan", request.plan());
        }
        if (request.billingCycle() != null) {
            notes.put("billingCycle", request.billingCycle());
        }
        if (request.referenceType() != null) {
            notes.put("referenceType", request.referenceType());
        }
        if (request.referenceId() != null) {
            notes.put("referenceId", request.referenceId());
        }
        if (request.metadata() != null && !request.metadata().isEmpty()) {
            notes.put("metadata", request.metadata());
        }
        return notes;
    }

    private String writeNotes(Map<String, String> metadata) {
        if (metadata == null || metadata.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(metadata);
        } catch (JsonProcessingException exception) {
            return null;
        }
    }

    private String safeCurrency() {
        return isBlank(razorpayProperties.getCurrency()) ? "INR" : razorpayProperties.getCurrency();
    }

    private String basicAuthHeader() {
        String credentials = razorpayProperties.getKeyId() + ":" + razorpayProperties.getKeySecret();
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
        return "Basic " + encoded;
    }

    private HttpClient createHttpClient() {
        HttpClient.Builder builder = HttpClient.newBuilder();
        if (razorpayProperties.isTrustAllSsl()) {
            try {
                TrustManager[] trustManagers = new TrustManager[]{new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(X509Certificate[] chain, String authType) {
                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] chain, String authType) {
                    }

                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        return new X509Certificate[0];
                    }
                }};
                SSLContext sslContext = SSLContext.getInstance("TLS");
                sslContext.init(null, trustManagers, new SecureRandom());
                builder.sslContext(sslContext);
            } catch (Exception exception) {
                log.warn("Failed to create trust-all SSL context; falling back to default SSL validation", exception);
            }
        }
        return builder.build();
    }

    private boolean safeEquals(String left, String right) {
        return left != null && left.equals(right);
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder(bytes.length * 2);
        for (byte aByte : bytes) {
            builder.append(String.format("%02x", aByte));
        }
        return builder.toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private record OrderQuote(int amountPaise, String currency, String receipt, String customerName, String description, String customerEmail) {
    }
}