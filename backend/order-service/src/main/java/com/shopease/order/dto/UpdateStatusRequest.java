package com.shopease.order.dto;

import com.shopease.order.model.OrderStatus;

public class UpdateStatusRequest {
    private OrderStatus status;

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}
