package com.eventmate.eventmate_backend.dto;

import lombok.Data;

@Data
public class AiGenRequest {
    private String title;
    private String category;
    private String keywords; // e.g. "fun, outdoor, family"
}