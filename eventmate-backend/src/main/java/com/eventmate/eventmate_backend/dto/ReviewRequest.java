package com.eventmate.eventmate_backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long eventId;
    private String content;
    private int rating;
}