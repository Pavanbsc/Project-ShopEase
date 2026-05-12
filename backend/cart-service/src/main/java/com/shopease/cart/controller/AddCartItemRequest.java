package com.shopease.cart.controller;

public record AddCartItemRequest(Long productId, Integer quantity) {
}