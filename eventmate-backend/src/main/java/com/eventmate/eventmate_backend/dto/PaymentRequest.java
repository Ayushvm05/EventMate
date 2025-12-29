package com.eventmate.eventmate_backend.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long bookingId;
    private String paymentMethod; // e.g. "Card"
}