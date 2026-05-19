package com.shopease.order.service;

import com.shopease.order.dto.OrderItemRequest;
import com.shopease.order.dto.OrderRequest;
import com.shopease.order.model.CodPaymentStatus;
import com.shopease.order.model.Order;
import com.shopease.order.model.OrderItem;
import com.shopease.order.model.OrderStatus;
import com.shopease.order.model.PaymentMethod;
import com.shopease.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setName(request.getName());
        order.setPhone(request.getPhone());
        order.setAddressLine1(request.getAddressLine1());
        order.setAddressLine2(request.getAddressLine2());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setPostalCode(request.getPostalCode());
        order.setCountry(request.getCountry());
        order.setTotalAmountPaise(request.getTotalAmountPaise());
        PaymentMethod paymentMethod = request.getPaymentMethod() == null ? PaymentMethod.COD : request.getPaymentMethod();
        order.setPaymentMethod(paymentMethod);
        order.setCodPaymentStatus(paymentMethod == PaymentMethod.COD ? CodPaymentStatus.PENDING : CodPaymentStatus.PAID);
        order.setStatus(OrderStatus.PLACED);

        if (request.getItems() != null) {
            for (OrderItemRequest it : request.getItems()) {
                OrderItem oi = new OrderItem();
                oi.setProductId(it.getProductId());
                oi.setProductName(it.getProductName());
                oi.setImageUrl(it.getImageUrl());
                oi.setPricePaise(it.getPricePaise());
                oi.setQuantity(it.getQuantity());
                order.addItem(oi);
            }
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrdersForUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> findById(Long id) { return orderRepository.findById(id); }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        if (status == OrderStatus.DELIVERED && order.getPaymentMethod() != null) {
            if (order.getPaymentMethod() == PaymentMethod.COD) {
                order.setCodPaymentStatus(CodPaymentStatus.PAID);
            }
        }
        return orderRepository.save(order);
    }
}
