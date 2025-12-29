package com.eventmate.eventmate_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class LockRequest {
    private Long showTimeId;
    private Long userId;
    private List<String> seatLabels;
}