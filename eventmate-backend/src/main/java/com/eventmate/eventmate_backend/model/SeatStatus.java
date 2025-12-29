package com.eventmate.eventmate_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_status")
@Data
public class SeatStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "showtime_id", nullable = false)
    private ShowTime showTime;

    private String seatLabel; // e.g., "A1", "B5"

    @Enumerated(EnumType.STRING)
    private Status status; // AVAILABLE, LOCKED, BOOKED

    private Long lockedByUserId; // Who locked it?
    private LocalDateTime lockExpiresAt; // When does the lock expire?

    public enum Status {
        AVAILABLE, LOCKED, BOOKED
    }
}