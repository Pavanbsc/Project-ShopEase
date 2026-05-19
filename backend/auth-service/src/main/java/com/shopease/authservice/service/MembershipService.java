package com.shopease.authservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopease.authservice.dto.MembershipAccessDto;
import com.shopease.authservice.dto.MembershipPlanDto;
import com.shopease.authservice.dto.SubscribeMembershipRequest;
import com.shopease.authservice.dto.UserMembershipDto;
import com.shopease.authservice.entity.BillingCycle;
import com.shopease.authservice.entity.MembershipPlan;
import com.shopease.authservice.entity.MembershipStatus;
import com.shopease.authservice.entity.UserMembershipEntity;
import com.shopease.authservice.repository.UserMembershipRepository;
import com.shopease.authservice.repository.UserRepository;
import com.shopease.authservice.entity.PaymentPurpose;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class MembershipService {

    private final UserMembershipRepository userMembershipRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final MembershipCatalogService membershipCatalogService;

    public MembershipService(
            UserMembershipRepository userMembershipRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper,
            MembershipCatalogService membershipCatalogService
    ) {
        this.userMembershipRepository = userMembershipRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.membershipCatalogService = membershipCatalogService;
    }

    @Transactional(readOnly = true)
    public UserMembershipDto getMembershipStatus(Long userId) {
        ensureUserExists(userId);
        UserMembershipEntity membership = userMembershipRepository
                .findTopByUserIdOrderByUpdatedAtDesc(userId)
                .orElse(null);

        if (membership == null) {
            return new UserMembershipDto(
                    userId,
                    null,
                    null,
                    "NONE",
                    false,
                    false,
                    null,
                    null,
                    List.of()
            );
        }

        return toMembershipDto(membership);
    }

    @Transactional
    public UserMembershipDto subscribe(Long userId, SubscribeMembershipRequest request) {
        ensureUserExists(userId);

        MembershipPlan plan = membershipCatalogService.parsePlan(request.plan());
        BillingCycle billingCycle = membershipCatalogService.parseBillingCycle(request.billingCycle());

        userMembershipRepository.findFirstByUserIdAndStatusOrderByUpdatedAtDesc(userId, MembershipStatus.ACTIVE)
                .ifPresent(existing -> {
                    existing.setStatus(MembershipStatus.CANCELLED);
                    userMembershipRepository.save(existing);
                });

        LocalDateTime startsAt = LocalDateTime.now();
        LocalDateTime endsAt = billingCycle == BillingCycle.YEARLY ? startsAt.plusYears(1) : startsAt.plusMonths(1);

        UserMembershipEntity membership = new UserMembershipEntity();
        membership.setUserId(userId);
        membership.setPlan(plan);
        membership.setBillingCycle(billingCycle);
        membership.setStatus(MembershipStatus.ACTIVE);
        membership.setStartsAt(startsAt);
        membership.setEndsAt(endsAt);
        membership.setAutoRenew(request.autoRenew() == null || request.autoRenew());
        membership.setFeaturesJson(writeFeatures(membershipCatalogService.getFeatures(plan.name())));

        UserMembershipEntity saved = userMembershipRepository.save(membership);
        return toMembershipDto(saved);
    }

    @Transactional(readOnly = true)
    public List<MembershipPlanDto> getPlans() {
        return membershipCatalogService.getPlans();
    }

    @Transactional(readOnly = true)
    public MembershipAccessDto checkFeatureAccess(Long userId, String feature) {
        ensureUserExists(userId);
        String normalizedFeature = normalizeFeature(feature);

        UserMembershipEntity activeMembership = userMembershipRepository
                .findFirstByUserIdAndStatusOrderByUpdatedAtDesc(userId, MembershipStatus.ACTIVE)
                .orElse(null);

        if (activeMembership == null || activeMembership.getEndsAt().isBefore(LocalDateTime.now())) {
            return new MembershipAccessDto(
                    normalizedFeature,
                    false,
                    null,
                    "NONE",
                    "No active membership"
            );
        }

        List<String> features = readFeatures(activeMembership.getFeaturesJson());
        boolean allowed = features.contains(normalizedFeature);

        return new MembershipAccessDto(
                normalizedFeature,
                allowed,
                activeMembership.getPlan().name(),
                activeMembership.getStatus().name(),
                allowed ? "Feature access granted" : "Upgrade plan for this feature"
        );
    }

    private void ensureUserExists(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "User not found");
        }
    }

    private String normalizeFeature(String value) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "Feature key is required");
        }
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private UserMembershipDto toMembershipDto(UserMembershipEntity membership) {
        boolean active = membership.getStatus() == MembershipStatus.ACTIVE && membership.getEndsAt().isAfter(LocalDateTime.now());
        return new UserMembershipDto(
                membership.getUserId(),
                membership.getPlan().name(),
                membership.getBillingCycle().name(),
                membership.getStatus().name(),
                active,
                membership.isAutoRenew(),
                membership.getStartsAt(),
                membership.getEndsAt(),
                readFeatures(membership.getFeaturesJson())
        );
    }

    private List<String> getPlanFeatures(MembershipPlan plan) {
        return membershipCatalogService.getFeatures(plan.name());
    }

    private String writeFeatures(List<String> features) {
        try {
            return objectMapper.writeValueAsString(features);
        } catch (JsonProcessingException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to persist membership features");
        }
    }

    private List<String> readFeatures(String json) {
        if (json == null || json.isBlank()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {
            });
        } catch (JsonProcessingException exception) {
            return List.of();
        }
    }
}
