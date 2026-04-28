package com.shopease.authservice.controller;

import com.shopease.authservice.dto.AuthResponse;
import com.shopease.authservice.dto.LoginRequest;
import com.shopease.authservice.dto.RegisterRequest;
import com.shopease.authservice.dto.UpdateProfileRequest;
import com.shopease.authservice.dto.UserProfileDto;
import com.shopease.authservice.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
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
}