package com.shopease.cart.controller;

import com.shopease.cart.dto.CartDto;
import com.shopease.cart.dto.CartItemDto;
import com.shopease.cart.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CartDto> getCart(@PathVariable Long userId) {
        CartDto cart = cartService.getOrCreateCart(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<CartDto> addProductToCart(@PathVariable Long userId, @RequestBody CartItemDto itemDto) {
        CartDto updatedCart = cartService.addProductToCart(userId, itemDto);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<CartDto> removeProductFromCart(@PathVariable Long userId, @PathVariable Long productId) {
        CartDto updatedCart = cartService.removeProductFromCart(userId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<CartDto> updateCartItemQuantity(
            @PathVariable Long userId,
            @PathVariable Long productId,
            @RequestParam(value = "quantity", defaultValue = "1") Integer quantity) {
        CartDto updatedCart = cartService.updateCartItemQuantity(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
