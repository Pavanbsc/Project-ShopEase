package com.shopease.authservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Health/Test", description = "Test endpoints")
public class TestController {

    @GetMapping("/hello")
    @Operation(summary = "Hello test", description = "Simple test endpoint to verify service is reachable")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Hello from TestController");
    }
}
