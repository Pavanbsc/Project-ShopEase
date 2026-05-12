package com.shopease.authservice.controller;

import com.shopease.authservice.dto.AuthResponse;
import com.shopease.authservice.dto.AdminUserDto;
import com.shopease.authservice.dto.LoginRequest;
import com.shopease.authservice.dto.MembershipAccessDto;
import com.shopease.authservice.dto.MembershipPlanDto;
import com.shopease.authservice.dto.RegisterRequest;
import com.shopease.authservice.dto.SubscribeMembershipRequest;
import com.shopease.authservice.dto.UpdateProfileRequest;
import com.shopease.authservice.dto.UserMembershipDto;
import com.shopease.authservice.dto.UserProfileDto;
import com.shopease.authservice.dto.AdminLoginRequest;
import com.shopease.authservice.dto.AdminAuthResponse;
import com.shopease.authservice.service.AuthService;
import com.shopease.authservice.service.MembershipService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final MembershipService membershipService;

    public AuthController(AuthService authService, MembershipService membershipService) {
        this.authService = authService;
        this.membershipService = membershipService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AdminAuthResponse> adminLogin(@RequestBody @Valid AdminLoginRequest request) {
        return ResponseEntity.ok(authService.adminLogin(request));
    }

    @GetMapping("/users/{userId}/profile")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.getProfile(userId));
    }

    @PutMapping("/users/{userId}/profile")
    public ResponseEntity<UserProfileDto> updateProfile(
            @PathVariable Long userId,
            @RequestBody @Valid UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(authService.updateProfile(userId, request));
    }

    @GetMapping("/memberships/plans")
    public ResponseEntity<List<MembershipPlanDto>> getMembershipPlans() {
        return ResponseEntity.ok(membershipService.getPlans());
    }

    @GetMapping("/users/{userId}/membership")
    public ResponseEntity<UserMembershipDto> getMembershipStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(membershipService.getMembershipStatus(userId));
    }

    @PostMapping("/users/{userId}/membership/subscribe")
    public ResponseEntity<UserMembershipDto> subscribeMembership(
            @PathVariable Long userId,
            @RequestBody @Valid SubscribeMembershipRequest request
    ) {
        return ResponseEntity.ok(membershipService.subscribe(userId, request));
    }

    @GetMapping("/users/{userId}/membership/access/{feature}")
    public ResponseEntity<MembershipAccessDto> checkMembershipAccess(
            @PathVariable Long userId,
            @PathVariable String feature
    ) {
        return ResponseEntity.ok(membershipService.checkFeatureAccess(userId, feature));
    }
}