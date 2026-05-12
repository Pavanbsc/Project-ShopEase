package com.shopease.authservice.service;

import com.shopease.authservice.dto.MembershipPlanDto;
import com.shopease.authservice.entity.BillingCycle;
import com.shopease.authservice.entity.MembershipPlan;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.EnumMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class MembershipCatalogService {

    private record PlanConfig(String displayName, String description, int monthlyPrice, int yearlyPrice, List<String> features) {
    }

    private final Map<MembershipPlan, PlanConfig> planCatalog = new EnumMap<>(MembershipPlan.class);

    public MembershipCatalogService() {
        seedPlanCatalog();
    }

    public List<MembershipPlanDto> getPlans() {
        return planCatalog.entrySet()
                .stream()
                .map(entry -> {
                    PlanConfig cfg = entry.getValue();
                    return new MembershipPlanDto(
                            entry.getKey().name(),
                            cfg.displayName(),
                            cfg.description(),
                            cfg.monthlyPrice(),
                            cfg.yearlyPrice(),
                            cfg.features()
                    );
                })
                .toList();
    }

    public int resolvePrice(String planValue, String billingCycleValue) {
        MembershipPlan plan = parsePlan(planValue);
        BillingCycle billingCycle = parseBillingCycle(billingCycleValue);
        PlanConfig config = planCatalog.get(plan);
        if (config == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid membership plan");
        }
        return billingCycle == BillingCycle.YEARLY ? config.yearlyPrice() : config.monthlyPrice();
    }

    public List<String> getFeatures(String planValue) {
        MembershipPlan plan = parsePlan(planValue);
        PlanConfig config = planCatalog.get(plan);
        return config == null ? List.of() : config.features();
    }

    public String getDescription(String planValue) {
        MembershipPlan plan = parsePlan(planValue);
        PlanConfig config = planCatalog.get(plan);
        if (config == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid membership plan");
        }
        return config.description();
    }

    public String getDisplayName(String planValue) {
        MembershipPlan plan = parsePlan(planValue);
        PlanConfig config = planCatalog.get(plan);
        if (config == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid membership plan");
        }
        return config.displayName();
    }

    public MembershipPlan parsePlan(String value) {
        try {
            return MembershipPlan.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid membership plan");
        }
    }

    public BillingCycle parseBillingCycle(String value) {
        try {
            return BillingCycle.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid billing cycle");
        }
    }

    private void seedPlanCatalog() {
        planCatalog.put(
                MembershipPlan.PLUS,
                new PlanConfig(
                        "Plus",
                        "Great basics for smart shopping",
                        99,
                        999,
                        List.of(
                                "FREE_DELIVERY",
                                "FAST_SHIPPING",
                                "EXCLUSIVE_DISCOUNTS",
                                "CASHBACK",
                                "EARLY_ACCESS",
                                "PERSONALIZED_RECOMMENDATIONS"
                        )
                )
        );

        planCatalog.put(
                MembershipPlan.PREMIUM,
                new PlanConfig(
                        "Premium",
                        "Best value with premium perks",
                        299,
                        2999,
                        List.of(
                                "FREE_DELIVERY",
                                "FAST_SHIPPING",
                                "EXCLUSIVE_DISCOUNTS",
                                "CASHBACK",
                                "EARLY_ACCESS",
                                "PRIORITY_SUPPORT",
                                "PERSONALIZED_RECOMMENDATIONS"
                        )
                )
        );

        planCatalog.put(
                MembershipPlan.ELITE,
                new PlanConfig(
                        "Elite",
                        "Ultimate luxury shopping experience",
                        599,
                        5999,
                        List.of(
                                "FREE_DELIVERY",
                                "FAST_SHIPPING",
                                "EXCLUSIVE_DISCOUNTS",
                                "CASHBACK",
                                "EARLY_ACCESS",
                                "PRIORITY_SUPPORT",
                                "PERSONALIZED_RECOMMENDATIONS",
                                "VIP_DEALS"
                        )
                )
        );
    }
}