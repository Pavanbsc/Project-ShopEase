package com.shopease.cart.service;

import com.shopease.cart.dto.CartDto;
import com.shopease.cart.dto.CartItemDto;
import com.shopease.cart.entity.CartEntity;
import com.shopease.cart.entity.CartItemEntity;
import com.shopease.cart.repository.CartRepository;
import com.shopease.cart.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public CartDto getOrCreateCart(Long userId) {
        Optional<CartEntity> existing = cartRepository.findByUserIdAndActiveTrue(userId);
        CartEntity cart;
        if (existing.isPresent()) {
            cart = existing.get();
        } else {
            cart = new CartEntity();
            cart.setUserId(userId);
            cart.setActive(true);
            cart.setCreatedAt(OffsetDateTime.now());
            cart = cartRepository.save(cart);
        }
        return toDto(cart);
    }

    @Transactional
    public CartDto getCart(Long cartId) {
        Optional<CartEntity> cart = cartRepository.findById(cartId);
        return cart.map(this::toDto).orElse(null);
    }

    @Transactional
    public CartDto addProductToCart(Long userId, CartItemDto itemDto) {
        CartEntity cart = cartRepository.findByUserIdAndActiveTrue(userId)
            .orElseGet(() -> {
                CartEntity newCart = new CartEntity();
                newCart.setUserId(userId);
                newCart.setActive(true);
                return cartRepository.save(newCart);
            });

        // Check if product already in cart using direct lookup
        Optional<CartItemEntity> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), itemDto.productId);

        if (existing.isPresent()) {
            CartItemEntity item = existing.get();
            item.setQuantity(item.getQuantity() + (itemDto.quantity != null ? itemDto.quantity : 1));
            if (item.getProductName() == null || item.getProductName().isBlank()) {
                item.setProductName(itemDto.productName);
            }
            if (item.getBrand() == null || item.getBrand().isBlank()) {
                item.setBrand(itemDto.brand);
            }
            if (item.getOriginalPrice() == null) {
                item.setOriginalPrice(itemDto.originalPrice);
            }
            if (item.getImageUrl() == null || item.getImageUrl().isBlank()) {
                item.setImageUrl(itemDto.imageUrl);
            }
            if (item.getSellerName() == null || item.getSellerName().isBlank()) {
                item.setSellerName(itemDto.sellerName);
            }
            if (item.getCategory() == null || item.getCategory().isBlank()) {
                item.setCategory(itemDto.category);
            }
            if (item.getStockQuantity() == null) {
                item.setStockQuantity(itemDto.stockQuantity);
            }
            cartItemRepository.save(item);
        } else {
            CartItemEntity newItem = new CartItemEntity();
            newItem.setCartId(cart.getId());
            newItem.setProductId(itemDto.productId);
            newItem.setProductName(itemDto.productName);
            newItem.setBrand(itemDto.brand);
            newItem.setPrice(itemDto.price);
            newItem.setOriginalPrice(itemDto.originalPrice);
            newItem.setImageUrl(itemDto.imageUrl);
            newItem.setQuantity(itemDto.quantity != null ? itemDto.quantity : 1);
            newItem.setSellerName(itemDto.sellerName);
            newItem.setCategory(itemDto.category);
            newItem.setStockQuantity(itemDto.stockQuantity);
            cartItemRepository.save(newItem);
        }

        cart.setUpdatedAt(OffsetDateTime.now());
        cartRepository.save(cart);
        return toDto(cart);
    }

    @Transactional
    public CartDto removeProductFromCart(Long userId, Long productId) {
        Optional<CartEntity> cartOpt = cartRepository.findByUserIdAndActiveTrue(userId);
        if (cartOpt.isPresent()) {
            CartEntity cart = cartOpt.get();
            cartItemRepository.deleteByCartIdAndProductId(cart.getId(), productId);
            cart.setUpdatedAt(OffsetDateTime.now());
            cartRepository.save(cart);
            return toDto(cart);
        }
        return null;
    }

    @Transactional
    public CartDto updateCartItemQuantity(Long userId, Long productId, Integer quantity) {
        Optional<CartEntity> cartOpt = cartRepository.findByUserIdAndActiveTrue(userId);
        if (cartOpt.isPresent()) {
            CartEntity cart = cartOpt.get();
            List<CartItemEntity> items = cartItemRepository.findByCartId(cart.getId());
            items.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(Math.max(1, quantity != null ? quantity : 1));
                    cartItemRepository.save(item);
                });
            cart.setUpdatedAt(OffsetDateTime.now());
            cartRepository.save(cart);
            return toDto(cart);
        }
        return null;
    }

    @Transactional
    public void clearCart(Long userId) {
        Optional<CartEntity> cartOpt = cartRepository.findByUserIdAndActiveTrue(userId);
        if (cartOpt.isPresent()) {
            CartEntity cart = cartOpt.get();
            List<CartItemEntity> items = cartItemRepository.findByCartId(cart.getId());
            cartItemRepository.deleteAll(items);
            cart.setUpdatedAt(OffsetDateTime.now());
            cartRepository.save(cart);
        }
    }

    private CartDto toDto(CartEntity cart) {
        List<CartItemEntity> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemDto> itemDtos = items.stream().map(item -> new CartItemDto(
            item.getId(), item.getCartId(), item.getProductId(), item.getProductName(),
            item.getBrand(), item.getPrice(), item.getOriginalPrice(), item.getImageUrl(),
            item.getQuantity(), item.getSellerName(), item.getCategory(), item.getStockQuantity()
        )).collect(Collectors.toList());

        return new CartDto(
            cart.getId(),
            cart.getUserId(),
            itemDtos,
            cart.getActive(),
            cart.getCreatedAt() != null ? cart.getCreatedAt().toString() : null,
            cart.getUpdatedAt() != null ? cart.getUpdatedAt().toString() : null
        );
    }
}
