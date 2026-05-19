package com.shopease.authservice.controller;

import com.shopease.authservice.dto.AuthResponse;
import com.shopease.authservice.dto.LoginRequest;
import com.shopease.authservice.dto.MembershipAccessDto;
import com.shopease.authservice.dto.MembershipPlanDto;
import com.shopease.authservice.dto.RegisterRequest;
import com.shopease.authservice.dto.SubscribeMembershipRequest;
import com.shopease.authservice.dto.UpdateProfileRequest;
import com.shopease.authservice.dto.UserMembershipDto;
import com.shopease.authservice.dto.UserProfileDto;
import com.shopease.authservice.dto.UserDto;
import com.shopease.authservice.service.AuthService;
import com.shopease.authservice.service.MembershipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"}, allowedHeaders = "*", methods = {org.springframework.web.bind.annotation.RequestMethod.GET, org.springframework.web.bind.annotation.RequestMethod.POST, org.springframework.web.bind.annotation.RequestMethod.PUT, org.springframework.web.bind.annotation.RequestMethod.DELETE, org.springframework.web.bind.annotation.RequestMethod.OPTIONS})
@Tag(name = "Auth & Membership", description = "Authentication, user profile, and membership APIs")
public class AuthController {

    private final AuthService authService;
    private final MembershipService membershipService;

    public AuthController(AuthService authService, MembershipService membershipService) {
        this.authService = authService;
        this.membershipService = membershipService;
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user using email and password")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Register user", description = "Creates a new user account")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/users/{userId}/profile")
    @Operation(summary = "Get user profile", description = "Fetches profile details by user id")
    public ResponseEntity<UserProfileDto> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(authService.getProfile(userId));
    }

    @PutMapping("/users/{userId}/profile")
    @Operation(summary = "Update user profile", description = "Updates user profile fields")
    public ResponseEntity<UserProfileDto> updateProfile(
            @PathVariable Long userId,
            @RequestBody @Valid UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(authService.updateProfile(userId, request));
    }

    @GetMapping("/memberships/plans")
    @Operation(summary = "Get membership plans", description = "Returns all available membership plans")
    public ResponseEntity<List<MembershipPlanDto>> getMembershipPlans() {
        return ResponseEntity.ok(membershipService.getPlans());
    }

    @GetMapping("/users/{userId}/membership")
    @Operation(summary = "Get membership status", description = "Returns active membership details for a user")
    public ResponseEntity<UserMembershipDto> getMembershipStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(membershipService.getMembershipStatus(userId));
    }

    @GetMapping("/users")
    @Operation(summary = "List users", description = "Returns a list of all registered users (minimal details)")
    public ResponseEntity<List<UserDto>> listUsers() {
        return ResponseEntity.ok(authService.listAllUsers());
    }

    @PostMapping("/users/{userId}/membership/subscribe")
    @Operation(summary = "Subscribe membership", description = "Creates or updates membership subscription for a user")
    public ResponseEntity<UserMembershipDto> subscribeMembership(
            @PathVariable Long userId,
            @RequestBody @Valid SubscribeMembershipRequest request
    ) {
        return ResponseEntity.ok(membershipService.subscribe(userId, request));
    }

    @GetMapping("/users/{userId}/membership/access/{feature}")
    @Operation(summary = "Check membership feature access", description = "Checks whether a user can access a membership feature")
    public ResponseEntity<MembershipAccessDto> checkMembershipAccess(
            @PathVariable Long userId,
            @PathVariable String feature
    ) {
        return ResponseEntity.ok(membershipService.checkFeatureAccess(userId, feature));
    }
}