package com.eventmate.eventmate_backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ShowTimeRequest {
    private Long eventId;
    private LocalDate date;
    private LocalTime time;
}