package com.eventmate.eventmate_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class EventRequest {
    private String title;
    private String description;
    private String category;
    private String location;
    private Double price;
    private LocalDate date;
    private LocalTime time;
    
    // ✅ FIX: Explicitly tell Jackson to map "seated" or "isSeated" to this field
    @JsonProperty("seated") 
    private boolean isSeated;
    
    private Integer totalRows;
    private Integer totalCols;
    private String seatConfig;
    private Integer totalCapacity;
    
    // Add image URL if missing
    private String imageUrl;

    // ✅ NEW FIELD: Capture the event type (MOVIE or NORMAL)
    private String eventType;
}