package com.eventmate.eventmate_backend.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long eventId;
    
    // ✅ NEW: Accept Showtime ID from frontend
    private Long showTimeId; 

    private int ticketsCount;
    
    private String seats; 

    private Double totalPrice;
}